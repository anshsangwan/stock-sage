-- AI Investment Research Platform — Report Schema
-- Ref: ANTIGRAVITY_SPEC §6

CREATE TABLE IF NOT EXISTS reports (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  workspace_id    TEXT    NOT NULL,
  company_name    TEXT    NOT NULL,
  ticker          TEXT    NOT NULL,
  verdict         TEXT    NOT NULL,                -- 'INVEST' | 'PASS'
  executive_summary TEXT  NOT NULL,
  bull_case       TEXT    NOT NULL DEFAULT '[]',   -- JSON array
  bear_case       TEXT    NOT NULL DEFAULT '[]',   -- JSON array
  financial_metrics TEXT  DEFAULT NULL,            -- JSON object (Milestone 4)
  historical_price_data TEXT DEFAULT NULL,         -- JSON array  (Milestone 4)
  revenue_data    TEXT    DEFAULT NULL,            -- JSON array  (Milestone 4)
  sentiment_percentage REAL DEFAULT NULL,          -- 0–100       (Milestone 5)
  sentiment_label TEXT    DEFAULT NULL,            -- e.g. 'Bullish' (Milestone 5)
  news_sources    TEXT    DEFAULT '[]',            -- JSON array  (Milestone 5)
  related_articles TEXT   DEFAULT '[]',            -- JSON array  (Milestone 5)
  report_metadata TEXT    DEFAULT NULL,            -- JSON object
  created_at      TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- Fast lookups by workspace, ordered newest-first
CREATE INDEX IF NOT EXISTS idx_reports_workspace
  ON reports (workspace_id, created_at DESC);
