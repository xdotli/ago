import { chromium } from "playwright-core";

(async () => {
  const browser = await chromium.connectOverCDP(
    `wss://connect.browserbase.com?apiKey=${'bb_live_rk86r3VndSCj8qdcUHbJ7yKzpuc'}`
  );

  // Getting the default context to ensure the sessions are recorded.
  const defaultContext = browser.contexts()[0];
  if (!defaultContext) {
    throw new Error("No default context available");
  }
  const page = defaultContext.pages()[0];
  if (!page) {
    throw new Error("No page available in the default context");
  }

  await page.goto("https://browserbase.com/");
  console.log(page.url());
  await page.close();
  await browser.close();
})().catch((error) => console.error(error instanceof Error ? error.message : 'An unknown error occurred'));
