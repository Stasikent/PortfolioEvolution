# One content model. Five different webs.

Stanislav Romanovich's developer portfolio, built with React, TypeScript, Vite and plain CSS. The default 2026 edition is a professional editorial portfolio; 2002 is a compact software-directory portal; 2006 is a personal weblog with expandable project entries and a sidebar index; 2009 is a modular catalogue with period widgets; 2013 is a flat-design portfolio with an illustrated project gallery and case notes. Each has its own information architecture.

## Run locally

Use Node.js 22.12 or later and npm.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. For a production build:

```sh
npm run build
npm run preview
```

The scripts use Vite's runner configuration loader for compatibility with restricted Windows environments. If this computer's npm launcher reports a missing `npm-cli.js` under AppData, invoke the intact installation directly in PowerShell:

```powershell
& 'C:\Program Files\Node.js\node.exe' 'C:\Program Files\Node.js\node_modules\npm\bin\npm-cli.js' run dev
```

The same prefix accepts `install` and `run build`. This is an existing machine launcher issue; the project does not change the global Node installation.

## Structure and data flow

```text
src/
  content/           Profile, projects, skills, timeline, build process
  components/        Shared media behavior and factual project overviews
  core/
    EraProvider.tsx  Era state, session motion choice, position restoration
    logicalPosition.ts Typed sections, per-era anchor mapping, fallback
    EraRouter.tsx    Typed renderer registry
    EraTimeline.tsx  Persistent accessible era switch
  eras/
    2002/           Portal layout, program listings and period CSS
    2006/           Personal weblog, project entries, sidebar index
    2009/           Modular catalogue, expandable entries, period widgets
    2013/           Flat-design gallery, case notes, chapter timeline
    2026/           Editorial layout, case studies and modern CSS
  effects/          Snow, cursor trail and reduced-motion policy
  intro/            Inactive IntroPlayer placeholder
```

Shared content → selected era renderer → semantic UI. All five renderers import the same objects; factual project copy is never duplicated in presentation components. Period-specific labels are presentation, not new portfolio facts. Decorative counters and imaginary chat are explicitly labeled. The visual player has no audio; the poll is local, unsaved and unsubmitted. Calendar and statistics remain available on narrow screens.

EraProvider starts in 2026 unless a valid `?era=` URL selects another implemented edition. Switching updates browser history without reloading the page, so links such as `?era=2009#mis-bot` are shareable and Back/Forward restores the edition. Typed logical sections and project identities map to anchors in each era. About maps to the 2002 welcome, the 2009 pinned introduction and the 2026 story introduction. A layout effect restores the destination instantly after the new DOM commits. Missing project anchors fall back to projects; missing sections fall back to home, then page top. Native hash navigation and remembered restored positions handle the page-bottom scroll limit. After scrolling away, the next switch reads the current position. On narrow screens the persistent switch collapses after a choice and returns focus to its compact toggle; desktop keeps the complete control visible.

Effects are initially enabled, but switching eras retains the user's off choice for this page session. Reloading resets that choice. System reduced motion always suppresses snow, cursor trail and equalizer animation, even when the session toggle is on. Cursor trail requires hover, a fine pointer and mouse events. Overlays never intercept pointer events. No persistent preference storage or analytics is used.

The complete `Era` union reserves 2002, 2006, 2009, 2013, 2020 and 2026. `ImplementedEra` is derived from `implementedEras` and constrains the switch and renderer registry. Add a future era there and TypeScript requires its renderer. Preserve shared anchor IDs to retain reading position.

## Content boundaries

All facts and external destinations come from the supplied specification. Early web exploration around 2009 is explicitly distinguished from continuous professional development experience. No employment dates, quantitative results, testimonials, email address or contact form are invented. GitHub is the supplied contact destination. Project links open in a new tab; external access and Google sharing permissions are controlled by their owners.

## Accessibility and verification

All five layouts provide semantic landmarks, heading hierarchy, skip navigation, focus outlines, native buttons and links, an announced era state, and responsive CSS. The era buttons expose their selection through `aria-pressed`. Reduced-motion preferences disable smooth scrolling and transitions. Mobile 2009 DOM order follows the visible main → sidebar → widgets sequence; desktop CSS retains the three-column composition.

Manual regression checklist:

- Initial load shows 2026 unless `?era=` selects an edition; all five era buttons work without reloading.
- Switch while reading each project and section; the logical section is retained.
- All three projects, technologies, features, timeline items and eight process steps appear in all five eras.
- Supplied source, demo, examples and Colab links are unchanged.
- Navigate with Tab and activate the era control with the keyboard.
- Check all five layouts at narrow mobile widths and with text enlargement.
- Run the production build with no TypeScript errors.

## Automated browser regression

After `npm install`, start the app in another terminal. With Playwright's Chromium installed (`npx playwright install chromium`), run `npm run test:e2e`. Alternatively set `PLAYWRIGHT_CHANNEL` to `msedge` or `chrome` to use an installed browser. The default server URL is http://127.0.0.1:5173; set `PORTFOLIO_URL` if Vite chooses another port.

The suite in `tests/regression.mjs` covers all twenty era directions and ten logical destinations at 320/390/768/1440 px, including immediate round trips and page-bottom clamping. It checks keyboard focus, mobile Tab order and widgets, overflow, pause persistence, reduced motion, touch guards, expandable details and the poll. See VERIFICATION.md for actual results and limits; this is not a full accessibility audit.

## Intentionally deferred

2020 renderer; cinematic video and playback; deployment. `IntroPlayer` returns null and is not mounted. GitHub, Telegram and email are now provided through the shared contact model.

The 2006 and 2013 editions use the same about, project and section anchors as the other eras. Their entry/case details use native disclosure controls. The 2013 device illustrations are decorative CSS graphics, not screenshots or claims about project interfaces. Both editions present current portfolio content; the era label is not a publication or employment date.

## Media and case updates — 25 September 2026

All five editions now render the same optional media through `ProjectMediaGallery` while retaining their own layouts and styling. Still images load lazily. Animated images require a separate still poster and an explicit start; the stop button returns to that poster. Videos require a poster and text description, load a native player on request, and never autoplay. Turning on reduced motion, hiding the browser tab or closing the enclosing project details returns moving media to its still preview. Explicit playback remains available when reduced motion is enabled. Missing media provides a link to the original. Empty media arrays render nothing.

No project screenshots or GIFs have been supplied for this iteration. Production content contains no synthetic media, placeholders or test fixtures. See `MEDIA.md` for integration instructions. Existing Drive destinations remain ordinary links.

AI Release Guardian now has a source-grounded overview, with its working-prototype-to-application status confirmed by the author. AIChatFlutter has the author's confirmed desktop/Android completion status, successful requests and balance feedback through a Telegram bot. Both distinguish the author's product work from code writing. The 2026 hero adds direct project and contact-section links. No CV or direct-contact destination was invented.

For media regression, start the Vite **dev** server and run `npm run test:media` (set `PORTFOLIO_URL` to its address; this suite defaults to port 5186 and installed Edge). The test injects synthetic assets only into its own intercepted module response. It verifies image/animation/video/external media, no automatic motion downloads, keyboard controls, changed motion preferences, real video playback, collapsed details and failure fallback in all five editions at 390 and 1440 px. Screenshots are test artifacts and are excluded from the release archive.

## Accessibility and publication preparation — 26 September 2026

The author confirmed Telegram and email; both now appear in all five editions. The website itself is the resume, so no separate CV is linked. Contact sections have independent, wrapping links, and the 2026 heading invites direct contact.

The focused accessibility pass improved low-contrast text in 2009/2013 and repaired reflow with doubled text at 320/390/768/1440 px. Skip navigation moves keyboard focus into main; Escape closes the mobile era chooser. Malformed hash fragments no longer crash rendering. An unknown path shows a recovery page.

`npm run test:accessibility` runs the focused checks against the dev server at PORTFOLIO_URL (default http://127.0.0.1:5186). It measures text contrast on solid backgrounds only, tests doubled font sizes, focus, contacts and malformed/unknown URLs, and saves accessibility-tree snapshots. Gradient contrast and actual screen-reader behavior are outside this automated check; this is not a full accessibility certification.

Publication assets include a 1200 × 630 social preview, touch/app icons, manifest and no-JavaScript contacts. `SITE_URL` optionally sets the final canonical URL, asset base and absolute preview URL at build time. `npm run test:deployment` checks production builds at both root and a subdirectory without publishing. See DEPLOYMENT.md for setup and LINK-CHECK.md for inconclusive external-link checks.

Next: integrate the author's MIS-Bot recordings and still previews and deepen project-specific technical decisions when supplied. Choose the public hosting address before publication. Actual screen-reader and cross-browser audits remain separate work. The 2020 edition, cinematic intro and AI Portfolio Review backend remain deferred.
