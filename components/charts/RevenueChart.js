'use client';

import { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';

/**
 * Revenue vs. Net Income Chart
 * 
 * Renders a comparison bar chart of annual Revenue (Emerald Green)
 * vs. Net Income (Electric Blue) in Billions USD.
 * Ref: ANTIGRAVITY_SPEC §12
 * 
 * @param {{ data: Array<{ year: string, revenue: number, netIncome: number }> }} props
 */
export default function RevenueChart({ data }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-full h-[280px] bg-zinc-900/10 border border-zinc-900 rounded-2xl animate-pulse" />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center border border-zinc-800 rounded-2xl bg-zinc-900/30 text-zinc-500">
        No financial history available
      </div>
    );
  }

  return (
    <div className="w-full h-[280px] bg-zinc-900/20 border border-zinc-800 rounded-2xl p-5 backdrop-blur-sm flex flex-col justify-between">
      <div className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
            <CartesianGrid stroke="#18181b" strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="year" 
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
              tickFormatter={(v) => `$${v}B`}
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
              formatter={(value, name) => [`$${value}B`, name === 'revenue' ? 'Revenue' : 'Net Income']}
              labelStyle={{ color: '#a1a1aa', fontWeight: 'bold' }}
            />
            <Legend 
              verticalAlign="top" 
              height={24} 
              iconType="circle" 
              iconSize={8}
              formatter={(value) => <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{value === 'revenue' ? 'Revenue' : 'Net Income'}</span>}
            />
            <Bar 
              dataKey="revenue" 
              fill="#10b981" 
              radius={[4, 4, 0, 0]} 
              maxBarSize={40}
            />
            <Bar 
              dataKey="netIncome" 
              fill="#3b82f6" 
              radius={[4, 4, 0, 0]} 
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
