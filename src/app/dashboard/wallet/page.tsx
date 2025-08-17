
"use client";

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const addMoneySchema = z.object({
  amount: z.coerce.number().positive({ message: 'Amount must be positive.' }).min(100, { message: 'Minimum deposit is ₹100.' }),
});

export default function WalletPage() {
  const { userData, addMoney: addMoneyToContext } = useApp();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof addMoneySchema>>({
    resolver: zodResolver(addMoneySchema),
    defaultValues: {
        amount: '' as any, // Set initial value to prevent uncontrolled -> controlled error
    },
  });

  const onSubmit = (values: z.infer<typeof addMoneySchema>) => {
    addMoneyToContext(values.amount);
    toast({
      title: 'Success!',
      description: `₹${values.amount} has been added to your wallet.`,
    });
    form.reset({ amount: '' as any });
  };

  if (!userData) {
    return <div>Loading wallet...</div>;
  }

  return (
    <div className="container mx-auto animate-fade-in-up">
      <h1 className="text-3xl font-bold mb-8">My Wallet</h1>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card className="transition-all duration-300 hover:shadow-xl">
            <CardHeader>
              <CardTitle>Add Funds</CardTitle>
              <CardDescription>Add money to your wallet to start investing. This is a simulation.</CardDescription>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent>
                  <div className="text-sm mb-4">
                    <p className="font-medium">Current Balance</p>
                    <p className="text-2xl font-bold text-primary break-all">₹{userData.wallet.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                  </div>
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount (INR)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 1000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full animate-pulse-slow">Add Money</Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card className="transition-all duration-300 hover:shadow-xl">
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userData.transactions.length > 0 ? userData.transactions.map(tx => {
                     const isDebit = tx.type === 'buy';
                     const isCredit = tx.type === 'sell' || tx.type === 'deposit';

                     return (
                        <TableRow key={tx.id} className="hover:bg-muted/50">
                          <TableCell>{format(new Date(tx.date), "dd MMM, yyyy")}</TableCell>
                          <TableCell className="capitalize">{tx.type}</TableCell>
                          <TableCell>{tx.ticker ? `${tx.quantity}x ${tx.ticker} @ ₹${tx.price?.toFixed(2)}` : 'Wallet Deposit'}</TableCell>
                          <TableCell className={cn("text-right font-medium", isDebit && 'text-red-500', isCredit && 'text-green-500')}>
                             {isDebit ? '-' : '+'}{' '}
                             ₹{tx.amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                           </TableCell>
                        </TableRow>
                     )
                  }) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center h-24">
                        No transactions yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
