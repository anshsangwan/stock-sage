import { dbGet, dbAll, dbRun } from '@/lib/db';

/**
 * Report Repository (Asynchronous wrapper supporting SQLite & Turso)
 *
 * Ref: ANTIGRAVITY_SPEC §4–6, §11
 * - Swapped to async DB client wrappers for Turso compatibility.
 * - All calls return promises.
 */

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Serialize a value to JSON string for storage (null-safe). */
function toJson(value) {
  if (value === null || value === undefined) return null;
  return typeof value === 'string' ? value : JSON.stringify(value);
}

/** Parse a stored JSON string back to an object/array (null-safe). */
function fromJson(value) {
  if (value === null || value === undefined) return null;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

/** Convert a raw DB row to a report object with parsed JSON fields. */
function rowToReport(row) {
  if (!row) return null;

  return {
    id: row.id,
    workspaceId: row.workspace_id,
    companyName: row.company_name,
    ticker: row.ticker,
    verdict: row.verdict,
    executiveSummary: row.executive_summary,
    bullCase: fromJson(row.bull_case),
    bearCase: fromJson(row.bear_case),
    financialMetrics: fromJson(row.financial_metrics),
    historicalPriceData: fromJson(row.historical_price_data),
    revenueData: fromJson(row.revenue_data),
    sentimentPercentage: row.sentiment_percentage,
    sentimentLabel: row.sentiment_label,
    newsSources: fromJson(row.news_sources),
    relatedArticles: fromJson(row.related_articles),
    reportMetadata: fromJson(row.report_metadata),
    createdAt: row.created_at,
  };
}

// ─── Repository Methods ─────────────────────────────────────────────────────

/**
 * Persist a fully completed report.
 *
 * @param {object} report — Report data (camelCase keys).
 * @returns {Promise<object>} — The inserted report with its new `id`.
 */
export async function createReport(report) {
  const sql = `
    INSERT INTO reports (
      workspace_id, company_name, ticker, verdict,
      executive_summary, bull_case, bear_case,
      financial_metrics, historical_price_data, revenue_data,
      sentiment_percentage, sentiment_label,
      news_sources, related_articles, report_metadata
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const info = await dbRun(sql, [
    report.workspaceId,
    report.companyName,
    report.ticker,
    report.verdict,
    report.executiveSummary,
    toJson(report.bullCase),
    toJson(report.bearCase),
    toJson(report.financialMetrics ?? null),
    toJson(report.historicalPriceData ?? null),
    toJson(report.revenueData ?? null),
    report.sentimentPercentage ?? null,
    report.sentimentLabel ?? null,
    toJson(report.newsSources ?? []),
    toJson(report.relatedArticles ?? []),
    toJson(report.reportMetadata ?? null),
  ]);

  return findById(info.lastInsertRowid);
}

/**
 * Find a single report by its ID.
 *
 * @param {number} id
 * @returns {Promise<object|null>}
 */
export async function findById(id) {
  const row = await dbGet('SELECT * FROM reports WHERE id = ?', [id]);
  return rowToReport(row);
}

/**
 * Find the most recent reports for a workspace.
 *
 * @param {string} workspaceId — SHA-256 hash of the API key.
 * @param {number} [limit=5]
 * @returns {Promise<object[]>}
 */
export async function findByWorkspace(workspaceId, limit = 5) {
  const rows = await dbAll(
    'SELECT * FROM reports WHERE workspace_id = ? ORDER BY created_at DESC LIMIT ?',
    [workspaceId, limit]
  );

  return rows.map(rowToReport);
}

/**
 * Find a report by workspace + id (authorization check).
 *
 * @param {number} id
 * @param {string} workspaceId
 * @returns {Promise<object|null>}
 */
export async function findByIdAndWorkspace(id, workspaceId) {
  const row = await dbGet(
    'SELECT * FROM reports WHERE id = ? AND workspace_id = ?',
    [id, workspaceId]
  );
  return rowToReport(row);
}
