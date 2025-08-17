'use server';
/**
 * @fileOverview An AI flow for generating user avatars.
 *
 * - generateAvatar - A function that creates a funny cartoon avatar.
 * - AvatarInput - The input type for the generateAvatar function.
 * - AvatarOutput - The return type for the generateAvatar function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const AvatarInputSchema = z.object({
  prompt: z.string().describe('A creative prompt from the user describing the desired avatar.'),
});
export type AvatarInput = z.infer<typeof AvatarInputSchema>;

const AvatarOutputSchema = z.object({
  avatarDataUri: z.string().describe("A funny cartoon avatar of the user, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type AvatarOutput = z.infer<typeof AvatarOutputSchema>;

export async function generateAvatar(input: AvatarInput): Promise<AvatarOutput> {
  return generateAvatarFlow(input);
}

const generateAvatarFlow = ai.defineFlow(
  {
    name: 'generateAvatarFlow',
    inputSchema: AvatarInputSchema,
    outputSchema: AvatarOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `Generate a funny, cartoon-style avatar based on the following description: "${input.prompt}". The style should be playful, exaggerated, and suitable for a profile picture in a stock trading app. Ensure the background is simple and clean.`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media?.url) {
      throw new Error('Image generation failed to produce an image.');
    }

    return { avatarDataUri: media.url };
  }
);
