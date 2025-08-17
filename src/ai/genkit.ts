/**
 * @fileOverview Genkit configuration
 *
 * This file configures and initializes the Genkit AI toolkit.
 * It specifies the plugins to use, such as Google AI for generative models.
 * It also configures logging and tracing for development and debugging purposes.
 *
 * The exported `ai` object is the main entry point for interacting with
 * Genkit's capabilities, including defining flows, prompts, and tools.
 */

import { genkit, type Genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

export const ai: Genkit = genkit({
  plugins: [
    googleAI(),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
