# Adding verified project media

The gallery is already connected in all five editions. Add actual files under `public/media/<project-id>/` and declare each item once in `src/content/projects.ts` on the matching project's `media` array. Nothing appears when the array is absent or empty.

- `image`: a **still** screenshot or photograph; requires `src` and meaningful `alt`. Prefer `width` and `height` to reserve space. GIF/animated WebP must use `animation` instead.
- `animation`: GIF/animated WebP with `src`, `alt`, and a separate **non-animated** `poster` (PNG/JPEG/still WebP). Optional dimensions and caption. The animation is not downloaded until the visitor starts it. Show still preview unloads it; restarting begins again.
- `video`: `src`, a still `poster`, `alt`, and `transcript` (a meaningful text account of the demonstration). Optional WebVTT `captions: { src, language, label }` for spoken content. A button loads the native player; the visitor controls playback. There is no autoplay or loop.
- `external`: a descriptive `alt` and a verified external `src`. Rendered as a link, never an iframe or downloaded copy. Existing Drive links can remain in `links`.

All variants accept a short `caption`. Use paths such as `/media/mis-bot/workflow.webm` only once that file actually exists. Do not treat remote Drive viewing URLs as embeddable video sources.

The component preserves each edition's typography and gives media the available content width. 2006, 2009 and 2013 place media in their native expandable case notes; closing those notes stops moving media. 2002 and 2026 show the gallery within the project itself. Each edition starts with still previews. Switching eras unloads the previous player.

Reduced motion suppresses automatic motion: all users begin with a still preview, and enabling the preference during playback stops it. Visitors can deliberately start playback with the controls even under reduced motion. Hidden tabs stop moving media. A video can use its native pause control; an animated image stops by returning to its poster.

For the pending MIS-Bot assets, supply one concise recording per scenario and one still preview per recording, with a short explanation of what it shows. Include only material suitable for a public portfolio. No test assets should be copied from `tests/media.mjs` into the content model.
