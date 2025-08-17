
"use client";

import { useState, useEffect } from 'react';
import { ALL_MARKET_ITEMS } from '@/lib/constants';
import type { MarketItem } from '@/lib/types';

// This function now generates truly random chart data on the client
const generateRandomChartData = (base: number) => {
    let data = [];
    let value = base;
    for (let i = 0; i < 30; i++) {
        value += value * (Math.random() - 0.49) * 0.1;
        value = Math.max(value, base * 0.85); // Allow more initial variance
        value = Math.min(value, base * 1.15);
        data.push({ price: parseFloat(value.toFixed(2)) });
    }
    return data;
};


export function useStockData() {
  // Initialize with the static data. This will be the same on server and initial client render.
  const [marketItems, setMarketItems] = useState<MarketItem[]>(ALL_MARKET_ITEMS);

  useEffect(() => {
    // --- Initial Randomization on Client Mount ---
    // This runs only once on the client, after hydration, to set a random starting point.
    setMarketItems(prevItems =>
        prevItems.map(item => {
            const initialPrice = item.price * (1 + (Math.random() - 0.5) * 0.1); // Start with a random price +/- 5%
            return {
                ...item,
                price: initialPrice,
                day_chart_data: generateRandomChartData(initialPrice),
            };
        })
    );

    // --- Continuous Price Updates ---
    // The data updates now happen only on the client, after the component has mounted.
    const interval = setInterval(() => {
      setMarketItems(prevItems =>
        prevItems.map(item => {
          const changePercent = (Math.random() - 0.495) * 0.05; // small random change
          const change = item.price * changePercent;
          const newPrice = Math.max(0.1, item.price + change);
          
          const newChartData = [...item.day_chart_data.slice(1), { price: newPrice }];

          return {
            ...item,
            price: newPrice,
            change: newPrice - item.price,
            changePercent: ((newPrice - item.price) / item.price) * 100,
            day_chart_data: newChartData,
          };
        })
      );
    }, 4000); // Update every 4 seconds

    return () => clearInterval(interval);
  }, []); // Empty dependency array ensures this runs once on mount.

  return marketItems;
}
