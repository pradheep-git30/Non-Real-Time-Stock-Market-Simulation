"use client";

import { useState, type FormEvent, type ChangeEvent, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { askAssistant, type AssistantInput, type AssistantOutput } from '@/ai/flows/assistant-flow';

// Genkit uses 'model' for the AI's role, so we map it.
type Role = 'user' | 'assistant' | 'model';

interface Message {
    id: string;
    content: string;
    role: Role;
}

interface UseAssistantProps {
    api: string; // Not used for direct flow call, but kept for API-like structure
}

const initialMessage: Message = {
    id: 'initial',
    role: 'assistant',
    content: "Hello! I'm the StockFlow AI assistant. How can I help you today? You can ask me about stocks, report issues, or share your feedback."
};

export function useAssistant({ api }: UseAssistantProps) {
    const [messages, setMessages] = useState<Message[]>([initialMessage]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setInput(e.target.value);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage: Message = { id: nanoid(), role: 'user', content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Filter out the initial hardcoded message and map 'assistant' role to 'model' for Genkit
            const history = messages
              .filter(m => m.id !== 'initial')
              .map(m => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                content: [{text: m.content}]
            }));
            
            const response: AssistantOutput = await askAssistant({
                query: input,
                history,
            });

            const assistantMessage: Message = {
                id: nanoid(),
                role: 'assistant',
                content: response.reply,
            };
            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Error fetching AI response:', error);
            const errorMessage: Message = {
                id: nanoid(),
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.',
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        isLoading,
    };
}
