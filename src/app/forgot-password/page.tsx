
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/shared/Logo';
import Link from 'next/link';

const resetSchema = z.object({
  username: z.string().min(3, { message: 'Username must be at least 3 characters.' }),
  newPassword: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: { username: '', newPassword: '' },
  });

  const handleResetPassword = async (values: z.infer<typeof resetSchema>) => {
    setLoading(true);
    // In a real app, you'd call your backend here to reset the password.
    // For this simulation, we'll just show a success message.
    setTimeout(() => {
      toast({
        title: "Password Reset Successful",
        description: "You can now sign in with your new password.",
      });
      setLoading(false);
      router.push('/');
    }, 1500);
  };

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden hexagon-bg">
       <div className="absolute inset-0 w-full h-full bg-black/60 z-0"></div>
       <Card className="max-w-md w-full z-10 bg-card/80 backdrop-blur-lg border-white/10 animate-fade-in-up">
            <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                    <KeyRound className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-2xl">Forgot Your Password?</CardTitle>
                <CardDescription>
                    No worries! Enter your username and a new password below.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleResetPassword)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your username" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Choose a new password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Reset Password'}
                        </Button>
                    </form>
                </Form>
                 <div className="mt-6 text-center text-sm">
                    <Link href="/" passHref>
                        <span className="text-muted-foreground hover:text-primary cursor-pointer">
                            Back to Sign In
                        </span>
                    </Link>
                </div>
            </CardContent>
       </Card>
    </main>
  );
}
