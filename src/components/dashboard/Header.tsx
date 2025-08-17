
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "../shared/Logo";
import { UserNav } from "./UserNav";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { Menu, Bot } from "lucide-react";
import Assistant from "./Assistant";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/portfolio", label: "Portfolio" },
    { href: "/dashboard/watchlist", label: "Watchlist" },
    { href: "/dashboard/wallet", label: "Wallet" },
];

export default function Header() {
    const pathname = usePathname();
    const { userData } = useApp();
    const [isAssistantOpen, setAssistantOpen] = useState(false);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);


    const handleLinkClick = () => {
        setMobileMenuOpen(false);
    };

    return (
        <>
            <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/30 backdrop-blur-lg px-4 md:px-6">
                <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                    <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold md:text-base">
                        <Logo />
                        <span className="sr-only">Tradeverse</span>
                    </Link>
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "transition-colors hover:text-foreground",
                                pathname === link.href ? "text-foreground font-semibold" : "text-muted-foreground"
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
                <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle navigation menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <nav className="grid gap-6 text-lg font-medium">
                            <Link href="#" className="flex items-center gap-2 text-lg font-semibold" onClick={handleLinkClick}>
                               <Logo />
                               <span className="sr-only">Tradeverse</span>
                            </Link>
                            {navLinks.map((link) => (
                                 <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={handleLinkClick}
                                    className={cn(
                                        "transition-colors hover:text-foreground",
                                        pathname === link.href ? "text-foreground" : "text-muted-foreground"
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </SheetContent>
                </Sheet>
                <div className="flex w-full items-center justify-end gap-4">
                     {userData && (
                        <p className="hidden md:block text-sm text-muted-foreground transition-all duration-300 hover:text-foreground/90">
                            Hey, welcome back <span className="font-bold text-primary">{userData.user.name}</span>
                        </p>
                    )}
                     <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => setAssistantOpen(true)}>
                                    <Bot className="h-5 w-5" />
                                    <span className="sr-only">AI Assistant</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>AI Assistant</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <UserNav />
                </div>
            </header>
            <Assistant isOpen={isAssistantOpen} onOpenChange={setAssistantOpen} />
        </>
    );
}
