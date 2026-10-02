import assert from "node:assert/strict";
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
const browser = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || "msedge" });
const url = process.env.PORTFOLIO_URL || "http://127.0.0.1:5186";
try {
  await mkdir("screenshots", { recursive: true });
  for (const width of [390, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: "reduce" });
    for (const era of [2002, 2006, 2009, 2013, 2026]) {
      await page.goto(`${url}/?era=${era}`);
      await page.locator("#release-guardian").waitFor();
      assert.equal(await page.locator(".project-media-gallery").count(), 0, "No fabricated or test media in real content");
      for (const [id, text] of [["release-guardian", "Working prototype; currently being turned into a structured application."], ["aichatflutter", "Completed desktop and Android applications."]]) {
        const article = page.locator(`#${id}`);
        const details = article.locator("details");
        if (await details.count()) await details.locator("summary").first().click();
        assert.equal(await article.getByText(text, { exact: true }).isVisible(), true);
        assert.match(await article.innerText(), /I did not write the code myself/);
        if (id === "aichatflutter") assert.match(await article.innerText(), /Telegram bot/);
        await article.screenshot({ path: `screenshots/case-${id}-${era}-${width}.png` });
      }
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      if (era === 2026) {
        await page.locator(".hero").screenshot({ path: `screenshots/hero-2026-${width}.png` });
        await page.getByRole("navigation", { name: "Portfolio shortcuts" }).getByRole("link", { name: /MIS-Bot/ }).click();
        assert.equal(new URL(page.url()).hash, "#mis-bot");
      }
    }
    await page.close();
  }
  console.log("PASS: confirmed statuses and authorship visible in every era; Telegram detail retained; no placeholder media; direct hero navigation; expanded case layouts fit mobile/desktop.");
} finally { await browser.close(); }
