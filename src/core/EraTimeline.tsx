import { useRef, useState } from "react";
import { implementedEras, useEra } from "./EraProvider";
const languages = [{ code: "ru", label: "RU" }, { code: "en", label: "EN" }, { code: "de", label: "DE" }, { code: "fr", label: "FR" }, { code: "es", label: "ES" }, { code: "zh", label: "中文" }, { code: "ja", label: "日本語" }] as const;
export function EraTimeline() {
  const { era, setEra, language, setLanguage } = useEra(); const [open, setOpen] = useState(false); const toggle = useRef<HTMLButtonElement>(null);
  function chooseEra(year: (typeof implementedEras)[number]) { setEra(year); if (window.matchMedia("(max-width: 580px)").matches) { setOpen(false); toggle.current?.focus({ preventScroll: true }); } }
  const ru = language === "ru";
  return <div className={`era-control control-${era} ${open ? "era-control-open" : ""}`} onKeyDown={event => { if (event.key === "Escape" && open) { setOpen(false); toggle.current?.focus(); } }}>
    <span>{ru ? "Эволюция веба" : "Explore the web"}</span>
    <button ref={toggle} className="era-control-toggle" type="button" aria-expanded={open} aria-controls="era-options" onClick={() => setOpen(value => !value)}>{ru ? "Эпоха" : "Era"}: {era}</button>
    <div id="era-options" className="era-control-options" role="group" aria-label={ru ? "Выбрать эпоху веба" : "Choose web era"}>{implementedEras.map(year => <button key={year} type="button" aria-pressed={era === year} onClick={() => chooseEra(year)}>{year}</button>)}</div>
    <div className="language-control" role="group" aria-label={ru ? "Язык" : "Language"}>{languages.map(item => <button key={item.code} type="button" aria-pressed={language === item.code} onClick={() => setLanguage(item.code)}>{item.label}</button>)}</div>
    <span className="sr-only" role="status">{ru ? `Версия портфолио ${era}` : `Viewing the ${era} portfolio`}</span>
  </div>;
}
