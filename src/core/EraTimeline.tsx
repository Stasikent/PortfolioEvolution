import { useRef, useState } from "react";
import { implementedEras, useEra } from "./EraProvider";
export function EraTimeline() {
  const { era, setEra, language, setLanguage } = useEra();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);

  function chooseEra(year: (typeof implementedEras)[number]) {
    setEra(year);
    if (window.matchMedia("(max-width: 580px)").matches) {
      setOpen(false);
      toggle.current?.focus({ preventScroll: true });
    }
  }

  return (
    <div className={`era-control control-${era} ${open ? "era-control-open" : ""}`}
      onKeyDown={event => {
        if (event.key === "Escape" && open) { setOpen(false); toggle.current?.focus(); }
      }}>
      <span>{language === "ru" ? "Эволюция веба" : "Explore the web"}</span>
      <button ref={toggle} className="era-control-toggle" type="button" aria-expanded={open} aria-controls="era-options" onClick={() => setOpen(value => !value)}>
        {language === "ru" ? "Эпоха" : "Era"}: {era}
      </button>
      <div id="era-options" className="era-control-options" role="group" aria-label={language === "ru" ? "Выбрать эпоху веба" : "Choose web era"}>
        {implementedEras.map((year) => <button key={year} type="button" aria-pressed={era === year} onClick={() => chooseEra(year)}>{year}</button>)}
      </div>
      <div className="language-control" role="group" aria-label={language === "ru" ? "Язык" : "Language"}>
        <button type="button" aria-pressed={language === "ru"} onClick={() => setLanguage("ru")}>RU</button>
        <button type="button" aria-pressed={language === "en"} onClick={() => setLanguage("en")}>EN</button>
      </div>
      <span className="sr-only" role="status">{language === "ru" ? `Версия портфолио ${era}` : `Viewing the ${era} portfolio`}</span>
    </div>
  );
}
