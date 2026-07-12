'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApiKey } from '@/lib/hooks/useApiKey';
import ResearchHistory from '@/components/dashboard/ResearchHistory';
import TrendingTickers from '@/components/dashboard/TrendingTickers';

export default function Dashboard() {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const { apiKey } = useApiKey();

  // Temporary pseudo-auth check. Redirect to login if no API key is present.
  useEffect(() => {
    if (apiKey === undefined) return; // Hook still loading
    if (apiKey === null) {
      router.replace('/login');
    }
  }, [apiKey, router]);

  // Handle auto-focus on hash navigation for Research menu option
  useEffect(() => {
    const handleHashCheck = () => {
      if (window.location.hash === '#search') {
        const input = document.getElementById('search-input');
        if (input) {
          input.focus();
        }
      }
    };
    // Run on initial mount
    handleHashCheck();
    window.addEventListener('hashchange', handleHashCheck);
    return () => window.removeEventListener('hashchange', handleHashCheck);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim() || !apiKey) return;
    
    router.push(`/workspace?q=${encodeURIComponent(query.trim())}`);
  };

  const handleTickerSelect = (ticker) => {
    setQuery(ticker);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex flex-col items-center pt-24 px-4 font-sans">
      <main className="w-full max-w-3xl flex flex-col items-center">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Stock Sage
          </h1>
          <p className="text-lg text-zinc-400">
            AI-powered equity research platform
          </p>
        </div>

        {/* Hero Search */}
        <form onSubmit={handleSearch} className="w-full relative">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              id="search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by company name or ticker (e.g. AAPL, Tesla)"
              className="w-full pl-12 pr-4 py-4 bg-zinc-900/80 border border-zinc-800 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 shadow-lg shadow-black/20 transition-all placeholder:text-zinc-500 text-lg"
            />
            <button
              type="submit"
              className="absolute inset-y-2 right-2 px-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-colors"
            >
              Research
            </button>
          </div>
        </form>

        {/* Quick Search Chips */}
        <TrendingTickers onSelect={handleTickerSelect} />

        {/* Mission Motto Hover Card */}
        <div className="w-full max-w-xl mt-16 group cursor-default">
          <div className="relative p-6 rounded-2xl bg-zinc-900/10 border border-zinc-800/80 backdrop-blur-sm transition-all duration-500 hover:bg-zinc-900/30 hover:border-emerald-500/20 hover:shadow-xl hover:shadow-emerald-950/5">
            
            {/* Glow effect on hover */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/5 group-hover:to-teal-500/5 transition-all duration-500 pointer-events-none" />

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 group-hover:scale-105 group-hover:border-emerald-500/20 transition-all duration-300">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest">
                  OUR MISSION & MOTTO
                </span>
                <span className="text-sm font-bold text-white mt-0.5 group-hover:text-emerald-400 transition-colors">
                  Stock Sage Intelligence
                </span>
              </div>
            </div>

            <p className="mt-4 text-xs text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">
              Empowering institutional-grade equity analysis through agentic reasoning. We automate deep-web search fact-checking, financial ratio extraction, and real-time news sentiment indexing to produce objective, audit-ready research reports.
            </p>

            {/* Sub-hover details */}
            <div className="mt-4 pt-4 border-t border-zinc-900 flex justify-between items-center text-[9px] text-zinc-600 font-bold uppercase tracking-wider">
              <span>Agentic Workflows</span>
              <span className="group-hover:text-emerald-500 transition-colors">SEC Fact-Checked</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
