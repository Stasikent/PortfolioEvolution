import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

// Test-only media is injected into Vite's module response. No fictional media
// enters the content model, public directory, or production build.
const url = process.env.PORTFOLIO_URL || "http://127.0.0.1:5186";
const browser = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || "msedge" });
const errors = [];
const fixtures = [
  { type: "image", src: "/__media/photo.svg", alt: "Static test image", caption: "Test fixture — static image", width: 640, height: 360 },
  { type: "animation", src: "/__media/motion.gif", poster: "/__media/poster.svg", alt: "Animation test", caption: "Test fixture — click to animate", width: 640, height: 360 },
  { type: "video", src: "/__media/movie.webm", poster: "/__media/poster.svg", alt: "Video test", transcript: "A blue canvas used to verify video playback." },
  { type: "external", src: "https://example.com/media-test", alt: "External test demo" },
  { type: "image", src: "/__media/missing.png", alt: "Missing test image" },
];
const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="640" height="360" fill="#dce7d3"/><rect x="32" y="32" width="576" height="296" rx="8" fill="#243f35"/><text x="320" y="175" fill="white" text-anchor="middle" font-family="sans-serif" font-size="28">MEDIA TEST FIXTURE</text><text x="320" y="215" fill="white" text-anchor="middle" font-family="sans-serif" font-size="16">Not a project screenshot</text></svg>';
try {
  const recorder = await browser.newPage();
  const recording = await recorder.evaluate(async () => {
    const canvas = document.createElement("canvas"); canvas.width = 320; canvas.height = 180;
    const ctx = canvas.getContext("2d"); ctx.fillStyle = "#244499"; ctx.fillRect(0, 0, 320, 180);
    const stream = canvas.captureStream(10);
    const chunks = [];
    const media = new MediaRecorder(stream, { mimeType: "video/webm" });
    const done = new Promise(resolve => { media.ondataavailable = e => chunks.push(e.data); media.onstop = resolve; });
    media.start();
    for (let frame = 0; frame < 20; frame++) {
      ctx.fillStyle = frame % 2 ? "#244499" : "#244488"; ctx.fillRect(0, 0, 320, 180);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    media.stop(); await done; stream.getTracks().forEach(track => track.stop());
    return Array.from(new Uint8Array(await new Blob(chunks).arrayBuffer()));
  });
  await recorder.close();
  await mkdir("screenshots", { recursive: true });
  for (const width of [390, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
    page.on("pageerror", error => errors.push(error.message));
    const requested = [];
    await page.route("**/src/content/projects.ts*", async route => {
      const response = await route.fetch();
      await route.fulfill({ response, body: (await response.text()) + `\nprojects[0].media = ${JSON.stringify(fixtures)};` });
    });
    await page.route("**/__media/**", async route => {
      const pathname = new URL(route.request().url()).pathname;
      requested.push(pathname);
      if (pathname.endsWith(".svg")) await route.fulfill({ contentType: "image/svg+xml", body: svg });
      else if (pathname.endsWith(".gif")) await route.fulfill({ contentType: "image/gif", body: Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64") });
      else if (pathname.endsWith(".webm")) await route.fulfill({ contentType: "video/webm", body: Buffer.from(recording) });
      else await route.fulfill({ status: 404, body: "Missing test fixture" });
    });
    for (const era of [2002, 2006, 2009, 2013, 2026]) {
      requested.length = 0;
      await page.goto(`${url}/?era=${era}#mis-bot`);
      const project = page.locator("#mis-bot");
      const details = project.locator(":scope > details, .entry-details, .blog-more").first();
      if (await details.count()) await details.locator(":scope > summary").click();
      const gallery = project.locator(".project-media-gallery");
      await gallery.scrollIntoViewIfNeeded();
      await gallery.locator("img").first().waitFor();
      assert.equal(await gallery.locator("figure").count(), 5);
      assert.equal(await gallery.locator("video").count(), 0);
      assert.ok(!requested.includes("/__media/motion.gif"));
      assert.ok(!requested.includes("/__media/movie.webm"));
      await page.screenshot({ path: `screenshots/media-${era}-${width}.png` });
      const animation = gallery.getByRole("button", { name: /^Play animation/ });
      await animation.focus(); await page.keyboard.press("Enter");
      await gallery.locator('img[src$="motion.gif"]').waitFor();
      await gallery.getByRole("button", { name: /^Show still preview.*Animation test/ }).click();
      assert.equal(await gallery.locator('img[src$="motion.gif"]').count(), 0);
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await animation.click();
      await page.emulateMedia({ reducedMotion: "reduce" });
      await animation.waitFor();
      assert.equal(await gallery.locator('img[src$="motion.gif"]').count(), 0);
      await gallery.getByRole("button", { name: /^Load video player/ }).click();
      const video = gallery.locator("video");
      assert.equal(await video.getAttribute("preload"), "none");
      assert.equal(await video.getAttribute("autoplay"), null);
      await video.evaluate(async el => { await el.play(); });
      assert.equal(await video.evaluate(el => el.paused), false);
      await gallery.getByRole("button", { name: /^Show still preview.*Video test/ }).click();
      assert.equal(await gallery.locator("video").count(), 0);
      await gallery.getByText("Video description", { exact: false }).click();
      assert.equal(await gallery.getByText(fixtures[2].transcript).isVisible(), true);
      if (await details.count()) {
        await animation.click();
        await details.locator(":scope > summary").click();
        await page.waitForFunction(() => !document.querySelector('#mis-bot img[src$="motion.gif"]'));
        await details.locator(":scope > summary").click();
      }
      await gallery.locator("figure").last().scrollIntoViewIfNeeded();
      await gallery.getByRole("status").waitFor();
      assert.equal(await gallery.getByRole("link", { name: "Open the original ↗" }).getAttribute("href"), "/__media/missing.png");
      assert.equal(await gallery.getByRole("link", { name: "External test demo ↗" }).getAttribute("rel"), "noreferrer");
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${era}/${width}: no overflow`);
    }
    await page.close();
  }
  assert.deepEqual(errors, []);
  console.log("PASS: media in all five eras at mobile/desktop; no automatic motion/video download; keyboard start/stop; preference changes; real video playback; collapsed details; text alternative; missing-image fallback; external links; no overflow.");
} finally { await browser.close(); }
