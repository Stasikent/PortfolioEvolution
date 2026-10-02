This website must NEVER degrade into a generic portfolio template.

Historical eras are not skins.

Each era represents the information architecture, layout,
interaction patterns, typography and visual conventions of its period.

All eras use the same underlying portfolio data.

Never duplicate portfolio content inside era components.

Do not invent personal facts, project metrics, technologies,
employment history or project results.

The 2026 version must remain professional enough to send directly
to an employer.

## Engineering

- Keep factual content in `src/content`; presentation belongs in `src/eras`.
- Implemented eras are 2002, 2006, 2009, 2013 and 2026. The user requested the 2006 and 2013 expansion. The 2020 era and cinematic intro still require a separate request.
- Keep keyboard access, visible focus, responsive layouts and reduced-motion support.
- Run `npm run build` after code changes and verify all five eras at desktop and mobile widths.
- Keep 2009 widget fixtures separate from factual portfolio data. No actual music, chat backend, analytics or global voting statistics.
- Motion effects must respect reduced motion, have a pause control, and never intercept pointer events. Cursor trails require a fine pointer with hover.
- Supplied external URLs must remain intact. Do not substitute invented contact details.
