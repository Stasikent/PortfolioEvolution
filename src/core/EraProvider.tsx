import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { readPosition, targetFor, type LogicalPosition } from "./logicalPosition";
export type Era = 2002 | 2006 | 2009 | 2013 | 2020 | 2026;
export const implementedEras = [2002, 2006, 2009, 2013, 2026] as const satisfies readonly Era[];
export type ImplementedEra = (typeof implementedEras)[number];
export type Language = string;
type EraState = { era: ImplementedEra; setEra: (era: ImplementedEra) => void; effectsEnabled: boolean; setEffectsEnabled: (enabled: boolean) => void; language: Language; setLanguage: (language: Language) => void; };
const EraContext = createContext<EraState | null>(null);
function eraFromUrl(): ImplementedEra { if (typeof window === "undefined") return 2026; const value = Number(new URLSearchParams(window.location.search).get("era")); return implementedEras.includes(value as ImplementedEra) ? value as ImplementedEra : 2026; }
function normalizeLanguage(value: string | null | undefined) { const language = value?.trim().toLowerCase(); return language && /^[a-z]{2,3}(?:-[a-z0-9]{2,8})*$/.test(language) ? language : null; }
function languageFromStorage(): Language { if (typeof window === "undefined") return "ru"; return normalizeLanguage(new URLSearchParams(window.location.search).get("lang")) ?? normalizeLanguage(window.localStorage.getItem("portfolio-language")) ?? "ru"; }
export function EraProvider({ children }: { children: ReactNode }) {
  const [era, updateEra] = useState<ImplementedEra>(eraFromUrl); const [effectsEnabled, setEffectsEnabled] = useState(true); const [language, updateLanguage] = useState<Language>(languageFromStorage);
  const pendingPosition = useRef<LogicalPosition | null>(null); const restored = useRef<{ position: LogicalPosition; scrollY: number } | null>(null); const initialHashHandled = useRef(false);
  useEffect(() => { document.documentElement.lang = language; window.localStorage.setItem("portfolio-language", language); }, [language]);
  function setLanguage(next: Language) { const normalized = normalizeLanguage(next); if (!normalized || normalized === language) return; updateLanguage(normalized); const url = new URL(window.location.href); url.searchParams.set("lang", normalized); window.history.replaceState(null, "", url); }
  useEffect(() => { const clearPosition = () => { restored.current = null; }; const onClick = (event: MouseEvent) => { const link = event.target instanceof Element ? event.target.closest("a[href]") : null; if (link?.getAttribute("href")?.startsWith("#")) clearPosition(); }; document.addEventListener("click", onClick); window.addEventListener("hashchange", clearPosition); return () => { document.removeEventListener("click", onClick); window.removeEventListener("hashchange", clearPosition); }; }, []);
  useEffect(() => { const onPopState = () => { const next = eraFromUrl(); if (next === era) return; pendingPosition.current = readPosition(era); updateEra(next); }; window.addEventListener("popstate", onPopState); return () => window.removeEventListener("popstate", onPopState); }, [era]);
  useLayoutEffect(() => { const position = pendingPosition.current; if (!position) { if (!initialHashHandled.current) { initialHashHandled.current = true; let id = window.location.hash.slice(1); try { id = decodeURIComponent(id); } catch { id = ""; } if (id) document.getElementById(id)?.scrollIntoView({ block: "start", behavior: "instant" }); } return; } pendingPosition.current = null; const target = targetFor(era, position); if (target) target.scrollIntoView({ block: "start", behavior: "instant" }); else window.scrollTo({ top: 0, behavior: "instant" }); restored.current = { position, scrollY: window.scrollY }; }, [era]);
  function setEra(next: ImplementedEra) { if (next === era) return; const previous = restored.current; pendingPosition.current = previous && Math.abs(previous.scrollY - window.scrollY) < 2 ? previous.position : readPosition(era); const url = new URL(window.location.href); url.searchParams.set("era", String(next)); window.history.pushState(null, "", url); updateEra(next); }
  return <EraContext.Provider value={{ era, setEra, effectsEnabled, setEffectsEnabled, language, setLanguage }}>{children}</EraContext.Provider>;
}
export function useEra() { const value = useContext(EraContext); if (!value) throw new Error("useEra requires EraProvider"); return value; }
