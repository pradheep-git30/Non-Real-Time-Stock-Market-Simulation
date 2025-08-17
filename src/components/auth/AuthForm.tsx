
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '../shared/Logo';
import WelcomePopup from '../shared/WelcomePopup';

const signUpSchema = z.object({
  username: z.string().min(3, { message: 'Username must be at least 3 characters.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

const signInSchema = z.object({
    username: z.string().min(1, { message: 'Username is required.' }),
    password: z.string().min(1, { message: 'Password is required.' }),
});


export function AuthForm() {
  const router = useRouter();
  const { login } = useApp();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [newUserName, setNewUserName] = useState('');

  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { username: '', password: '' },
  });

  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: { username: '', password: '' },
  });

  const handleSignUp = async (values: z.infer<typeof signUpSchema>) => {
    setLoading(true);
    const success = await login(values.username, true);
    if (success) {
      setNewUserName(values.username);
      setShowWelcomePopup(true);
    } else {
        toast({
            variant: 'destructive',
            title: "Sign Up Failed",
            description: `User "${values.username}" may already exist.`,
        });
    }
    setLoading(false);
  };

  const handleSignIn = async (values: z.infer<typeof signInSchema>) => {
    setLoading(true);
    const success = await login(values.username, false);
    if (success) {
         toast({
            title: "Welcome back!",
            description: `Successfully signed in as ${values.username}.`,
        });
        router.push('/notice');
    } else {
         toast({
            variant: 'destructive',
            title: "Login Failed",
            description: `User "${values.username}" not found or password incorrect.`,
        });
    }
    setLoading(false);
  };

  const handleWelcomeContinue = () => {
    setShowWelcomePopup(false);
    router.push('/notice');
  }

  const buttonClasses = "w-full transition-all duration-300 ease-out transform hover:scale-[1.03] hover:shadow-lg active:scale-[0.98] active:shadow-sm";

  return (
    <>
      <div className="w-full h-full flex flex-col justify-center">
        <div className="text-center mb-6 animate-fade-in-up transition-all duration-300 hover:scale-105">
            <div className='flex justify-center mb-4'>
                <Logo />
            </div>
          <h2 className="text-xl sm:text-2xl font-bold">Welcome to Tradeverse</h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Your journey to smart investing starts here.
          </p>
        </div>
        <div>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <Form {...signInForm}>
                <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4 mt-4">
                  <FormField
                    control={signInForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="your_username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="space-y-2">
                    <FormField
                      control={signInForm.control}
                      name="password"
                      render={({ field }) => (
                          <FormItem className="relative">
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                  <Input type={showPassword ? "text" : "password"} placeholder="••••••••" {...field} />
                              </FormControl>
                              <Button type="button" variant="ghost" size="icon" className="absolute bottom-1 right-1 h-7 w-7" onClick={() => setShowPassword(!showPassword)}>
                                  {showPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                              </Button>
                              <FormMessage />
                          </FormItem>
                      )}
                    />
                    <div className="text-right">
                       <Link href="/forgot-password" passHref>
                          <span className="text-sm text-primary hover:underline cursor-pointer">
                            Forgot password?
                          </span>
                        </Link>
                    </div>
                  </div>
                  <Button type="submit" className={buttonClasses} disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign In
                  </Button>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="signup">
              <Form {...signUpForm}>
                <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4 mt-4">
                  <FormField
                    control={signUpForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="choose_username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signUpForm.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem className="relative">
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type={showPassword ? "text" : "password"} placeholder="••••••••" {...field} />
                            </FormControl>
                             <Button type="button" variant="ghost" size="icon" className="absolute bottom-1 right-1 h-7 w-7" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                            </Button>
                            <FormMessage />
                        </FormItem>
                    )}
                  />
                  <Button type="submit" className={buttonClasses} disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Account
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <WelcomePopup 
        isOpen={showWelcomePopup}
        onClose={handleWelcomeContinue}
        username={newUserName}
      />
    </>
  );
}
