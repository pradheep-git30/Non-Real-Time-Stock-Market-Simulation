
"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import Header from "@/components/dashboard/Header";
import { LoaderCircle } from "lucide-react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('stockflow-username')) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const handleScroll = () => {
      const blobs = document.querySelectorAll('.animate-blob');
      const scrollY = window.scrollY;
      blobs.forEach((blob, index) => {
        // We use different speeds for a more noticeable parallax effect
        const speed = [0.1, 0.25, 0.4][index] || 0.1;
        (blob as HTMLElement).style.transform = `translateY(${scrollY * speed}px) scale(1.5)`;
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  if (!isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
       <div className="fixed inset-0 z-[-1] overflow-hidden">
        <div className="absolute top-0 left-0 h-96 w-96 bg-primary/10 rounded-full animate-blob filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 right-0 h-80 w-80 bg-accent/10 rounded-full animate-blob animation-delay-2000 filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-1/4 left-1/4 h-72 w-72 bg-primary/10 rounded-full animate-blob animation-delay-4000 filter blur-3xl opacity-20"></div>
      </div>
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 relative">
        {children}
      </main>
    </div>
  );
}
