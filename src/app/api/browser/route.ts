import { openai } from '@ai-sdk/openai';
import { Browserbase, BrowserbaseAISDK } from '@browserbasehq/sdk';
import { generateText } from 'ai';

// Init the Browserbase SDK
const browserbase = new Browserbase({
  apiKey: process.env.BROWSERBASE_API_KEY,
  projectId: process.env.BROWSERBASE_PROJECT_ID,
});

// Use Browserbase AI SDK to enable browserbase and allow text content
const browserTool = BrowserbaseAISDK(browserbase, { textContent: true });

// Generates text using the browserTool and OpenAI
export async function GET(request: Request) {
  const { text } = await generateText({
    model: openai.chat("gpt-3.5-turbo"),
    tools: {
      browserTool,
    },
    prompt: "What is the weather in San Francisco?",
  });
  return new Response(text, {
    status: 200,
  });
}
