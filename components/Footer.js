'use client';

import { useState } from 'react';

/**
 * Global Persistent Footer Component
 * Renders static brand metadata, copyright notices, and version tags.
 * Styled in line with the terminal theme.
 */
export default function Footer() {
  const [activePopup, setActivePopup] = useState(null); // 'privacy' | 'status' | null

  const handleClose = () => setActivePopup(null);

  return (
    <>
      <footer className="no-print w-full border-t border-zinc-900/60 bg-black/20 py-6 px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-zinc-500 font-bold uppercase tracking-wider select-none mt-auto">
        <div className="flex items-center gap-2">
          <span>© 2026 Stock Sage Systems.</span>
          <span className="text-zinc-800">|</span>
          <span className="text-zinc-600">All rights reserved.</span>
        </div>
        <div className="flex items-center gap-6">
          <span 
            onClick={() => setActivePopup('privacy')}
            className="text-zinc-600 cursor-pointer hover:text-zinc-400 transition-colors"
          >
            Privacy Protocol
          </span>
          <span 
            onClick={() => setActivePopup('status')}
            className="text-zinc-600 cursor-pointer hover:text-zinc-400 transition-colors"
          >
            System status
          </span>
          <span className="text-emerald-500 font-extrabold tracking-widest">SEC SECURE</span>
        </div>
      </footer>

      {activePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-all duration-300">
          {/* Click outside to close */}
          <div className="absolute inset-0" onClick={handleClose} />
          
          {/* Modal Card */}
          <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-900 shadow-2xl rounded-3xl p-6 overflow-hidden select-text">
            {/* Subtle glow border */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/0 pointer-events-none" />
            
            <div className="flex justify-between items-center border-b border-zinc-900 pb-4 mb-4">
              <span className="text-xs font-extrabold text-white uppercase tracking-widest">
                {activePopup === 'privacy' ? 'Privacy Protocol' : 'System Status'}
              </span>
              <button 
                onClick={handleClose}
                className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {activePopup === 'privacy' ? (
              <div className="text-zinc-400 normal-case font-normal text-xs leading-relaxed flex flex-col gap-3">
                <p>
                  Stock Sage operates on a localized, client-only architecture. Your Gemini API key is processed inside your browser instance and sent directly to the LangGraph execution endpoint.
                </p>
                <p>
                  We do not transmit, analyze, or archive your API keys or search payloads on any server.
                </p>
              </div>
            ) : (
              <div className="text-zinc-400 normal-case font-normal text-xs leading-relaxed flex flex-col gap-3">
                <div className="flex justify-between items-center py-1.5 border-b border-zinc-900/50">
                  <span className="font-bold text-zinc-500 uppercase text-[9px] tracking-wider">Gemini 2.5 Flash</span>
                  <span className="text-emerald-400 font-mono text-[10px] font-bold">OPERATIONAL</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-zinc-900/50">
                  <span className="font-bold text-zinc-500 uppercase text-[9px] tracking-wider">Yahoo Finance REST</span>
                  <span className="text-emerald-400 font-mono text-[10px] font-bold">ONLINE</span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="font-bold text-zinc-500 uppercase text-[9px] tracking-wider">Database SQLite/Turso</span>
                  <span className="text-emerald-400 font-mono text-[10px] font-bold">CONNECTED</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
