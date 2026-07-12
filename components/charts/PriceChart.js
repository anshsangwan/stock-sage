'use client';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

/**
 * Historical Price Chart
 * 
 * Renders a 1-year historical closing stock price chart.
 * Uses an AreaChart with an Emerald Green gradient to feel premium.
 * Ref: ANTIGRAVITY_SPEC §12
 * 
 * @param {{ data: Array<{ date: string, close: number }> }} props
 */
export default function PriceChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center border border-zinc-800 rounded-2xl bg-zinc-900/30 text-zinc-500">
        No price history available
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-zinc-900/20 border border-zinc-800 rounded-2xl p-5 backdrop-blur-sm flex flex-col justify-between">
      <div className="h-56 w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#18181b" strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#52525b" 
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis 
              stroke="#52525b" 
              fontSize={11}
              tickLine={false}
              axisLine={false}
              domain={['auto', 'auto']}
              tickFormatter={(v) => `$${v}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(24, 24, 27, 0.95)',
                borderColor: '#27272a',
                borderRadius: '12px',
                color: '#f4f4f5',
                fontSize: '12px',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)',
              }}
              formatter={(value) => [`$${value}`, 'Close']}
              labelStyle={{ color: '#a1a1aa', fontWeight: 'bold' }}
            />
            <Area 
              type="monotone" 
              dataKey="close" 
              stroke="#10b981" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorPrice)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
