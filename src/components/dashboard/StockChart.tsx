
"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, YAxis } from 'recharts';
import { useApp } from '@/context/AppContext';

interface StockChartProps {
  data: { price: number }[];
  isPositive: boolean;
}

export default function StockChart({ data, isPositive }: StockChartProps) {
  const { theme } = useApp();
  const chartColor = isPositive ? (theme === 'dark' ? 'hsl(142.1 76.2% 41.2%)' : 'hsl(142.1 70.6% 45.3%)') : (theme === 'dark' ? 'hsl(0 62.8% 30.6%)' : 'hsl(0 72.2% 50.6%)');
  const strokeColor = isPositive ? (theme === 'dark' ? 'hsl(142.1 76.2% 41.2%)' : 'hsl(142.1 70.6% 45.3%)') : (theme === 'dark' ? 'hsl(0 62.8% 30.6%)' : 'hsl(0 72.2% 50.6%)');
  const foregroundColor = theme === 'dark' ? 'hsl(210 40% 98%)' : 'hsl(222.2 84% 4.9%)';
  const backgroundColor = theme === 'dark' ? 'hsl(240 10% 3.9%)' : 'hsl(0 0% 100%)';
  const borderColor = theme === 'dark' ? 'hsl(240 3.7% 15.9%)' : 'hsl(214.3 31.8% 91.4%)';


  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
           <defs>
             <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
               <stop offset="5%" stopColor={chartColor} stopOpacity={0.8}/>
               <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
             </linearGradient>
           </defs>
          <Tooltip
            contentStyle={{
              backgroundColor: backgroundColor,
              borderColor: borderColor,
              borderRadius: 'var(--radius)',
              color: foregroundColor
            }}
            labelStyle={{ color: foregroundColor }}
            itemStyle={{ color: strokeColor }}
            formatter={(value: number) => [`₹${value.toFixed(2)}`, "Price"]}
          />
          <YAxis 
            domain={['dataMin', 'dataMax']} 
            tick={{ fill: foregroundColor, fontSize: 12 }} 
            tickLine={{ stroke: foregroundColor }} 
            axisLine={false}
            tickFormatter={(value) => `₹${Number(value).toFixed(0)}`}
            width={50}
          />
          <Area type="monotone" dataKey="price" stroke={strokeColor} strokeWidth={2} fillOpacity={1} fill="url(#chartColor)" isAnimationActive={true} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
