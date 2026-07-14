'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApiKey } from '@/lib/hooks/useApiKey';
import PriceChart from '@/components/charts/PriceChart';
import RevenueChart from '@/components/charts/RevenueChart';
import FinancialHealth from '@/components/report/FinancialHealth';
import SentimentGauge from '@/components/report/SentimentGauge';
import ActionToolbar from '@/components/report/ActionToolbar';

// Using React.use() to unwrap params in Next.js 16 Client Components (if needed) or just standard props.
// Next.js 16 app router dynamic routes provide params as a Promise.
import { use } from 'react';

/**
 * Report Restoration Page
 * 
 * Fetches and displays a saved report by ID.
 * Since the API key is stored client-side, this must be a Client Component
 * that fetches the data from the /api/reports endpoint.
 */
export default function ReportPage({ params }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  
  const { apiKey } = useApiKey();
  const router = useRouter();
  
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (apiKey === undefined) {
      // Still initializing hook
      return;
    }
    
    if (apiKey === null) {
      setError('Authentication required. Please configure your API key.');
      setLoading(false);
      return;
    }

    async function fetchReport() {
      try {
        setLoading(true);
        const res = await fetch(`/api/reports?id=${id}`, {
          headers: {
            'x-api-key': apiKey
          }
        });

        if (!res.ok) {
          if (res.status === 404) throw new Error('Report not found');
          throw new Error('Failed to load report');
        }

        const data = await res.json();
        setReport(data.report);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchReport();
  }, [id, apiKey]);

  // Save successfully loaded report to localStorage for recent searches history
  useEffect(() => {
    if (report && report.id) {
      try {
        const history = JSON.parse(localStorage.getItem('stockSage_history') || '[]');
        const updated = [
          { id: report.id, ticker: report.ticker, companyName: report.companyName },
          ...history.filter(item => item.id !== report.id)
        ].slice(0, 10); // Limit to last 10 items
        localStorage.setItem('stockSage_history', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save to localStorage:', e);
      }
    }
  }, [report]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 p-8 flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-4xl">
          <div className="h-16 bg-zinc-900 rounded-2xl w-full"></div>
          <div className="h-32 bg-zinc-900 rounded-2xl w-full"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-64 bg-zinc-900 rounded-2xl"></div>
            <div className="h-64 bg-zinc-900 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 p-8 flex flex-col items-center justify-center">
        <div className="max-w-md text-center p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
          <h2 className="text-xl font-semibold text-red-400 mb-2">Error Loading Report</h2>
          <p className="text-zinc-400 mb-6">{error}</p>
          <button 
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans pb-24">
      <main className="max-w-7xl mx-auto px-4 mt-8">
        {/* Header & Meta */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-4 mb-2">
              <h2 className="text-3xl font-bold text-white">{report.companyName}</h2>
              <SentimentGauge percentage={report.sentimentPercentage} label={report.sentimentLabel} compact={true} />
            </div>
            <div className="flex flex-wrap gap-2 text-sm text-zinc-400">
              <span className="px-2 py-1 bg-zinc-900 rounded-md border border-zinc-800 font-mono">
                {report.ticker}
              </span>
              <span className="px-2 py-1 bg-zinc-900 rounded-md border border-zinc-800">
                {new Date(report.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="no-print flex gap-2">
             <button onClick={() => router.push('/')} className="px-4 py-2 text-sm font-medium bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 rounded-lg transition-colors">
               Back
             </button>
          </div>
        </div>

        {/* Action Toolbar (Milestone 6) */}
        <div className="mb-8">
          <ActionToolbar companyName={report.companyName} ticker={report.ticker} />
        </div>

        {/* Layout Split: Left/Center 2/3 Content & Right 1/3 Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          
          {/* Central Panel (Left Column) - 2/3 Width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Financial Health Snapshot */}
            <FinancialHealth metrics={report.financialMetrics} />

            {/* Performance Charts & Indicators Box */}
            <section className="bg-zinc-900/20 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-sm font-semibold text-zinc-200 mb-6 uppercase tracking-wider flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                PERFORMANCE CHARTS & INDICATORS
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Column 1: Historical Trend */}
                <div className="flex flex-col h-full">
                  <div className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wider mb-0.5">HISTORICAL TREND</div>
                  <div className="text-xs font-semibold text-zinc-300 mb-3 line-clamp-1">Annual Stock Price Trend (Adjusted Close)</div>
                  <div className="flex-1">
                    <PriceChart data={report.historicalPriceData} />
                  </div>
                </div>

                {/* Column 2: Metrics Comparison */}
                <div className="flex flex-col h-full">
                  <div className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wider mb-0.5">METRICS COMPARISON</div>
                  <div className="text-xs font-semibold text-zinc-300 mb-3 line-clamp-1">Key Profitability & Margin Multiples</div>
                  <div className="flex-1">
                    <RevenueChart data={report.revenueData} />
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar Panel (Right Column) - 1/3 Width */}
          <div className="lg:col-span-1 space-y-6 bg-zinc-900/30 border border-zinc-800 rounded-3xl p-6 backdrop-blur-sm self-start">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
              <div className="flex flex-col">
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">AI Research Panel</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Active Core Insights</span>
                </div>
              </div>
            </div>

            {/* AI Recommendation */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">AI Recommendation</span>
              <div className={`px-4 py-2.5 rounded-xl text-center text-sm font-extrabold uppercase tracking-widest ${
                report.verdict === 'INVEST' 
                  ? 'bg-emerald-900/20 border border-emerald-900/50 text-emerald-400' 
                  : 'bg-red-900/20 border border-red-900/50 text-red-400'
              }`}>
                {report.verdict}
              </div>
            </div>

            {/* Confidence Score */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Confidence Level</span>
              <div className="text-xs font-bold text-zinc-300 uppercase tracking-wide">
                {report.sentimentPercentage}% probability score
              </div>
            </div>

            {/* Top Positive Drivers (Bull Case) */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Top Positive Drivers</span>
              <ul className="space-y-3">
                {report.bullCase && report.bullCase.length > 0 ? (
                  report.bullCase.map((point, idx) => (
                    <li key={idx} className="text-xs text-zinc-300 leading-relaxed pl-3 border-l border-emerald-500">
                      {point}
                    </li>
                  ))
                ) : (
                  <li className="text-zinc-500 italic text-xs">No bull case arguments available.</li>
                )}
              </ul>
            </div>

            {/* Top Risk Factors (Bear Case) */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Top Risk Factors</span>
              <ul className="space-y-3">
                {report.bearCase && report.bearCase.length > 0 ? (
                  report.bearCase.map((point, idx) => (
                    <li key={idx} className="text-xs text-zinc-300 leading-relaxed pl-3 border-l border-red-500">
                      {point}
                    </li>
                  ))
                ) : (
                  <li className="text-zinc-500 italic text-xs">No bear case arguments available.</li>
                )}
              </ul>
            </div>

            {/* Final AI Verdict (Executive Summary) */}
            <div className="flex flex-col gap-2 border-t border-zinc-800 pt-5 mt-5">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Final AI Verdict</span>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {report.executiveSummary}
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
