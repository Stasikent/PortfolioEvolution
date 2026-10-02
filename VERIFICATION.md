# Verification

## Accessibility, contacts and publication preparation — 26 September 2026

- Added the author's confirmed Telegram/email across all five editions. No separate resume: the site serves that purpose. Existing project URLs are preserved.
- Fixed low-contrast solid-background captions in 2009 and hero text in 2013; allowed enlarged headings, process grids, sidebars and contacts to wrap. 2006 decorative overflow is clipped while actual headings wrap.
- `tests/accessibility.mjs` passed all 20 combinations of five eras and widths 320/390/768/1440: solid-background text contrast (4.5:1 or 3:1 for large text), 200% computed font sizes without document overflow, expanded mobile controls, skip-link focus, Escape, one main/h1, confirmed contacts, malformed fragments and missing-page recovery. Accessibility-tree snapshots were captured; this is not a human screen-reader test. Gradient backgrounds are excluded from automated contrast calculations.
- `tests/deployment.mjs` passed local production tests for root and subdirectory builds: five eras, assets, 1200×630 social image, optional canonical URL, HTTP-404 recovery page and correct home link. No network deployment occurred.
- Media and content suites passed again. Final 1,600-transition regression passed at all four widths. A focus timing issue exposed by the run was corrected: closing the mobile era chooser now focuses its persistent toggle immediately with preventScroll instead of waiting for an animation frame.
- Final TypeScript/Vite production build passed with 48 modules, JS 278.26 kB (82.39 kB gzip), CSS 51.50 kB (12.42 kB gzip). The 404 HTML shell is emitted after the build. JavaScript-disabled contact fallbacks were checked in both root and subdirectory production tests.
- Contact layouts for all five editions were visually inspected at desktop/mobile widths; the social preview and mobile recovery page were also inspected. The accessibility pass is focused, not a full WCAG or screen-reader certification.
- Public-link fetch results were inconclusive for MIS-Bot and Google-hosted destinations; they were not labeled broken. See LINK-CHECK.md.


## Media and case iteration — 25 September 2026

- Continued from polished-v2 in a separate working copy; original September 13 copies were not edited.
- Added one shared media renderer to all five eras, with still images, click-to-start animated images, an on-demand native video player, external links, captions/text descriptions and failure fallback. No supplied project media exists yet, so production pages render no gallery or placeholder.
- Added shared overviews for AI Release Guardian and AIChatFlutter using the author's current confirmations and the Guardian repository README. Preserved all seven supplied project URLs. Provenance and remaining content gaps are recorded in CONTENT-SOURCES.md.
- `npm run build` passed with 47 modules. No new dependency was required.
- Existing `tests/regression.mjs` passed in installed Edge: 1,600 section transitions and 20 era/viewport combinations at 320/390/768/1440 px; history/deep links, keyboard focus, mobile widgets/Tab order, reduced motion, pause persistence and touch guard passed.
- `tests/media.mjs` passed for all five eras at 390 and 1440 px. It checked no animation/video request before interaction, keyboard animation start/stop, live motion-preference changes, real WebM playback, unload on return to poster, collapsed project details, a text alternative, failed image fallback and no horizontal overflow. Fixtures are injected only in that test browser and are not shipped as portfolio content.
- `tests/content.mjs` passed: confirmed status and authorship text is visible after opening each case, Telegram balance feedback is present, no synthetic media appears, hero links navigate correctly and expanded cases fit mobile/desktop. Screenshots of all five editions and the media fixtures were visually inspected at both widths. Adjusted 2013 media to span its case grid and corrected the 2026 case panel background/label readability.
- Remaining limits: no real MIS-Bot media supplied; no full screen-reader/contrast audit, Firefox/Safari run, or independent execution of the featured projects. Existing external project URLs were preserved, not all revalidated. The site has not been publicly deployed.

The entries below are historical results from earlier iterations.

## Five-era expansion — 13 September 2026

- Implemented set: 2002, 2006, 2009, 2013, 2026. The two additions use shared content without invented publication dates, client metrics or screenshots. 2006 presents a personal weblog and sidebar index; 2013 presents a flat-design gallery leading to anchored case notes. Its small device illustrations are decorative CSS graphics, not project screenshots.
- TypeScript and Vite build passed: 44 modules; JS 267.42 kB (79.62 kB gzip), CSS 44.79 kB (11.11 kB gzip). No new runtime dependencies were needed.
- Browser regression passed in installed Edge through Playwright against http://127.0.0.1:5173: 1,600 transitions across every ordered era pair and ten logical destinations at 320/390/768/1440 px, including immediate returns and page-bottom clamping. The persistent buttons retained keyboard focus.
- All 20 era/width combinations had no document horizontal overflow and the five-button era control fit within the viewport. Full-page screenshots were captured for all five eras at desktop and mobile widths, with both new designs visually inspected.
- New blog and case-note details opened and closed with Enter. The 2013 gallery navigated to AI Release Guardian; switching from that project to 2006 retained the same project.
- Existing mobile 2009 widgets, main-first Tab order, local poll, reduced motion, touch cursor guard and effects-off persistence through all five eras passed regression. No pageerror was reported by the transition matrix.
- All six src/content files match the previous portfolio-fixed.zip byte for byte by SHA-256. Supplied factual content and external destinations are unchanged.
- README and the repository instructions describe the expanded scope. 2020 and the cinematic intro remain deferred.

This remains a Chromium/Edge regression pass, not a full cross-browser, screen-reader or contrast audit. External destinations were not revalidated. The earlier verification entries below apply only to their named iterations.

## Corrective iteration — 12 September 2026

The checks below were executed on the corrected three-era project, separately from the historical two-era smoke test retained below.

- Dependency installation succeeded using the intact npm CLI. Playwright 1.62.1 was added as a development dependency for the checked-in browser suite; npm reported 0 vulnerabilities across 52 audited packages. The restricted registry request initially failed with EACCES; the authorized retry succeeded.
- `npm run build` passed: TypeScript and Vite 8.3.0, 40 modules. Generated JS: 252.91 kB (77.64 kB gzip); CSS: 27.03 kB (7.23 kB gzip).
- `tests/regression.mjs` passed against the local Vite server at http://127.0.0.1:5174, with Playwright using installed Edge in headless mode.
- 480 section transitions passed: every ordered pair of 2002/2009/2026, ten destinations (home, about, projects, all three projects, story, skills, process, contact), four widths (320/390/768/1440), including immediate return trips. The expected destination accounts for scroll-margin and the page-bottom scroll limit. Keyboard Enter changed eras and focus remained on the persistent button.
- All 12 era/width combinations had no document horizontal overflow. Desktop/mobile screenshots were inspected for all three eras. The 2009 desktop composition remains three-column; mobile main content precedes its sidebars.
- Mobile calendar and statistics were visible. Main precedes the left sidebar in DOM and visual order; Tab after the final header link reaches main content.
- Effects remain off after 2009 → 2002 → 2026 → 2009. System reduced motion removes snow/trail and stops the equalizer. Re-enabling system motion permits the effects when the session toggle is on. The overlay has pointer-events:none; cursor trail is absent in a touch context.
- Native details opens with Enter, and the local poll displays its response. No pageerror was captured during the section-transition matrix.
- An additional non-reduced-motion browser smoke test reproduced the corrected about transition: 2009 about at scrollY 184 → the actual 2026 about text at scrollY 1847, rather than leaving the old offset unchanged.
- SHA-256 comparisons against the original local project confirmed all six src/content files are byte-for-byte unchanged. Project descriptions, biography, technologies, metrics and supplied URLs were not edited.

Reproduce with the dev server already running (PowerShell):

```powershell
$env:PLAYWRIGHT_CHANNEL = 'msedge'
$env:PORTFOLIO_URL = 'http://127.0.0.1:5174'
npm run test:e2e
```

Use the URL printed by your server. With no browser channel, install Playwright Chromium first. The review machine required the direct npm CLI prefix documented in README.

Limits: this is a regression pass, not a full screen-reader, contrast or cross-browser audit. External services and Google sharing permissions were not revalidated. The effects preference lasts for the page session; it intentionally resets on reload. No new eras, intro or deployment were added.

## Historical first iteration — two eras only

The following records were already present in the supplied archive. They are retained as historical claims and do not establish coverage of 2009 or supersede the current results above.

- Dependency installation completed successfully using the intact npm CLI. npm reported zero vulnerabilities.
- `npm run build` passed: TypeScript and Vite 8.3.0 production compilation.
- `npm run dev` started and served the portfolio at `http://127.0.0.1:5173/`.
- Browser initial render selected 2026. Both era renderers were visually inspected on desktop and at a 390 × 844 mobile viewport.
- Both mobile layouts had a document scroll width of 375px within the 390px viewport (the remaining width is the browser scrollbar): no page-level horizontal overflow.
- Keyboard Enter on the 2026 era button changed the renderer and its pressed state.
- Story navigation placed the section at 100px from the viewport top. Switching to 2002 restored it at 99.5px; keyboard focus remained on the persistent era button. Switching back restored 2026.
- Browser console contained no warnings or errors during these checks.
- Both rendered project link lists match the seven supplied project URLs; GitHub profile links use the supplied profile URL.
- Remote availability could not be independently confirmed: this environment's HTTP requests to the external destinations failed TLS negotiation. The URLs were preserved exactly, with no placeholders or substituted destinations. Google file sharing permissions remain under the owner's control.

These checks are a first-iteration smoke test, not a full accessibility audit or a guarantee of external service availability.
