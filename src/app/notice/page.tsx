
"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShieldAlert, Info } from 'lucide-react';

export default function NoticePage() {
  const router = useRouter();

  const handleProceed = () => {
    router.replace('/dashboard');
  };

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center p-4 bg-background overflow-hidden">
      <div className="absolute inset-0 z-0 hexagon-bg opacity-50"></div>
       <div className="absolute inset-0 z-1 bg-black/60"></div>
      
      <div className="relative z-10 w-full max-w-2xl animate-fade-in-up">
        <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            <Card className="relative bg-card/80 backdrop-blur-md">
                <CardHeader className="text-center">
                    <div className="flex justify-center items-center gap-2 mb-2">
                        <Info className="w-8 h-8 text-primary" />
                        <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight">
                            Important Notice – Read Before You Proceed
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6 text-center text-muted-foreground">
                    <p className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        This web application is a non–real-time, educational simulation of the stock market.
                    </p>
                    <p className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                        All market data shown here is historical or delayed and does not represent current trading conditions.
                    </p>
                    <p className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                        The purpose of this platform is to help you learn stock market concepts and strategies without using real money.
                    </p>
                    <Separator className="my-4 animate-fade-in-up" style={{ animationDelay: '0.8s' }} />
                    <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '1s' }}>
                        <h4 className="flex items-center justify-center gap-2 font-semibold text-destructive">
                           <ShieldAlert className="w-5 h-5"/> Risk Disclaimer
                        </h4>
                        <ul className="space-y-2 text-sm list-none">
                            <li>Stock market trading involves significant financial risk.</li>
                            <li>Past performance is not indicative of future results.</li>
                            <li>The trades and strategies you see here should not be used for real-world investment decisions.</li>
                        </ul>
                    </div>
                     <p className="text-xs text-muted-foreground/80 pt-4 animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
                        By continuing, you acknowledge that this platform is for practice and education only, and you accept that the creators are not responsible for any financial decisions you make outside this app.
                    </p>
                </CardContent>
                <CardFooter className="animate-fade-in-up" style={{ animationDelay: '1.4s' }}>
                    <Button 
                        onClick={handleProceed} 
                        className="w-full font-bold text-base sm:text-lg py-6 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-primary/40 hover:shadow-lg"
                        size="lg"
                    >
                        I Understand – Proceed to Dashboard
                    </Button>
                </CardFooter>
            </Card>
        </div>
      </div>
    </main>
  );
}
