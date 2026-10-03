import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { translateEntries, type TranslationMap } from "./smartTranslation";
import { useEra } from "./EraProvider";

export type TranslationStatus = "idle" | "loading" | "ready" | "error";

type TranslationState = {
  status: TranslationStatus;
  translations: TranslationMap;
  register: (entries: Record<string, string>) => void;
  t: (key: string, fallback: string) => string;
};

const TranslationContext = createContext<TranslationState | null>(null);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const { language } = useEra();
  const [registry, setRegistry] = useState<Record<string, string>>({});
  const [translations, setTranslations] = useState<TranslationMap>({});
  const [status, setStatus] = useState<TranslationStatus>("idle");

  const register = useCallback((entries: Record<string, string>) => {
    setRegistry(current => {
      let changed = false;
      const next = { ...current };
      for (const [key, value] of Object.entries(entries)) {
        if (next[key] !== value) { next[key] = value; changed = true; }
      }
      return changed ? next : current;
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!Object.keys(registry).length) return;
    if (language === "en") {
      setTranslations(registry);
      setStatus("ready");
      return;
    }
    setStatus("loading");
    translateEntries({ language, sourceLanguage: "en", entries: registry })
      .then(result => {
        if (cancelled) return;
        setTranslations(result.translations);
        setStatus("ready");
      })
      .catch(() => {
        if (cancelled) return;
        setTranslations({});
        setStatus("error");
      });
    return () => { cancelled = true; };
  }, [language, registry]);

  const value = useMemo<TranslationState>(() => ({
    status,
    translations,
    register,
    t: (key, fallback) => language === "en" ? fallback : translations[key] ?? fallback,
  }), [language, register, status, translations]);

  return <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>;
}

export function useTranslations(entries?: Record<string, string>) {
  const value = useContext(TranslationContext);
  if (!value) throw new Error("useTranslations requires TranslationProvider");
  useEffect(() => { if (entries) value.register(entries); }, [entries, value.register]);
  return value;
}
