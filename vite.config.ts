import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { contacts } from "./src/content/contacts";
export default defineConfig(({ mode }) => {
  const { SITE_URL } = loadEnv(mode, ".", "");
  const site = SITE_URL ? new URL(SITE_URL) : null;
  if (site && (site.protocol !== "https:" || site.username || site.password || site.search || site.hash)) {
    throw new Error("SITE_URL must be a public HTTPS URL without credentials, query or fragment.");
  }
  if (site && !site.pathname.endsWith("/")) site.pathname += "/";
  const base = site?.pathname || "/";
  return {
    base,
    plugins: [react(), {
      name: "portfolio-public-metadata",
      transformIndexHtml() {
        const preview = site ? new URL("social-preview.png", site).href : `${base}social-preview.png`;
        return [
          { tag: "noscript", injectTo: "body-prepend" as const, children: [
            { tag: "p", children: "This interactive portfolio requires JavaScript. You can still reach me here:" },
            ...contacts.map(contact => ({ tag: "p", children: [
              { tag: "a", attrs: { href: contact.url }, children: `${contact.label}: ${contact.display}` },
            ] })),
          ] },
          { tag: "meta", attrs: { property: "og:image", content: preview } },
          { tag: "meta", attrs: { name: "twitter:image", content: preview } },
          ...(site ? [
            { tag: "link", attrs: { rel: "canonical", href: site.href } },
            { tag: "meta", attrs: { property: "og:url", content: site.href } },
          ] : []),
        ];
      },
    }],
  };
});
