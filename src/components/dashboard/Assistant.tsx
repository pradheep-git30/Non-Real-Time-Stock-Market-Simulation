
"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Bot, Send, Loader2, User, X } from "lucide-react";
import { useAssistant } from "@/hooks/useAssistant";
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';

interface AssistantProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

export default function Assistant({ isOpen, onOpenChange }: AssistantProps) {
    const { userData } = useApp();
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useAssistant({
        api: '/api/assistant'
    });

    const getInitials = (name: string) => name ? name.charAt(0).toUpperCase() : '?';

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent className="flex flex-col">
                <SheetHeader>
                    <SheetTitle>AI Assistant</SheetTitle>
                    <SheetDescription>
                        Ask me anything about stocks, report a bug, or share your feedback.
                    </SheetDescription>
                </SheetHeader>
                <ScrollArea className="flex-grow my-4 pr-4">
                    <div className="space-y-4">
                        {messages.map((m) => (
                            <div key={m.id} className={cn("flex items-start gap-3", m.role === 'user' ? 'justify-end' : 'justify-start')}>
                                 {m.role === 'assistant' && (
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback><Bot /></AvatarFallback>
                                    </Avatar>
                                )}
                                <div className={cn("rounded-lg px-4 py-2 max-w-[80%]", m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                                    <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                                </div>
                                {m.role === 'user' && userData && (
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={userData.user.avatar} alt={userData.user.name} />
                                        <AvatarFallback>{getInitials(userData.user.name)}</AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        ))}
                        {isLoading && (
                             <div className="flex items-start gap-3 justify-start">
                                 <Avatar className="h-8 w-8">
                                        <AvatarFallback><Bot /></AvatarFallback>
                                 </Avatar>
                                  <div className="rounded-lg px-4 py-2 bg-muted flex items-center">
                                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                                  </div>
                             </div>
                        )}
                    </div>
                </ScrollArea>
                <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t pt-4">
                    <Input
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Type your message..."
                        disabled={isLoading}
                    />
                    <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                        <Send />
                        <span className="sr-only">Send</span>
                    </Button>
                </form>
            </SheetContent>
        </Sheet>
    );
}
