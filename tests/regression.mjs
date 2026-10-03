import assert from "node:assert/strict";
import { chromium } from "playwright";

// Run against a separately started dev/preview server. Browser binaries are optional
// when PLAYWRIGHT_CHANNEL selects an installed Chrome or Edge.
const browser = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || undefined });
const url = process.env.PORTFOLIO_URL || "http://127.0.0.1:5173";
const eras = [2002, 2006, 2009, 2013, 2026];
const positions = ["home", "about", "projects", "mis-bot", "release-guardian", "aichatflutter", "story", "skills", "process", "contact"];
const errors = [];
let transitions = 0;

const activeEra = page => page.locator('.era-control button[aria-pressed="true"]');

async function select(page, era) {
  const control = page.locator(".era-control");
  const button = control.getByRole("button", { name: String(era), exact: true });
  if (!(await button.isVisible())) {
    // Mobile uses a collapsed era control. Do not depend on its translated label.
    const toggle = control.locator("button").filter({ visible: true }).first();
    await toggle.click();
  }
  await button.waitFor({ state: "visible" });
  // Keyboard switching must preserve focus without scrolling to the era's controls.
  await button.focus();
  await page.keyboard.press("Enter");
  await page.waitForFunction(year => document.querySelector(`.era-control button[aria-pressed="true"]`)?.textContent?.trim() === String(year), era);
  if (page.viewportSize().width <= 580) {
    assert.ok(await control.locator('button:focus').count(), "Era control keeps keyboard focus on mobile");
  } else {
    assert.equal(await button.evaluate(el => document.activeElement === el), true);
  }
}

async function navigate(page, id) {
  await page.evaluate(id => {
    location.hash = id;
    document.getElementById(id).scrollIntoView({ block: "start", behavior: "instant" });
  }, id);
  await page.waitForTimeout(30); // Allow the native hashchange event to finish.
}

async function assertAt(page, id) {
  const distance = await page.locator(`#${id}`).evaluate(el => {
    const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
    const desired = Math.max(0, Math.min(document.documentElement.scrollHeight - innerHeight, scrollY + el.getBoundingClientRect().top - margin));
    return Math.abs(scrollY - desired);
  });
  assert.ok(distance < 2, `${id}: reading position is ${distance}px from destination`);
}

try {
  for (const width of [320, 390, 768, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
    page.on("pageerror", error => errors.push(error.message));
    for (const source of eras) {
      for (const id of positions) {
        await page.goto(url);
        await select(page, source);
        await navigate(page, id);
        for (const destination of eras.filter(era => era !== source)) {
          await select(page, destination);
          await assertAt(page, id);
          await select(page, source);
          await assertAt(page, id); // Repeat immediately, including clamped footer positions.
          transitions += 2;
        }
      }
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `Overflow: ${source}/${width}`);
      assert.equal(await page.locator("main").count(), 1, `One main landmark: ${source}/${width}`);
      assert.equal(await page.locator("h1").count(), 1, `One page heading: ${source}/${width}`);
      for (const id of ["mis-bot", "release-guardian", "aichatflutter"]) {
        assert.equal(await page.locator(`#${id}`).count(), 1, `One shared project ${id}: ${source}/${width}`);
      }
      // Process copy is translated, so verify its stable structure rather than English labels.
      const process = page.locator("#process");
      assert.equal(await process.count(), 1, `Process section exists: ${source}/${width}`);
      assert.ok((await process.innerText()).trim().length > 0, `Process section has content: ${source}/${width}`);
      assert.equal(await page.locator('.era-control').evaluate(el => {
        const rect = el.getBoundingClientRect();
        return rect.left >= 0 && rect.right <= innerWidth;
      }), true, `Era control fits: ${source}/${width}`);
    }
    console.log(`PASS: section matrix at ${width}px`);
    await select(page, 2009);
    assert.equal(await page.locator(".catalog-calendar").isVisible(), true);
    assert.equal(await page.locator(".catalog-statistics").isVisible(), true);
    if (width <= 390) {
      const order = await page.evaluate(() => {
        const main = document.querySelector(".catalog-main");
        const aside = document.querySelector(".catalog-left");
        return main.getBoundingClientRect().top < aside.getBoundingClientRect().top
          && !!(main.compareDocumentPosition(aside) & Node.DOCUMENT_POSITION_FOLLOWING);
      });
      assert.equal(order, true, "Mobile main must precede the sidebar visually and in DOM");
      await page.locator(".catalog-ticker a").focus();
      await page.keyboard.press("Tab");
      assert.equal(await page.evaluate(() => document.activeElement.closest("main")?.id), "main", "Tab after header should reach main");
    }
    await page.close();
  }

  const page = await browser.newPage();
  await page.goto(url);
  await select(page, 2009);
  await page.locator(".retro-snow").waitFor();
  await page.locator(".retro-cursor-trail").waitFor();
  // The effects button copy is localized. Identify it by the state it controls.
  const effectsButton = page.locator('button[aria-pressed]').filter({ hasNot: activeEra(page) }).filter({ visible: true }).last();
  await effectsButton.click();
  for (const era of [2002, 2006, 2013, 2026, 2009]) await select(page, era);
  assert.equal(await effectsButton.getAttribute("aria-pressed"), "false");
  assert.equal(await page.locator(".retro-snow, .retro-cursor-trail").count(), 0);
  assert.equal(await page.locator(".player-equalizer i").first().evaluate(el => getComputedStyle(el).animationName), "none");
  await effectsButton.click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForFunction(() => !document.querySelector(".retro-snow, .retro-cursor-trail"));
  assert.equal(await page.locator(".player-equalizer i").first().evaluate(el => getComputedStyle(el).animationName), "none");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.locator(".retro-snow").waitFor();
  assert.equal(await page.locator(".retro-snow").evaluate(el => getComputedStyle(el).pointerEvents), "none");
  const poll = page.locator('input[type="radio"]').first();
  await poll.check();
  assert.ok((await page.locator(".poll-response").textContent()).trim().length > 0);
  await page.locator(".entry-details summary").first().focus();
  await page.keyboard.press("Enter");
  assert.equal(await page.locator(".entry-details").first().evaluate(el => el.open), true);
  await page.close();

  const additions = await browser.newPage({ reducedMotion: "reduce" });
  for (const era of [2006, 2013]) {
    await additions.goto(url);
    await select(additions, era);
    assert.equal(await additions.locator("main").count(), 1);
    assert.equal(await additions.locator("h1").count(), 1);
    for (const id of ["mis-bot", "release-guardian", "aichatflutter"]) {
      const details = additions.locator(`#${id} details`);
      await details.locator("summary").focus();
      await additions.keyboard.press("Enter");
      assert.equal(await details.evaluate(el => el.open), true);
      assert.ok(await details.innerText());
      await additions.keyboard.press("Enter");
      assert.equal(await details.evaluate(el => el.open), false);
    }
    if (era === 2013) {
      await additions.locator('.flat-gallery a[href="#release-guardian"]').click();
      await assertAt(additions, "release-guardian");
      await select(additions, 2006);
      await assertAt(additions, "release-guardian");
    }
  }
  await additions.close();

  const routing = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
  await routing.goto(`${url}/?era=2009#mis-bot`);
  await routing.waitForFunction(() => document.querySelector('.era-control button[aria-pressed="true"]')?.textContent?.trim() === "2009");
  await assertAt(routing, "mis-bot");
  await select(routing, 2013);
  assert.equal(new URL(routing.url()).searchParams.get("era"), "2013");
  await routing.goBack();
  await routing.waitForFunction(() => document.querySelector('.era-control button[aria-pressed="true"]')?.textContent?.trim() === "2009");
  await assertAt(routing, "mis-bot");
  await routing.close();

  const touch = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });
  const mobile = await touch.newPage();
  await mobile.goto(url);
  await select(mobile, 2009);
  await mobile.locator(".retro-snow").waitFor();
  assert.equal(await mobile.locator(".retro-cursor-trail").count(), 0);
  assert.equal(await mobile.locator(".catalog-calendar").isVisible(), true);
  await touch.close();

  assert.deepEqual(errors, []);
  console.log(`PASS: ${transitions} section transitions; 20 era/width combinations; deep links and browser history; mobile widgets and Tab order; motion preference, pause persistence, touch, blog entries, gallery, details and poll.`);
} finally {
  await browser.close();
}
