'use server';

import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { Browserbase, BrowserbaseAISDK } from "@browserbasehq/sdk";
import { z } from 'zod';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const browserbase = new Browserbase({
  apiKey: process.env.BROWSERBASE_API_KEY,
  projectId: process.env.BROWSERBASE_PROJECT_ID,
});

// Use Browserbase AI SDK to enable browserbase and allow text content
const browserTool = BrowserbaseAISDK(browserbase, { textContent: true });


export async function continueConversation(history: Message[]) {
  const { text, toolResults } = await generateText({
    model: openai('gpt-4o'),
    maxTokens: 4096,
    system: `
    You are gonna receive
    `,
    messages: history,
    tools: {
      browserTool,
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