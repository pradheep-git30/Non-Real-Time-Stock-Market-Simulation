
"use client";

import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PortfolioPieChart from "@/components/portfolio/PortfolioPieChart";
import HoldingsTable from "@/components/portfolio/HoldingsTable";
import { useStockData } from "@/hooks/useStockData";
import { Skeleton } from "@/components/ui/skeleton";

const PortfolioPageSkeleton = () => (
    <div className="container mx-auto">
        <Skeleton className="h-9 w-40 mb-8" />
        <div className="grid gap-8 md:grid-cols-3">
             <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-9 w-48" />
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-24" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-9 w-36" />
                     <Skeleton className="h-5 w-20 mt-1" />
                </CardContent>
            </Card>
            <Card className="md:col-span-1 md:row-span-2">
                <CardHeader>
                     <Skeleton className="h-6 w-36" />
                </CardHeader>
                <CardContent className="flex justify-center items-center">
                    <Skeleton className="h-48 w-48 rounded-full" />
                </CardContent>
            </Card>
            <div className="md:col-span-2">
                 <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex justify-between items-center p-2">
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-6 w-16" />
                            <Skeleton className="h-6 w-24" />
                            <Skeleton className="h-6 w-24" />
                            <Skeleton className="h-6 w-24" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);


export default function PortfolioPage() {
    const { userData } = useApp();
    const marketItems = useStockData();

    if (!userData || marketItems.length === 0) {
        return <PortfolioPageSkeleton />;
    }

    const totalInvestmentValue = userData.holdings.reduce((acc, holding) => {
        const currentPrice = marketItems.find(item => item.ticker === holding.ticker)?.price || 0;
        return acc + (currentPrice * holding.quantity);
    }, 0);

    const totalCost = userData.holdings.reduce((acc, holding) => {
        return acc + (holding.avgBuyPrice * holding.quantity);
    }, 0);

    const overallProfitLoss = totalInvestmentValue - totalCost;
    const overallProfitLossPercent = totalCost > 0 ? (overallProfitLoss / totalCost) * 100 : 0;

    return (
        <div className="container mx-auto animate-fade-in-up">
            <h1 className="text-3xl font-bold mb-8">Your Portfolio</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="transition-all duration-300 hover:scale-105 hover:shadow-xl md:col-span-1">
                    <CardHeader>
                        <CardTitle>Total Investment</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">₹{totalInvestmentValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                    </CardContent>
                </Card>
                <Card className="transition-all duration-300 hover:scale-105 hover:shadow-xl md:col-span-1">
                    <CardHeader>
                        <CardTitle>Overall P/L</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <p className={`text-3xl font-bold ${overallProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            ₹{overallProfitLoss.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        </p>
                        <p className={`text-sm ${overallProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            ({overallProfitLossPercent.toFixed(2)}%)
                        </p>
                    </CardContent>
                </Card>
                <Card className="md:col-span-1 row-span-1 md:row-span-2 transition-all duration-300 hover:shadow-xl">
                    <CardHeader>
                        <CardTitle>Asset Allocation</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <PortfolioPieChart holdings={userData.holdings} marketItems={marketItems} />
                    </CardContent>
                </Card>
                <div className="md:col-span-2">
                    <HoldingsTable holdings={userData.holdings} marketItems={marketItems} />
                </div>
            </div>
        </div>
    );
}
