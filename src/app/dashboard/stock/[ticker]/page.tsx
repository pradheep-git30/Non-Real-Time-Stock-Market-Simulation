
"use client";

import { useState, useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { MarketItem, Stock } from '@/lib/types';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import StockChart from '@/components/dashboard/StockChart';
import { LoaderCircle, Wallet, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStockData } from '@/hooks/useStockData';
import StockLogo from '@/components/shared/StockLogo';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import AnimatedDiv from '@/components/shared/AnimatedDiv';

const buySchema = z.object({
  quantity: z.coerce.number().int().positive("Quantity must be a positive number."),
});

const addMoneySchema = z.object({
  amount: z.coerce.number().positive({ message: 'Amount must be positive.' }).min(100, { message: 'Minimum deposit is ₹100.' }),
});

function AddMoneyForm({ onCancel }: { onCancel: () => void }) {
    const { addMoney } = useApp();
    const { toast } = useToast();
    const form = useForm<z.infer<typeof addMoneySchema>>({
        resolver: zodResolver(addMoneySchema),
        defaultValues: { amount: 1000 }
    });

    const onSubmit = (values: z.infer<typeof addMoneySchema>) => {
        addMoney(values.amount);
        toast({
            title: 'Success!',
            description: `₹${values.amount.toLocaleString()} has been added to your wallet.`,
        });
        onCancel();
    };
    
    return (
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4 border-t mt-4">
                <p className="text-sm font-semibold text-destructive">Insufficient Funds</p>
                <p className="text-xs text-muted-foreground">You don't have enough money in your wallet to complete this transaction. Add funds below.</p>
                <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Amount to Add</FormLabel>
                            <FormControl><Input type="number" placeholder="e.g., 1000" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex gap-2">
                    <Button type="button" variant="outline" className="w-full" onClick={onCancel}>Cancel</Button>
                    <Button type="submit" className="w-full">
                        <Wallet className="mr-2 h-4 w-4" /> Add Money
                    </Button>
                </div>
            </form>
        </Form>
    )
}

const StockPageSkeleton = () => (
    <div className="container mx-auto py-8">
        <Skeleton className="h-8 w-24 mb-6" />
        <Card>
            <CardHeader>
                <div className="flex items-start gap-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-6 w-1/2" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <Skeleton className="h-64 w-full" />
                <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                </div>
                 <Skeleton className="h-32 w-full" />
            </CardContent>
        </Card>
    </div>
);


export default function StockDetailPage() {
  const { userData, buyStock, sellStock, getItemByTicker } = useApp();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const marketItems = useStockData();
  const router = useRouter();
  const params = useParams();
  const ticker = params.ticker as string;
  
  const [item, setItem] = useState<MarketItem | null>(null);

  useEffect(() => {
    if (marketItems.length > 0 && ticker) {
        const foundItem = marketItems.find(i => i.ticker === ticker);
        setItem(foundItem || null);
    }
  }, [marketItems, ticker]);

  const liveItem = useMemo(() => {
    if (!item) return null;
    return marketItems.find(marketItem => marketItem.ticker === item.ticker) || item;
  }, [marketItems, item]);

  const holding = userData?.holdings.find(h => h.ticker === liveItem?.ticker);

  const buyForm = useForm<z.infer<typeof buySchema>>({
    resolver: zodResolver(buySchema),
    defaultValues: { quantity: 1 },
  });
  
  const sellForm = useForm<z.infer<typeof buySchema>>({
    resolver: zodResolver(buySchema),
    defaultValues: { quantity: 1 },
  });

  const handleBuy = (values: z.infer<typeof buySchema>) => {
    if (!liveItem) return;
    const cost = values.quantity * liveItem.price;
    if (userData && userData.wallet < cost) {
        setShowAddMoney(true);
        toast({
            variant: "destructive",
            title: "Insufficient Funds",
            description: "Please add money to your wallet to continue."
        });
        return;
    }

    setLoading(true);
    setTimeout(() => {
      if (liveItem) {
          const success = buyStock(liveItem.ticker, values.quantity, liveItem.price);
          if (success) {
            toast({ title: "Success", description: `Bought ${values.quantity} share(s) of ${liveItem.ticker}.` });
            buyForm.reset({ quantity: 1 });
          } else {
            toast({ variant: "destructive", title: "Error", description: "Could not complete purchase. Check wallet balance." });
          }
      }
      setLoading(false);
    }, 500);
  };

  const handleSell = (values: z.infer<typeof buySchema>) => {
    if (!liveItem) return;
    setLoading(true);
    setTimeout(() => {
        if (liveItem) {
            const success = sellStock(liveItem.ticker, values.quantity, liveItem.price);
            if (success) {
                toast({ title: "Success", description: `Sold ${values.quantity} share(s) of ${liveItem.ticker}.` });
                sellForm.reset({ quantity: 1 });
            } else {
                toast({ variant: "destructive", title: "Error", description: "Could not complete sale. Check your holdings." });
            }
        }
        setLoading(false);
    }, 500);
  };
  
  if (!liveItem) {
    return <StockPageSkeleton />;
  }
  
  const isPositive = liveItem.change >= 0;
  const quantityToBuy = buyForm.watch('quantity');
  const quantityToSell = sellForm.watch('quantity');

  return (
    <AnimatedDiv className="container mx-auto py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      <Card>
        <CardHeader>
           <div className="flex items-start gap-4">
            <StockLogo domain={liveItem.domain} name={liveItem.name} />
            <div className="flex-1">
              <CardTitle className="text-xl sm:text-2xl">{liveItem.name} ({liveItem.ticker})</CardTitle>
              <CardDescription className="flex flex-wrap items-baseline gap-x-2">
                <span className="text-lg sm:text-xl font-bold">₹{liveItem.price.toLocaleString('en-IN')}</span>
                <span className={cn("text-base", isPositive ? 'text-green-500' : 'text-red-500')}>
                  {liveItem.change.toFixed(2)} ({liveItem.changePercent.toFixed(2)}%)
                </span>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="w-full h-64">
                <StockChart data={liveItem.day_chart_data} isPositive={isPositive} />
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {liveItem.type === 'Stock' && (
                    <>
                    <div><span className="font-semibold text-muted-foreground">Market Cap: </span> ₹{(liveItem as Stock).marketCap?.toLocaleString('en-IN')}</div>
                    <div><span className="font-semibold text-muted-foreground">Category: </span> {liveItem.category}</div>
                    <div><span className="font-semibold text-muted-foreground">52W High: </span> ₹{(liveItem as Stock).high52w?.toLocaleString('en-IN')}</div>
                    <div><span className="font-semibold text-muted-foreground">52W Low: </span> ₹{(liveItem as Stock).low52w?.toLocaleString('en-IN')}</div>
                    </>
                )}
                {liveItem.type === 'ETF' && (
                    <div className="col-span-2"><span className="font-semibold text-muted-foreground">Category: </span> {liveItem.category}</div>
                )}
            </div>
          
            <div>
                <Tabs defaultValue="buy" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="buy">Buy</TabsTrigger>
                    <TabsTrigger value="sell">Sell</TabsTrigger>
                </TabsList>
                <TabsContent value="buy">
                    {showAddMoney ? (
                        <AddMoneyForm onCancel={() => setShowAddMoney(false)} />
                    ) : (
                        <Form {...buyForm}>
                        <form onSubmit={buyForm.handleSubmit(handleBuy)} className="space-y-4 pt-4">
                            <FormField control={buyForm.control} name="quantity" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Quantity</FormLabel>
                                <FormControl><Input type="number" min="1" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )} />
                            <p className="text-sm text-muted-foreground">Est. Cost: ₹{(quantityToBuy * liveItem.price).toLocaleString('en-IN')}</p>
                            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                            {loading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />} Buy {liveItem.ticker}
                            </Button>
                        </form>
                        </Form>
                    )}
                </TabsContent>
                <TabsContent value="sell">
                    <Form {...sellForm}>
                    <form onSubmit={sellForm.handleSubmit(handleSell)} className="space-y-4 pt-4">
                        <FormField control={sellForm.control} name="quantity" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Quantity</FormLabel>
                            <FormControl><Input type="number" min="1" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )} />
                        <p className="text-sm text-muted-foreground">You own: {holding?.quantity || 0} shares</p>
                        <p className="text-sm text-muted-foreground">Est. Value: ₹{(quantityToSell * liveItem.price).toLocaleString('en-IN')}</p>
                        <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading || !holding || holding.quantity === 0}>
                        {loading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />} Sell {liveItem.ticker}
                        </Button>
                    </form>
                    </Form>
                </TabsContent>
                </Tabs>
            </div>
        </CardContent>
      </Card>
    </AnimatedDiv>
  );
}
