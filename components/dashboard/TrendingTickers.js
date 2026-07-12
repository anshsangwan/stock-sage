'use client';

import { useState } from 'react';

const SUGGESTED_TICKERS = ['TSLA', 'NVDA', 'META', 'AAPL', 'INFY', 'GOOGL'];

/**
 * Trending Ticker Badges
 *
 * Ref: PRODUCT_SPEC §2 (Quick Search Chips)
 * Displays clickable badges for popular companies below the search bar.
 *
 * @param {{ onSelect: (ticker: string) => void }} props
 */
export default function TrendingTickers({ onSelect }) {
  return (
    <div className="flex flex-wrap justify-center gap-2 mt-6">
      {SUGGESTED_TICKERS.map((ticker) => (
        <button
          key={ticker}
          onClick={() => onSelect(ticker)}
          className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full border border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/20 hover:bg-emerald-500/5 transition-all duration-300 hover:scale-105 active:scale-[0.98] shadow-sm shadow-black/40"
        >
          {ticker}
        </button>
      ))}
    </div>
  );
}
