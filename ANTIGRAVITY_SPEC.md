ANTIGRAVITY_SPEC.md

Engineering Implementation Specification

Audience: Autonomous coding agent (Google Antigravity)

This document defines how the AI Investment Research Platform should be implemented.

The Product Specification is the source of truth for user experience, functionality, and design language.

This specification focuses on implementation architecture, persistence, APIs, streaming, backend services, engineering constraints, and project boundaries.

⸻

1. Existing Foundation (Read, Don’t Rewrite)

The following components already exist and are being implemented manually as part of the learning process.

These components should be treated as stable foundations.

Do not rewrite, refactor, optimize, or replace them unless a future task explicitly instructs you to do so.

Existing implementation includes:

* Home page containing the company search interface.
* LangGraph workflow.
* Research node.
* Analysis node.
* Decision node.
* API route responsible for executing the workflow.
* Basic report page containing:
    * Verdict Banner
    * Executive Summary
    * Bull Case
    * Bear Case

Your responsibility is to extend this foundation by adding persistence, streaming, financial data, charts, dashboard enhancements, and supporting infrastructure.

Do not redesign or replace the existing LangGraph workflow.

⸻

2. Engineering Principles

The implementation should follow the following principles throughout the project.

* Preserve the existing architecture.
* Extend existing functionality rather than rewriting it.
* Keep AI orchestration independent from financial-data retrieval.
* Separate presentation logic from persistence.
* Prefer reusable modules over duplicated logic.
* Keep business logic isolated from UI components.
* Use JavaScript only. Do not introduce TypeScript.
* Follow the Product Specification for all user-facing behavior and visual design.

⸻

3. Project Architecture

Organize new functionality using a modular structure.

Recommended folder organization:

app/
  api/
    research/
    reports/
    finance/
    stream/
lib/
  agent/
  db/
  repositories/
  services/
components/
  dashboard/
  report/
  charts/

The existing lib/agent/ directory should remain responsible only for LangGraph orchestration.

Database access, financial APIs, and supporting services should remain independent.

⸻

4. Data Persistence

Implement a dedicated repository layer responsible for all report storage and retrieval.

UI components should never communicate directly with SQL.

Database access should always occur through the repository layer.

Development

Use:

* SQLite
* better-sqlite3

Production

When deployed to Vercel, migrate persistence to:

* Turso (libSQL)

The application should be designed so that replacing the storage backend requires no UI changes.

Only fully completed reports should ever be persisted.

⸻

5. Report Persistence

Every completed investment report should be stored so it can be reopened later without rerunning the AI workflow.

Selecting a report from Research History should restore the saved report exactly as it originally appeared.

Restored reports should include:

* Verdict
* Executive Summary
* Bull Case
* Bear Case
* Historical Price Chart
* Revenue vs. Net Income Chart
* Financial Health Snapshot
* News Sentiment
* AI Research Sources
* Related Reading
* Report Metadata

Only Re-run Analysis should invoke the LangGraph workflow again.

⸻

6. Report Schema

Each completed report should persist all information required to reconstruct the report.

Recommended fields:

* company_name
* ticker
* verdict
* executive_summary
* bull_case (JSON)
* bear_case (JSON)
* financial_metrics (JSON)
* historical_price_data (JSON)
* revenue_data (JSON)
* sentiment_percentage
* sentiment_label
* news_sources (JSON)
* related_articles (JSON)
* report_metadata
* created_at
* workspace_id

Incomplete reports must never be saved.

⸻

7. Workspace Isolation

Traditional authentication is intentionally not implemented.

Instead, every unique OpenAI API key represents an isolated workspace.

The raw API key must never be stored.

Instead:

* Generate a deterministic SHA-256 hash.
* Store only the resulting hash.
* Use the hash as workspace_id.

All report history should be isolated by workspace.

Users should only be able to access reports belonging to the currently active workspace.

⸻

8. Streaming Architecture

The research workflow should be exposed through Server-Sent Events (SSE).

Supported frontend clients include:

* EventSource
* Fetch Stream Reader

Polling should never be used.

The frontend should display the following status sequence:

1. Extract company information
2. Gather recent news
3. Collect financial data
4. Evaluate bull & bear arguments
5. Generate investment thesis
6. Finalize report

Only one stage should be active at a time.

Each completed stage should transition smoothly before the next begins.

Skeleton placeholders should remain visible until the report has finished rendering.

⸻

9. Financial Data

Financial metrics should never be generated or fabricated by the LLM.

Once the investment thesis has been successfully generated, retrieve financial information through a dedicated API route.

Preferred provider:

* yahoo-finance2

Retrieve:

* Historical stock prices
* Revenue history
* Net income history
* Financial ratios

The returned data powers:

* Historical Price Chart
* Revenue vs. Net Income Chart
* Financial Health Snapshot

Financial retrieval should remain completely independent of the LangGraph workflow.

⸻

10. News & Sources

Retrieve recent news articles using Tavily.

Store two distinct collections of articles.

AI Research Sources

Articles directly consumed by the AI workflow while generating the investment thesis.

Related Reading

Additional relevant articles retrieved after report generation.

Both collections should be persisted and displayed separately within the report.

⸻

11. Dashboard Features

Extend the existing dashboard with:

* Research History
* Trending Ticker Badges
* Skeleton Loading
* Live Progress Timeline
* Report Restoration

Research History should display the five most recent reports belonging to the current workspace.

Selecting a historical report should restore stored data immediately without rerunning the workflow.

⸻

12. Investment Report Features

Extend the report view by adding:

* Metadata Header
* Historical Price Chart
* Revenue vs. Net Income Chart
* Financial Health Snapshot
* News Sentiment Gauge
* AI Research Sources
* Related Reading
* Export PDF
* Re-run Analysis

Charts should be implemented using shadcn/ui chart components powered by Recharts.

All visual styling must follow the Product Specification.

⸻

13. Error Handling

The following dependencies are considered critical:

* LangGraph
* LLM Provider
* Yahoo Finance
* Tavily

If any critical dependency fails:

* Immediately stop report generation.
* Display a clear error message identifying the failed dependency.
* Do not render a partial report.
* Do not persist incomplete data.
* Allow the user to retry.

Only successfully completed reports should ever be stored.

⸻

14. Technical Constraints

The project must adhere to the following constraints:

* Next.js App Router
* JavaScript only
* Tailwind CSS v4
* npm
* Keep API routes separate from lib/agent/
* Preserve the existing LangGraph workflow
* Do not introduce additional databases
* Do not couple financial APIs into the LangGraph implementation

⸻

15. Suggested Build Order

Implement new functionality in the following order:

1. Repository layer
2. SQLite schema
3. Report persistence
4. Research History
5. Streaming endpoint
6. Agent Progress Workspace
7. Financial Data API
8. Historical Charts
9. Sentiment & News Sources
10. PDF Export
11. Turso migration

⸻

16. Out of Scope

The coding agent must not:

* Replace the existing LangGraph workflow.
* Introduce username/password authentication.
* Rewrite manually built pages.
* Modify the design language defined in the Product Specification.
* Add unapproved third-party services.
* Introduce functionality beyond the Product Specification without explicit approval.