'use client';

/**
 * SentimentGauge
 * 
 * SVG-based premium semi-circular gauge displaying overall news sentiment.
 * Color shifts dynamically from red (bearish) to amber (neutral) to emerald (bullish).
 * Ref: PRODUCT_SPEC §4, ANTIGRAVITY_SPEC §12
 * 
 * @param {{ percentage: number, label: string }} props
 */
export default function SentimentGauge({ percentage = 50, label = 'Neutral', compact = false }) {
  const cleanPercent = Math.min(100, Math.max(0, percentage));
  
  // Calculate SVG arc parameters (180 deg gauge)
  const radius = 80;
  const strokeWidth = 12;
  const center = 90;
  const circumference = Math.PI * radius; // Half circle circumference
  const strokeDashoffset = circumference - (cleanPercent / 100) * circumference;

  // Determine dynamic colors
  let colorClass = 'stroke-zinc-500';
  let textClass = 'text-zinc-400';
  
  if (cleanPercent >= 70) {
    colorClass = 'stroke-emerald-500';
    textClass = 'text-emerald-400';
  } else if (cleanPercent >= 55) {
    colorClass = 'stroke-emerald-400/70';
    textClass = 'text-emerald-400/80';
  } else if (cleanPercent >= 45) {
    colorClass = 'stroke-amber-500';
    textClass = 'text-amber-400';
  } else if (cleanPercent >= 30) {
    colorClass = 'stroke-red-400/70';
    textClass = 'text-red-400/80';
  } else {
    colorClass = 'stroke-red-500';
    textClass = 'text-red-400';
  }

  if (compact) {
    return (
      <div className="flex items-center gap-3 bg-zinc-900/30 border border-zinc-800 rounded-xl px-3.5 py-1 backdrop-blur-sm self-center">
        {/* Small SVG Gauge */}
        <div className="relative w-14 h-8 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-180" viewBox="0 0 180 100">
            {/* Track Arc */}
            <path
              d="M 10 90 A 80 80 0 0 1 170 90"
              fill="none"
              stroke="#1c1c1e"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            {/* Active Colored Arc */}
            <path
              d="M 10 90 A 80 80 0 0 1 170 90"
              fill="none"
              className={`transition-all duration-1000 ease-out ${colorClass}`}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
        </div>
        
        {/* Text details next to it */}
        <div className="flex flex-col select-none">
          <span className="text-sm font-extrabold text-white leading-none">
            {cleanPercent}%
          </span>
          <span className={`text-[8px] font-extrabold uppercase tracking-widest mt-0.5 ${textClass}`}>
            {label}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-zinc-900/20 border border-zinc-800 rounded-2xl p-5 backdrop-blur-sm flex flex-col justify-between items-center">
      <div className="relative w-48 h-28 flex-1 flex items-center justify-center mt-2">
        <svg className="w-full h-full transform -rotate-180" viewBox="0 0 180 100">
          {/* Track Arc */}
          <path
            d="M 10 90 A 80 80 0 0 1 170 90"
            fill="none"
            stroke="#1c1c1e"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Active Colored Arc */}
          <path
            d="M 10 90 A 80 80 0 0 1 170 90"
            fill="none"
            className={`transition-all duration-1000 ease-out ${colorClass}`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        
        {/* Core Center Text */}
        <div className="absolute bottom-1 text-center">
          <div className="text-3xl font-extrabold tracking-tight text-white">
            {cleanPercent}%
          </div>
          <div className={`text-xs font-bold uppercase tracking-widest mt-1 ${textClass}`}>
            {label}
          </div>
        </div>
      </div>

      <div className="flex justify-between w-full text-[10px] text-zinc-600 font-bold uppercase tracking-wider mt-2 px-6">
        <span>Bearish</span>
        <span>Neutral</span>
        <span>Bullish</span>
      </div>
    </div>
  );
}
