"use client";

import Image from "next/image";

interface StockLogoProps {
    domain: string;
    name: string;
    width?: number;
    height?: number;
    className?: string;
}

export default function StockLogo({ domain, name, width = 40, height = 40, className }: StockLogoProps) {
  const logoUrl = `https://logo.clearbit.com/${domain}`;
  
  return (
    <Image
      src={logoUrl}
      alt={`${name} logo`}
      width={width}
      height={height}
      className={`rounded-full ${className}`}
      data-ai-hint="logo"
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.onerror = null; // prevents looping
        target.src = `https://www.google.com/s2/favicons?sz=64&domain_url=${domain}`;
      }}
    />
  );
}
