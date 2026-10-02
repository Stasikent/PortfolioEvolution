import React from "react";
import ReactDOM from "react-dom/client";
import { PortfolioAssistant } from "./components/PortfolioAssistant";
import { EraProvider } from "./core/EraProvider";
import { EraRouter } from "./core/EraRouter";
import { EraTimeline } from "./core/EraTimeline";
import { NotFound } from "./core/NotFound";
import "./styles.css";
import "./effects/motion.css";
const base = import.meta.env.BASE_URL;
const knownPage = [base, `${base}index.html`].includes(window.location.pathname);
if (!knownPage) {
  document.title = "Page not found — Stanislav Romanovich";
  const robots = document.createElement("meta");
  robots.name = "robots"; robots.content = "noindex"; document.head.appendChild(robots);
}
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {knownPage ? <EraProvider>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <EraTimeline />
      <EraRouter />
      <PortfolioAssistant />
    </EraProvider> : <NotFound />}
  </React.StrictMode>,
);
