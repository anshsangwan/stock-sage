'use client';

/**
 * ReportSkeleton
 * 
 * Render placeholder components matching the final report layout.
 * Uses pulse animations to minimize cumulative layout shift.
 * Ref: PRODUCT_SPEC §3
 */
export default function ReportSkeleton() {
  return (
    <div className="w-full min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans pb-24 animate-pulse select-none pointer-events-none">
      {/* Verdict Banner Placeholder */}
      <div className="w-full h-24 bg-zinc-900/60 border-b border-zinc-800/80 flex items-center justify-center">
        <div className="h-8 bg-zinc-800 rounded-lg w-40"></div>
      </div>

      <main className="max-w-5xl mx-auto px-4 mt-8">
        {/* Header & Meta */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="space-y-3 w-full md:w-auto">
            {/* Title */}
            <div className="h-9 bg-zinc-800 rounded-lg w-64"></div>
            {/* Meta badges */}
            <div className="flex gap-2">
              <div className="h-6 bg-zinc-900 rounded border border-zinc-800 w-16"></div>
              <div className="h-6 bg-zinc-900 rounded border border-zinc-800 w-24"></div>
            </div>
          </div>
          {/* Back button */}
          <div className="h-10 bg-zinc-900 border border-zinc-800 rounded-lg w-20"></div>
        </div>

        {/* Executive Summary */}
        <section className="mb-10 bg-zinc-900/20 border border-zinc-800 rounded-2xl p-6 space-y-3">
          <div className="h-5 bg-zinc-800 rounded w-40 mb-4"></div>
          <div className="h-4 bg-zinc-800 rounded w-full"></div>
          <div className="h-4 bg-zinc-800 rounded w-5/6"></div>
          <div className="h-4 bg-zinc-800 rounded w-4/5"></div>
        </section>

        {/* Bull vs Bear Case */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bull Case */}
          <section className="bg-zinc-900/10 border border-zinc-800/50 rounded-2xl p-6 space-y-4">
            <div className="h-5 bg-zinc-800 rounded w-32 flex items-center gap-2"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="h-4 bg-zinc-850 rounded w-3 mt-1"></div>
                  <div className="h-4 bg-zinc-850 rounded w-full"></div>
                </div>
              ))}
            </div>
          </section>

          {/* Bear Case */}
          <section className="bg-zinc-900/10 border border-zinc-800/50 rounded-2xl p-6 space-y-4">
            <div className="h-5 bg-zinc-800 rounded w-32 flex items-center gap-2"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="h-4 bg-zinc-850 rounded w-3 mt-1"></div>
                  <div className="h-4 bg-zinc-850 rounded w-full"></div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Future Milestones Placeholders */}
        <div className="mt-10 pt-10 border-t border-zinc-800 flex flex-col gap-6 opacity-20">
          <div className="h-48 bg-zinc-900/50 rounded-2xl border border-zinc-800/50 border-dashed"></div>
          <div className="h-48 bg-zinc-900/50 rounded-2xl border border-zinc-800/50 border-dashed"></div>
        </div>
      </main>
    </div>
  );
}
