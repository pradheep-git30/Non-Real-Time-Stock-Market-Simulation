
"use client"

import { AuthForm } from '@/components/auth/AuthForm';
import { Card } from '@/components/ui/card';
import Image from 'next/image';

export default function AuthenticationPage() {
  return (
    <main className="relative min-h-screen w-full flex justify-center p-2 sm:p-4 overflow-hidden">
       <div className="absolute inset-0 w-full h-full bg-cover bg-center blur-sm" style={{ backgroundImage: "url('https://i.ibb.co/SXydHhRK/istockphoto-913219882-612x612.jpg')" }}>
         <div className="absolute inset-0 w-full h-full bg-black/60 z-0"></div>
       </div>
      
      <Card className="max-w-4xl w-full grid md:grid-cols-2 grid-cols-1 overflow-hidden shadow-2xl z-10 
                       bg-card/60 backdrop-blur-lg border-white/10
                       transition-all duration-500 ease-out 
                       hover:shadow-primary/20 hover:shadow-2xl hover:scale-[1.02]
                       animate-fade-in-up my-auto">
        
        <div className="relative h-64 md:h-auto">
            <Image
                src="https://i.ibb.co/GvMF3Yqz/an-image-displaying-a-stock-market-chart-with-rising-or-falling-trends-allowing-space-for-text-backg.jpg"
                alt="Stock Market"
                fill
                objectFit="cover"
                className="opacity-90"
                data-ai-hint="background"
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>

        <div className="p-4 sm:p-6 md:p-8 flex items-center justify-center">
          <AuthForm />
        </div>
      </Card>
    </main>
  );
}
