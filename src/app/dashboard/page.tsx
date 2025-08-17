
"use client";

import { useStockData } from '@/hooks/useStockData';
import type { MarketItem } from '@/lib/types';
import { useApp } from '@/context/AppContext';
import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from '@/lib/utils';
import { Bookmark, BookmarkCheck } from "lucide-react";
import StockChart from '@/components/dashboard/StockChart';
import StockLogo from '@/components/shared/StockLogo';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import AnimatedDiv from '@/components/shared/AnimatedDiv';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const StockCard = ({ item, onWatchlistToggle, isWatchlisted }: { item: MarketItem, onWatchlistToggle: (ticker: string) => void, isWatchlisted: boolean }) => {
    const [priceState, setPriceState] = useState<'normal' | 'up' | 'down'>('normal');

    useEffect(() => {
        setPriceState(item.change > 0 ? 'up' : 'down');
        const timer = setTimeout(() => setPriceState('normal'), 500);
        return () => clearTimeout(timer);
    }, [item.price, item.change]);

    const isPositive = item.change >= 0;

    return (
        <Link href={`/dashboard/stock/${item.ticker}`} passHref>
            <Card className="min-w-[280px] cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <StockLogo domain={item.domain} name={item.name} width={40} height={40}/>
                     <Button variant="ghost" size="icon" className="w-8 h-8" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onWatchlistToggle(item.ticker); }}>
                        {isWatchlisted ? <BookmarkCheck className="text-primary" /> : <Bookmark />}
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="font-bold">{item.ticker}</div>
                    <p className="text-xs text-muted-foreground truncate">{item.name}</p>
                    <p className={cn("text-lg font-bold transition-colors duration-500", priceState === 'up' && 'text-green-500 animate-flash-green', priceState === 'down' && 'text-red-500 animate-flash-red')}>
                        ₹{item.price.toLocaleString('en-IN')}
                    </p>
                    <p className={cn("text-sm", isPositive ? "text-green-500" : "text-red-500")}>
                        {isPositive ? '+' : ''}{item.change.toFixed(2)} ({item.changePercent.toFixed(2)}%)
                    </p>
                </CardContent>
            </Card>
        </Link>
    );
};

const StockCarousel = ({ title, items, onWatchlistToggle, watchlist }: { title: string, items: MarketItem[], onWatchlistToggle: (ticker: string) => void, watchlist: string[] }) => (
    <AnimatedDiv className="space-y-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="relative">
            <ScrollArea>
                <div className="flex space-x-4 pb-4 px-1">
                    {items.map(item => (
                        <StockCard key={item.id} item={item} onWatchlistToggle={onWatchlistToggle} isWatchlisted={watchlist.includes(item.ticker)} />
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    </AnimatedDiv>
);


const DashboardSkeleton = () => (
    <div className="space-y-8">
        <div className="flex items-center justify-center p-4">
            <Skeleton className="h-8 w-3/4" />
        </div>
        <Card>
            <CardHeader>
                <div className="flex items-center gap-4 flex-wrap">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className='flex-1'>
                        <Skeleton className="h-7 w-48 mb-2" />
                        <Skeleton className="h-9 w-64" />
                    </div>
                    <div className="ml-auto flex gap-2">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <Skeleton className="h-10 w-24 rounded-md" />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Skeleton className="h-64 w-full" />
            </CardContent>
        </Card>
        <div className="space-y-4">
            <Skeleton className="h-8 w-40 mb-4" />
            <div className="flex space-x-4 pb-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="min-w-[280px]">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <Skeleton className="h-8 w-8" />
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Skeleton className="h-5 w-16" />
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-6 w-24" />
                            <Skeleton className="h-5 w-32" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    </div>
);


export default function Dashboard() {
    const marketItems = useStockData();
    const { userData, addToWatchlist, removeFromWatchlist, isInWatchlist, getItemByTicker } = useApp();
    const { toast } = useToast();
    const [selectedTicker, setSelectedTicker] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (marketItems.length > 0 && !selectedTicker) {
            setSelectedTicker(marketItems[0].ticker);
        }
    }, [marketItems, selectedTicker]);

    const handleWatchlistToggle = (ticker: string) => {
        if (isInWatchlist(ticker)) {
            removeFromWatchlist(ticker);
            toast({ title: 'Removed from watchlist', description: `${ticker} has been removed from your watchlist.` });
        } else {
            addToWatchlist(ticker);
            toast({ title: 'Added to watchlist', description: `${ticker} has been added to your watchlist.` });
        }
    };
    
    const currentSelectedStockData = useMemo(() => {
        if (!selectedTicker) return null;
        return marketItems.find(item => item.ticker === selectedTicker) || null;
    }, [selectedTicker, marketItems]);

    const topGainers = useMemo(() => [...marketItems].sort((a, b) => b.changePercent - a.changePercent).slice(0, 10), [marketItems]);
    const topLosers = useMemo(() => [...marketItems].sort((a, b) => a.changePercent - b.changePercent).slice(0, 10), [marketItems]);
    const mostBought = useMemo(() => ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'TATAMOTORS', 'SBIN', 'ZOMATO', 'PAYTM', 'ITC', 'NIFTYBEES'].map(t => marketItems.find(i => i.ticker === t)).filter(Boolean) as MarketItem[], [marketItems]);
    const inNews = useMemo(() => ['ADANIENT', 'PAYTM', 'RELIANCE', 'TATAMOTORS', 'NTPC', 'WIPRO', 'ZOMATO', 'LICI', 'ONGC', 'IOC'].map(t => marketItems.find(i => i.ticker === t)).filter(Boolean) as MarketItem[], [marketItems]);
    const watchlistItems = useMemo(() => userData?.watchlist.map(ticker => getItemByTicker(ticker)).filter(Boolean) as MarketItem[] || [], [userData?.watchlist, marketItems]);


    if (!isClient || !currentSelectedStockData) {
        return <DashboardSkeleton />;
    }
    
    const isPositive = currentSelectedStockData.change >= 0;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-center p-4">
                 <p className="text-2xl uppercase tracking-wider font-bold text-muted-foreground animate-text-glow transition-all duration-300 hover:text-primary hover:scale-110 hover:animate-none">Price is what you pay Value is what you get</p>
            </div>
             <AnimatedDiv>
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-4 flex-wrap">
                            <StockLogo domain={currentSelectedStockData.domain} name={currentSelectedStockData.name} />
                            <div>
                                <CardTitle className="text-2xl">{currentSelectedStockData.name} ({currentSelectedStockData.ticker})</CardTitle>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-3xl font-bold">₹{currentSelectedStockData.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                    <p className={cn("font-semibold", isPositive ? 'text-green-500' : 'text-red-500')}>
                                        {isPositive ? '+' : ''}{currentSelectedStockData.change.toFixed(2)} ({currentSelectedStockData.changePercent.toFixed(2)}%)
                                    </p>
                                </div>
                            </div>
                            <div className="ml-auto flex gap-2">
                                <Button variant="outline" size="icon" className="w-10 h-10 hover:scale-110 transition-transform" onClick={(e) => { e.stopPropagation(); handleWatchlistToggle(currentSelectedStockData.ticker); }}>
                                    {isInWatchlist(currentSelectedStockData.ticker) ? <BookmarkCheck className="text-primary h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
                                </Button>
                                <button
                                    onClick={() => router.push(`/dashboard/stock/${currentSelectedStockData.ticker}`)}
                                    className="px-6 py-2 font-semibold text-white bg-primary rounded-md hover:bg-primary/90 transition-colors animate-pulse-slow"
                                >
                                    Buy/Sell
                                </button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <StockChart data={currentSelectedStockData.day_chart_data} isPositive={isPositive} />
                    </CardContent>
                </Card>
            </AnimatedDiv>

            {watchlistItems.length > 0 && <StockCarousel title="Your Watchlist" items={watchlistItems} onWatchlistToggle={handleWatchlistToggle} watchlist={userData?.watchlist || []} />}
            <StockCarousel title="Top Gainers" items={topGainers} onWatchlistToggle={handleWatchlistToggle} watchlist={userData?.watchlist || []} />
            <StockCarousel title="Top Losers" items={topLosers} onWatchlistToggle={handleWatchlistToggle} watchlist={userData?.watchlist || []}/>
            <StockCarousel title="Most Bought" items={mostBought} onWatchlistToggle={handleWatchlistToggle} watchlist={userData?.watchlist || []} />
            <StockCarousel title="Stocks in News" items={inNews} onWatchlistToggle={handleWatchlistToggle} watchlist={userData?.watchlist || []} />
        </div>
    );
}
