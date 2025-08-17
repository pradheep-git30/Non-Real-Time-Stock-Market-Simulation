
"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { Holding, MarketItem } from '@/lib/types';
import { useMemo } from 'react';
import { useApp } from '@/context/AppContext';

interface PortfolioPieChartProps {
  holdings: Holding[];
  marketItems: MarketItem[];
}

const COLORS = ['#A020F0', '#7DF9FF', '#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

export default function PortfolioPieChart({ holdings, marketItems }: PortfolioPieChartProps) {
  const { theme } = useApp();
  
  const chartData = useMemo(() => {
    return holdings.map(holding => {
      const item = marketItems.find(i => i.ticker === holding.ticker);
      const value = (item?.price || 0) * holding.quantity;
      return {
        name: holding.ticker,
        value: value,
        category: item?.category || 'Unknown'
      };
    }).filter(d => d.value > 0);
  }, [holdings, marketItems]);

  if (chartData.length === 0) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">No investments to show.</div>;
  }
  
  const foregroundColor = theme === 'dark' ? 'hsl(var(--card-foreground))' : 'hsl(var(--card-foreground))';

  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
             formatter={(value: number) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`}
             contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              borderColor: 'hsl(var(--border))'
            }}
            itemStyle={{ color: foregroundColor }}
            labelStyle={{ color: foregroundColor }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
