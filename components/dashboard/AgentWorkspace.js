'use client';

/**
 * AgentWorkspace Checklist
 * 
 * Displays the centered progress checklist overlaid on top of the skeleton.
 * Tracks the 6 status stages:
 * 1. Extracting corporate ticker...
 * 2. Gathering latest financial news...
 * 3. Collecting financial & sentiment data...
 * 4. Evaluating bull vs bear arguments...
 * 5. Generating investment thesis...
 * 6. Preparing final report...
 * 
 * Ref: PRODUCT_SPEC §3
 */
export default function AgentWorkspace({ currentStage, stageStatuses, query }) {
  const stages = [
    { id: 1, label: 'Extracting corporate ticker...' },
    { id: 2, label: 'Gathering latest financial news...' },
    { id: 3, label: 'Collecting financial & market sentiment data...' },
    { id: 4, label: 'Evaluating bull vs bear arguments...' },
    { id: 5, label: 'Generating investment thesis...' },
    { id: 6, label: 'Preparing final report...' },
  ];

  return (
    <div className="fixed inset-0 bg-[#0a0a0a]/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-lg bg-zinc-900/90 border border-zinc-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent blur-sm"></div>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-white mb-2">Analyzing {query}</h2>
          <p className="text-sm text-zinc-500">
            Next-generation equity intelligence agent at work
          </p>
        </div>

        {/* Progress Checklist */}
        <div className="space-y-5">
          {stages.map((stage) => {
            const status = stageStatuses[stage.id] || 'pending'; // 'pending', 'running', 'completed'

            return (
              <div
                key={stage.id}
                className={`flex items-center justify-between transition-all duration-300 ${
                  status === 'running' 
                    ? 'opacity-100 scale-[1.02]' 
                    : status === 'completed'
                    ? 'opacity-80' 
                    : 'opacity-40'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Stage Status Icon */}
                  <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                    {status === 'completed' ? (
                      <div className="w-5 h-5 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center border border-emerald-500/30 animate-[scaleIn_0.2s_ease-out]">
                        <svg className="w-3.5 h-3.5 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : status === 'running' ? (
                      <div className="relative w-5 h-5">
                        <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20"></div>
                        <div className="absolute inset-0 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin"></div>
                      </div>
                    ) : (
                      <div className="w-2.5 h-2.5 bg-zinc-700 rounded-full"></div>
                    )}
                  </div>

                  {/* Stage Label */}
                  <span className={`text-sm font-medium ${
                    status === 'running' 
                      ? 'text-emerald-400 font-semibold' 
                      : status === 'completed'
                      ? 'text-zinc-300 line-through decoration-zinc-700 decoration-1'
                      : 'text-zinc-500'
                  }`}>
                    {stage.label}
                  </span>
                </div>

                {/* Subtle Right Status Pill */}
                {status === 'running' && (
                  <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 animate-pulse">
                    Active
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Animation Style */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scaleIn {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}} />
    </div>
  );
}
