import Database from 'better-sqlite3';
import { readFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

let _sqliteDb = null;
let _libsqlClient = null;

// Determine if we should use Turso in production
const isProduction = !!process.env.TURSO_DATABASE_URL;

/**
 * Returns a local SQLite database connection.
 */
function getSqliteDb() {
  if (_sqliteDb) return _sqliteDb;

  // On Vercel, serverless functions run on a read-only filesystem except /tmp
  const dbPath = process.env.VERCEL
    ? join('/tmp', 'research.db')
    : join(process.cwd(), 'data', 'research.db');

  // Ensure the data directory exists
  mkdirSync(dirname(dbPath), { recursive: true });

  _sqliteDb = new Database(dbPath);

  // Enable WAL mode for better concurrent read performance
  _sqliteDb.pragma('journal_mode = WAL');

  // Run schema migration
  const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');
  _sqliteDb.exec(schema);

  return _sqliteDb;
}

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
    const db = getSqliteDb();
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
    const db = getSqliteDb();
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
    const db = getSqliteDb();
    const stmt = db.prepare(sql);
    const info = Array.isArray(params) ? stmt.run(...params) : stmt.run(params);
    return { lastInsertRowid: Number(info.lastInsertRowid) };
  }
}

// Retained for backward compatibility (e.g. direct access to sync SQLite db in dev)
export function getDb() {
  return getSqliteDb();
}
