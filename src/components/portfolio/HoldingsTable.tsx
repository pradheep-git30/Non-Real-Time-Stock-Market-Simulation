"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Holding, MarketItem } from "@/lib/types";
import { cn } from "@/lib/utils";

interface HoldingsTableProps {
  holdings: Holding[];
  marketItems: MarketItem[];
}

export default function HoldingsTable({ holdings, marketItems }: HoldingsTableProps) {
  if (holdings.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">You don't have any holdings yet.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Asset</TableHead>
          <TableHead className="text-right">Quantity</TableHead>
          <TableHead className="text-right">Avg. Cost</TableHead>
          <TableHead className="text-right">Current Value</TableHead>
          <TableHead className="text-right">P/L</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {holdings.map(holding => {
          const item = marketItems.find(i => i.ticker === holding.ticker);
          if (!item) return null;

          const currentValue = item.price * holding.quantity;
          const investmentValue = holding.avgBuyPrice * holding.quantity;
          const profitLoss = currentValue - investmentValue;
          const isProfit = profitLoss >= 0;

          return (
            <TableRow key={holding.ticker}>
              <TableCell className="font-medium">{holding.ticker}</TableCell>
              <TableCell className="text-right">{holding.quantity}</TableCell>
              <TableCell className="text-right">₹{holding.avgBuyPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</TableCell>
              <TableCell className="text-right">₹{currentValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</TableCell>
              <TableCell className={cn("text-right font-medium", isProfit ? "text-green-500" : "text-red-500")}>
                ₹{profitLoss.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
