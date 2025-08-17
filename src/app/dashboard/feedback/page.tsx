
"use client";

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Send, Loader2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useState } from 'react';

const feedbackSchema = z.object({
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters long.' }).max(100, { message: 'Subject is too long.' }),
  message: z.string().min(20, { message: 'Feedback must be at least 20 characters long.' }).max(2000, { message: 'Feedback is too long.' }),
});

export default function FeedbackPage() {
  const { userData } = useApp();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof feedbackSchema>>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof feedbackSchema>) => {
    if (!userData) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "You must be logged in to submit feedback.",
        });
        return;
    }
    setIsSubmitting(true);
    try {
        const response = await fetch('/api/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...values,
                username: userData.user.name,
            }),
        });

        if (response.ok) {
            toast({
                title: 'Feedback Submitted!',
                description: "Thank you! We've received your feedback.",
            });
            form.reset();
        } else {
            const errorData = await response.json();
             toast({
                variant: 'destructive',
                title: 'Submission Failed',
                description: errorData.message || 'An unexpected error occurred. Please try again.',
            });
        }

    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Network Error',
            description: 'Could not connect to the server. Please check your connection.',
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto animate-fade-in-up">
      <h1 className="text-3xl font-bold mb-8">Submit Feedback</h1>
      <Card className="max-w-2xl mx-auto transition-all duration-300 hover:shadow-xl">
        <CardHeader>
          <CardTitle>We Value Your Feedback</CardTitle>
          <CardDescription>
            Have a suggestion, a bug report, or a general comment? Let us know! Your feedback helps us improve Tradeverse.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Suggestion for the portfolio page" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Feedback</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Please describe your feedback in detail..." {...field} rows={8} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Send className="mr-2 h-4 w-4" />
                )}
                {isSubmitting ? 'Submitting...' : 'Send Feedback'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
