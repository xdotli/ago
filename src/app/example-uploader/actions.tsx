'use server';

import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function continueConversation(history: Message[]) {
  const { text, toolResults } = await generateText({
    model: openai('gpt-4-turbo'),
    system: 'You are a helpful assistant that analyzes web pages based on screenshots and URLs. Use the provided tools when necessary.',
    messages: history,
    tools: {
      analyzeScreenshot: {
        description: 'Analyzes a screenshot of a webpage',
        parameters: z.object({
          imageUrl: z.string().url().describe('The URL of the screenshot image'),
        }),
        execute: async ({ imageUrl }) => {
          // In a real implementation, this would call a computer vision API
          // For this example, we'll return a mock analysis
          return `Analysis of screenshot at ${imageUrl}:
          - The webpage appears to be a news article
          - There's a large header image at the top
          - The layout is responsive and mobile-friendly
          - The color scheme is predominantly blue and white`;
        },
      },
      parseTimestamp: {
        description: 'Parses a timestamp string into a standardized format',
        parameters: z.object({
          timestamp: z.string().describe('The timestamp string to parse'),
        }),
        execute: async ({ timestamp }) => {
          // This is a simplified parser. In a real implementation, you'd use a more robust solution
          if (timestamp.endsWith('w')) {
            const weeks = parseInt(timestamp.slice(0, -1));
            const date = new Date();
            date.setDate(date.getDate() - weeks * 7);
            return date.toISOString();
          } else if (timestamp.endsWith('d')) {
            const days = parseInt(timestamp.slice(0, -1));
            const date = new Date();
            date.setDate(date.getDate() - days);
            return date.toISOString();
          } else {
            // Assume it's a date string
            return new Date(timestamp).toISOString();
          }
        },
      },
    },
  });

  return {
    messages: [
      ...history,
      {
        role: 'assistant' as const,
        content: text || toolResults.map(toolResult => toolResult.result).join('\n'),
      },
    ],
  };
}