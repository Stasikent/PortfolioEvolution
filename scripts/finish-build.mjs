import { copyFile } from "node:fs/promises";
// Static hosts can serve this document with HTTP 404. The app displays its
// recovery page for unknown paths and links to the configured deployment base.
await copyFile("dist/index.html", "dist/404.html");
