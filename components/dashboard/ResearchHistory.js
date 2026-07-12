'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * ResearchHistory — Displays the 5 most recent reports for the current workspace.
 *
 * Ref: ANTIGRAVITY_SPEC §11, PRODUCT_SPEC §2 (Recent Research)
 *
 * - Fetches from GET /api/reports with the API key in the x-api-key header.
 * - Columns: Company, Ticker, Research Date, Final Verdict.
 * - Clicking a row navigates to the restored report.
 *
 * @param {{ apiKey: string | null }} props
 */
export default function ResearchHistory({ apiKey }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!apiKey) {
      setReports([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchReports() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch('/api/reports', {
          headers: { 'x-api-key': apiKey },
        });

        if (!res.ok) throw new Error('Failed to load research history');

        const data = await res.json();
        if (!cancelled) setReports(data.reports ?? []);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchReports();
    return () => { cancelled = true; };
  }, [apiKey]);

  function handleRowClick(reportId) {
    router.push(`/report/${reportId}`);
  }

  // ─── Empty / Loading / Error states ──────────────────────────────────────

  if (!apiKey) return null;

  if (loading) {
    return (
      <section className="mt-10 w-full max-w-3xl mx-auto">
        <h2 className="text-lg font-semibold text-zinc-200 mb-4">
          Recent Research
        </h2>
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-12 rounded-lg bg-zinc-800/60"
            />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mt-10 w-full max-w-3xl mx-auto">
        <p className="text-sm text-red-400">{error}</p>
      </section>
    );
  }

  if (reports.length === 0) {
    return (
      <section className="mt-10 w-full max-w-3xl mx-auto">
        <h2 className="text-lg font-semibold text-zinc-200 mb-4">
          Recent Research
        </h2>
        <p className="text-sm text-zinc-500">
          No research history yet. Search for a company to get started.
        </p>
      </section>
    );
  }

  // ─── Table ───────────────────────────────────────────────────────────────

  return (
    <section className="mt-10 w-full max-w-3xl mx-auto">
      <h2 className="text-lg font-semibold text-zinc-200 mb-4">
        Recent Research
      </h2>

      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-left text-zinc-400">
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Ticker</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium text-right">Verdict</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr
                key={report.id}
                onClick={() => handleRowClick(report.id)}
                className="border-b border-zinc-800/50 last:border-0 cursor-pointer transition-colors hover:bg-zinc-800/40"
              >
                <td className="px-4 py-3 text-zinc-200">
                  {report.companyName}
                </td>
                <td className="px-4 py-3 font-mono text-zinc-400">
                  {report.ticker}
                </td>
                <td className="px-4 py-3 text-zinc-400">
                  {formatDate(report.createdAt)}
                </td>
                <td className="px-4 py-3 text-right">
                  <VerdictBadge verdict={report.verdict} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function VerdictBadge({ verdict }) {
  const isInvest = verdict === 'INVEST';

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        isInvest
          ? 'bg-emerald-500/15 text-emerald-400'
          : 'bg-red-500/15 text-red-400'
      }`}
    >
      {verdict}
    </span>
  );
}

function formatDate(isoString) {
  if (!isoString) return '—';
  try {
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return isoString;
  }
}
