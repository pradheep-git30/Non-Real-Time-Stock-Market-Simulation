'use server';
/**
 * @fileOverview A simple AI assistant for user queries.
 *
 * - askAssistant - A function that handles user queries.
 * - AssistantInput - The input type for the askAssistant function.
 * - AssistantOutput - The return type for the askAssistant function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const HistoryMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.array(z.object({ text: z.string() })),
});

const AssistantInputSchema = z.object({
  query: z.string().describe('The user\'s current question or message.'),
  history: z.array(HistoryMessageSchema).optional().describe('The conversation history.'),
});
export type AssistantInput = z.infer<typeof AssistantInputSchema>;

const AssistantOutputSchema = z.object({
  reply: z.string().describe('The AI\'s response to the user.'),
});
export type AssistantOutput = z.infer<typeof AssistantOutputSchema>;

export async function askAssistant(input: AssistantInput): Promise<AssistantOutput> {
  const model = 'googleai/gemini-1.5-flash-latest';

  const systemPrompt = `You are a helpful and friendly AI assistant for "StockFlow", a stock trading simulation application.
Your goal is to assist users with their questions about the app, help them with stock market queries, and handle bug reports or complaints gracefully.

- If the user asks a general stock market question, provide a helpful and informative answer.
- If the user is asking for help with the app, provide clear instructions.
- If the user is reporting a bug or a complaint, be empathetic, apologize for the inconvenience, and assure them that the feedback has been noted.
- Keep your responses concise and easy to understand.
`;

  const llmResponse = await ai.generate({
    model,
    system: systemPrompt,
    prompt: input.query,
    history: input.history,
    output: {
      schema: z.object({
        reply: z.string(),
      }),
    },
  });

  const output = llmResponse.output;

  if (!output) {
    throw new Error('Failed to get a response from the AI model.');
  }

  return { reply: output.reply };
}
