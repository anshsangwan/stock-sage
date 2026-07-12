'use client';

import { useRouter } from 'next/navigation';

/**
 * ActionToolbar
 * 
 * Renders print/PDF export and re-run analysis buttons.
 * Applies the `no-print` CSS class to ensure it's hidden from PDF exports.
 * Ref: PRODUCT_SPEC §3, ANTIGRAVITY_SPEC §12
 * 
 * @param {{ companyName: string, ticker: string }} props
 */
export default function ActionToolbar({ companyName, ticker }) {
  const router = useRouter();

  const handlePrint = () => {
    window.print();
  };

  const handleRerun = () => {
    if (!ticker) return;
    // Pushes the user back to the transitional workspace with the ticker
    router.push(`/workspace?q=${encodeURIComponent(ticker)}`);
  };

  return (
    <div className="no-print flex flex-wrap gap-3 items-center justify-end w-full border border-zinc-800 bg-zinc-900/30 rounded-2xl p-4 backdrop-blur-sm">
      <div className="text-xs text-zinc-500 mr-auto font-medium">
        Report Generated: {new Date().toLocaleDateString()}
      </div>
      
      {/* Print PDF Button */}
      <button
        onClick={handlePrint}
        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 hover:border-zinc-700 transition-all active:scale-[0.98]"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        Export PDF
      </button>

      {/* Re-run Analysis Button */}
      <button
        onClick={handleRerun}
        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all active:scale-[0.98] shadow-lg shadow-emerald-950/20"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.706 7M7 10h4V6" />
        </svg>
        Re-run Analysis
      </button>
    </div>
  );
}
