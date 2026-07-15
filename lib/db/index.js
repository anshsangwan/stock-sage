/**
 * Database Abstraction Layer
 *
 * Supports two backends:
 *   - Turso (LibSQL)  → Used on Vercel / production when TURSO_DATABASE_URL is set.
 *   - better-sqlite3  → Used in local development only. Dynamically imported so that
 *                        its native C++ addon is never loaded or bundled on Vercel.
 *
 * Ref: ANTIGRAVITY_SPEC §4–6, §11
 */

import { join } from 'path';

let _sqliteDb = null;
let _libsqlClient = null;

// ─── Environment Detection ──────────────────────────────────────────────────
// Turso is the production database. If its URL is present, never touch the
// local filesystem at all — no mkdirSync, no better-sqlite3, no readFileSync.
const isProduction = !!process.env.TURSO_DATABASE_URL;

// ─── Inlined Schema ─────────────────────────────────────────────────────────
// Previously loaded via readFileSync(join(__dirname, 'schema.sql')).
// Inlined here so that there is zero dependency on the filesystem for schema
// resolution — webpack/Vercel bundling strips .sql files from the output
// which caused ENOENT errors at runtime.
const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS reports (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  workspace_id    TEXT    NOT NULL,
  company_name    TEXT    NOT NULL,
  ticker          TEXT    NOT NULL,
  verdict         TEXT    NOT NULL,
  executive_summary TEXT  NOT NULL,
  bull_case       TEXT    NOT NULL DEFAULT '[]',
  bear_case       TEXT    NOT NULL DEFAULT '[]',
  financial_metrics TEXT  DEFAULT NULL,
  historical_price_data TEXT DEFAULT NULL,
  revenue_data    TEXT    DEFAULT NULL,
  sentiment_percentage REAL DEFAULT NULL,
  sentiment_label TEXT    DEFAULT NULL,
  news_sources    TEXT    DEFAULT '[]',
  related_articles TEXT   DEFAULT '[]',
  report_metadata TEXT    DEFAULT NULL,
  created_at      TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_reports_workspace
  ON reports (workspace_id, created_at DESC);
`;

// ─── Local SQLite (Development Only) ────────────────────────────────────────

/**
 * Returns a local SQLite database connection.
 * Uses dynamic import() for better-sqlite3 so the native addon is never
 * loaded or bundled when deploying to Vercel.
 */
async function getSqliteDb() {
  if (_sqliteDb) return _sqliteDb;

  // Dynamic imports — these only execute when this function is actually called,
  // which only happens when isProduction === false (local dev).
  const { mkdirSync } = await import('fs');
  const { dirname } = await import('path');
  const BetterSqlite3 = (await import('better-sqlite3')).default;

  // On Vercel (without Turso), fall back to /tmp which is the only writable dir.
  // In local dev, use the project-root data/ directory for persistence.
  const dbPath = process.env.VERCEL
    ? join('/tmp', 'research.db')
    : join(process.cwd(), 'data', 'research.db');

  // Ensure parent directory exists
  mkdirSync(dirname(dbPath), { recursive: true });

  _sqliteDb = new BetterSqlite3(dbPath);

  // Enable WAL mode for better concurrent read performance
  _sqliteDb.pragma('journal_mode = WAL');

  // Run schema migration
  _sqliteDb.exec(SCHEMA_SQL);

  return _sqliteDb;
}

// ─── Turso / LibSQL (Production) ────────────────────────────────────────────

/**
 * Returns a Turso LibSQL client.
 * Uses dynamic import so local dev doesn't break if @libsql/client is not installed yet.
 */
async function getLibsqlClient() {
  if (_libsqlClient) return _libsqlClient;

  const { createClient } = await import('@libsql/client');

  _libsqlClient = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  return _libsqlClient;
}

// ─── Unified Asynchronous Query Interface ──────────────────────────────────

/**
 * Execute a query expecting a single row return.
 */
export async function dbGet(sql, params = []) {
  if (isProduction) {
    const client = await getLibsqlClient();
    const res = await client.execute({ sql, args: params });
    return res.rows[0] || null;
  } else {
    const db = await getSqliteDb();
    const stmt = db.prepare(sql);
    return (Array.isArray(params) ? stmt.get(...params) : stmt.get(params)) || null;
  }
}

/**
 * Execute a query expecting multiple rows return.
 */
export async function dbAll(sql, params = []) {
  if (isProduction) {
    const client = await getLibsqlClient();
    const res = await client.execute({ sql, args: params });
    return res.rows;
  } else {
    const db = await getSqliteDb();
    const stmt = db.prepare(sql);
    return Array.isArray(params) ? stmt.all(...params) : stmt.all(params);
  }
}

/**
 * Execute a command query (INSERT/UPDATE/DELETE).
 */
export async function dbRun(sql, params = []) {
  if (isProduction) {
    const client = await getLibsqlClient();
    const res = await client.execute({ sql, args: params });
    return { lastInsertRowid: Number(res.lastInsertRowid) };
  } else {
    const db = await getSqliteDb();
    const stmt = db.prepare(sql);
    const info = Array.isArray(params) ? stmt.run(...params) : stmt.run(params);
    return { lastInsertRowid: Number(info.lastInsertRowid) };
  }
}

// Retained for backward compatibility (e.g. direct access to sync SQLite db in dev)
export async function getDb() {
  return getSqliteDb();
}

