'use client';

/**
 * FinancialHealth Snapshot Component
 * 
 * Renders key financial ratios and metrics in a modern grid card layout.
 * Colors adapt to positive/negative values if applicable.
 * Ref: PRODUCT_SPEC §4, ANTIGRAVITY_SPEC §12
 * 
 * @param {{ metrics: {
 *   currentPrice: number,
 *   marketCap: number,
 *   peRatio: number,
 *   eps: number,
 *   profitMargin: number,
 *   debtToEquity: number,
 *   fiftyTwoWeekRange: string
 * } }} props
 */
export default function FinancialHealth({ metrics }) {
  if (!metrics) {
    return (
      <div className="border border-zinc-800 rounded-2xl bg-zinc-900/30 p-6 text-zinc-500 text-center text-sm">
        Financial metrics unavailable.
      </div>
    );
  }

  const items = [
    {
      label: 'Share Price',
      value: `$${metrics.currentPrice?.toFixed(2) || '—'}`,
      description: 'Current regular market price'
    },
    {
      label: 'Market Cap',
      value: `$${metrics.marketCap ? `${metrics.marketCap}B` : '—'}`,
      description: 'Total dollar market value'
    },
    {
      label: 'P/E Ratio',
      value: metrics.peRatio ? metrics.peRatio.toFixed(2) : '—',
      description: 'Price-to-Earnings multiple'
    },
    {
      label: 'EPS (TTM)',
      value: metrics.eps ? `$${metrics.eps.toFixed(2)}` : '—',
      description: 'Earnings per share'
    },
    {
      label: 'Profit Margin',
      value: metrics.profitMargin ? `${metrics.profitMargin.toFixed(2)}%` : '—',
      valueClass: metrics.profitMargin > 0 ? 'text-emerald-400' : 'text-red-400',
      description: 'Net income as % of revenue'
    },
    {
      label: 'Debt / Equity',
      value: metrics.debtToEquity ? metrics.debtToEquity.toFixed(2) : '—',
      valueClass: metrics.debtToEquity < 1.5 ? 'text-emerald-400' : 'text-amber-400',
      description: 'Leverage ratio (Lower is safer)'
    },
    {
      label: '52-Week Range',
      value: metrics.fiftyTwoWeekRange || '—',
      description: 'Lowest vs highest price'
    }
  ];

  return (
    <section className="bg-zinc-900/20 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm">
      <h3 className="text-sm font-semibold text-zinc-400 mb-6 uppercase tracking-wider">
        Financial Health Snapshot
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {items.map((item, idx) => (
          <div 
            key={idx} 
            className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/40 hover:bg-zinc-900/60 transition-colors"
          >
            <div className="text-xs text-zinc-500 font-medium mb-1 uppercase tracking-wider">{item.label}</div>
            <div className={`text-xl font-bold tracking-tight mb-2 text-white ${item.valueClass || ''}`}>
              {item.value}
            </div>
            <div className="text-[10px] text-zinc-600 leading-tight">{item.description}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
