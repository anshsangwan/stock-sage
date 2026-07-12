'use client';

/**
 * Global Persistent Footer Component
 * Renders static brand metadata, copyright notices, and version tags.
 * Styled in line with the terminal theme.
 */
export default function Footer() {
  return (
    <footer className="no-print w-full border-t border-zinc-900/60 bg-black/20 py-6 px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-zinc-500 font-bold uppercase tracking-wider select-none mt-auto">
      <div className="flex items-center gap-2">
        <span>© 2026 Stock Sage Systems.</span>
        <span className="text-zinc-800">|</span>
        <span className="text-zinc-600">All rights reserved.</span>
      </div>
      <div className="flex items-center gap-6">
        <span className="text-zinc-600 cursor-default hover:text-zinc-400 transition-colors">Privacy Protocol</span>
        <span className="text-zinc-600 cursor-default hover:text-zinc-400 transition-colors">System status</span>
        <span className="text-emerald-500 font-extrabold tracking-widest">SEC SECURE</span>
      </div>
    </footer>
  );
}
