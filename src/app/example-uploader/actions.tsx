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
    You are gonna receive an url, maybe a time range and a screenshot and a user input. 
    You are gonna use browserbase to scrape the webpage and return data. 
    The timestamp may be like 2w, 3d, or a specific date in the past. 
    The screenshot may contain the information that the user is interested in. 
    The user input may specify what kind of data the user wants.
    Today is ${new Date().toISOString()}.
    You are gonna first return a JSON object with the following keys:
    - url: The url of the webpage
    - time: user requested time
    - instructions: The instructions for the user
    - imageUrl: The url of the screenshot
    - document: the body element of the webpage in pure text. 
    - datasetId: the id of the dataset. it should be something like 'dataset_{first 14 chars of url}'
    - schema: all columns in the screenshot. for example. 
    
    Then call the browserTool. 
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