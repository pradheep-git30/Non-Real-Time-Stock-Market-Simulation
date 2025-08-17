
"use client";

import { useMemo } from 'react';
import { useApp } from "@/context/AppContext";
import { useStockData } from "@/hooks/useStockData";
import { MarketItem } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StockLogo from '@/components/shared/StockLogo';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function WatchlistPage() {
    const { userData, removeFromWatchlist } = useApp();
    const marketItems = useStockData();
    const { toast } = useToast();
    const router = useRouter();

    const watchlistItems = useMemo(() => {
        const liveDataMap = new Map(marketItems.map(item => [item.ticker, item]));
        return userData?.watchlist
            .map(ticker => liveDataMap.get(ticker))
            .filter(Boolean) as MarketItem[] || [];
    }, [userData?.watchlist, marketItems]);
    
    const handleRemove = (ticker: string) => {
        removeFromWatchlist(ticker);
        toast({
            title: "Removed from Watchlist",
            description: `${ticker} has been removed from your watchlist.`,
        });
    };
    
    const handleRowClick = (ticker: string) => {
        router.push(`/dashboard/stock/${ticker}`);
    };

    if (!userData || watchlistItems.length === 0) {
        return (
            <div className="container mx-auto text-center animate-fade-in-up">
                <h1 className="text-3xl font-bold mb-8">My Watchlist</h1>
                <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground mb-4">Your watchlist is empty.</p>
                    <Link href="/dashboard">
                        <Button>Explore Stocks</Button>
                    </Link>
                </div>
            </div>
        );
    }
    
    return (
         <div className="container mx-auto animate-fade-in-up">
            <h1 className="text-3xl font-bold mb-8">My Watchlist</h1>
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Asset</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                                <TableHead className="text-right">Change</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {watchlistItems.map(item => {
                                const isPositive = item.change >= 0;
                                return (
                                    <TableRow key={item.ticker} onClick={() => handleRowClick(item.ticker)} className="cursor-pointer transition-colors hover:bg-muted/50">
                                        <TableCell>
                                            <div className="flex items-center gap-4">
                                                <StockLogo domain={item.domain} name={item.name} />
                                                <div>
                                                    <p className="font-bold">{item.ticker}</p>
                                                    <p className="text-sm text-muted-foreground truncate max-w-40">{item.name}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            ₹{item.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </TableCell>
                                        <TableCell className={cn("text-right", isPositive ? 'text-green-500' : 'text-red-500')}>
                                            {item.change.toFixed(2)} ({item.changePercent.toFixed(2)}%)
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" className="transition-transform hover:scale-125" onClick={(e) => { e.stopPropagation(); handleRemove(item.ticker); }}>
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
