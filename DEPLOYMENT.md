# Publication preparation — 26 September 2026

The site is a static React/Vite portfolio. The site itself serves as the author's resume; there is no separate CV download. Contact destinations confirmed by the author are GitHub, Telegram @stasikent and stasikent@gmail.com. Publication has not been performed.

## Build

Install dependencies with `npm ci`, then run `npm run build`. Publish the **contents of dist/** to a static host. `npm run preview` serves the build locally for inspection. On the original Windows machine, the intact npm CLI command is documented in README.

For a chosen public URL, set the optional build variable `SITE_URL` to the complete HTTPS address, including a subdirectory if needed. Example in PowerShell:

```powershell
$env:SITE_URL = 'https://your-domain.example/portfolio/'
npm run build
```

This example is documentation, not a deployed destination. Replace it before use. The setting controls Vite's asset base, the canonical URL and absolute social-image URLs. Omit SITE_URL for a root-hosted local build; no canonical URL is invented. The default build includes relative social-image metadata, but a final public build should use the real SITE_URL so external preview crawlers receive an absolute image URL. Rebuild if the hosting path changes.

The archive contains a default root build. For a subdirectory deployment, regenerate it with SITE_URL. Do not open dist/index.html with file://; use an HTTP server.

## Navigation and unknown addresses

The site uses `?era=2009#mis-bot`, not a route per era. Serve `/` (or the configured base) and `/index.html` normally. Configure the host to serve `404.html` **with HTTP 404** for unknown paths, retaining the requested URL. The app shows a recovery page with a link to the correct base and adds noindex. Do not apply a blanket HTTP-200 rewrite to every path if correct 404 responses matter. The generated 404 file is a copy of the built HTML shell; host support must be checked when a provider is selected.

## Included public assets

- `social-preview.png`: 1200 × 630 preview, with editable SVG source.
- SVG favicon, PNG icons at 192 and 512 px, and 180 px Apple touch icon.
- `site.webmanifest` with relative start URL and icon paths, display set to browser.
- Basic no-JavaScript contact fallback.

No service worker, offline behavior, analytics, backend or credentials are added.

## Verified locally

`npm run test:deployment` builds into `.verification/` and checks both root hosting and a `/folio/` subdirectory on local temporary HTTP servers. It verifies all five eras, loaded assets, preview dimensions, canonical metadata, a 404 response and recovery navigation. It does not publish anything or use the example domain over the network.

Before actual publication, choose a hosting address, rebuild with that URL and verify the host's 404 behavior. External Drive access remains to be checked as described in LINK-CHECK.md. Recordings are optional for the current site but still pending for the richer MIS-Bot case.
