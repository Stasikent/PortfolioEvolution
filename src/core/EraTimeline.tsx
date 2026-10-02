import { useRef, useState } from "react";
import { implementedEras, useEra } from "./EraProvider";
export function EraTimeline() {
  const { era, setEra } = useEra();
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
      <span>Explore the web</span>
      <button
        ref={toggle}
        className="era-control-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="era-options"
        onClick={() => setOpen(value => !value)}
      >
        Eras: {era}
      </button>
      <div id="era-options" className="era-control-options" role="group" aria-label="Choose web era">
        {implementedEras.map((year) => (
          <button
            key={year}
            type="button"
            aria-pressed={era === year}
            onClick={() => chooseEra(year)}
          >
            {year}
          </button>
        ))}
      </div>
      <span className="sr-only" role="status">
        Viewing the {era} portfolio
      </span>
    </div>
  );
}
