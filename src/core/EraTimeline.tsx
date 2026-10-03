import { useRef, useState } from "react";
import { implementedEras, useEra } from "./EraProvider";

const languages = [
  { code: "ru", label: "RU", name: "Русский" },
  { code: "en", label: "EN", name: "English" },
  { code: "de", label: "DE", name: "Deutsch" },
  { code: "fr", label: "FR", name: "Français" },
  { code: "es", label: "ES", name: "Español" },
  { code: "zh", label: "中文", name: "中文" },
  { code: "ja", label: "日本語", name: "日本語" },
] as const;

export function EraTimeline() {
  const { era, setEra, language, setLanguage } = useEra();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const ru = language === "ru";
  const currentLanguage = languages.find(item => item.code === language);

  function chooseEra(year: (typeof implementedEras)[number]) {
    setEra(year);
    if (window.matchMedia("(max-width: 580px)").matches) {
      setOpen(false);
      toggle.current?.focus({ preventScroll: true });
    }
  }

  return <div className={`era-control control-${era} ${open ? "era-control-open" : ""}`} onKeyDown={event => {
    if (event.key === "Escape" && open) {
      setOpen(false);
      toggle.current?.focus();
    }
  }}>
    <span>{ru ? "Эволюция веба" : "Explore the web"}</span>
    <button ref={toggle} className="era-control-toggle" type="button" aria-expanded={open} aria-controls="era-options" onClick={() => setOpen(value => !value)}>
      {ru ? "Эпоха" : "Era"}: {era}
    </button>
    <div id="era-options" className="era-control-options" role="group" aria-label={ru ? "Выбрать эпоху веба" : "Choose web era"}>
      {implementedEras.map(year => <button key={year} type="button" aria-pressed={era === year} onClick={() => chooseEra(year)}>{year}</button>)}
    </div>
    <label className="language-control" aria-label={ru ? "Язык" : "Language"}>
      <span aria-hidden="true">🌐</span>
      <select value={language} onChange={event => setLanguage(event.target.value)} aria-label={ru ? "Выбрать язык" : "Choose language"}>
        {!currentLanguage && <option value={language}>{language.toUpperCase()}</option>}
        {languages.map(item => <option key={item.code} value={item.code}>{item.label} · {item.name}</option>)}
      </select>
    </label>
    <span className="sr-only" role="status">{ru ? `Версия портфолио ${era}` : `Viewing the ${era} portfolio`}</span>
  </div>;
}
