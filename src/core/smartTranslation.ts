export type TranslationMap = Record<string, string>;

export type TranslationRequest = {
  language: string;
  sourceLanguage: string;
  entries: Record<string, string>;
};

export type TranslationResponse = {
  language: string;
  translations: TranslationMap;
  cached: string[];
  generated: string[];
};

const memoryCache = new Map<string, TranslationMap>();

function storageKey(language: string) {
  return `portfolio-translations:${language}`;
}

export function readTranslationCache(language: string): TranslationMap {
  const inMemory = memoryCache.get(language);
  if (inMemory) return inMemory;
  if (typeof window === "undefined") return {};
  try {
    const parsed = JSON.parse(window.localStorage.getItem(storageKey(language)) || "{}");
    if (parsed && typeof parsed === "object") {
      memoryCache.set(language, parsed);
      return parsed;
    }
  } catch {
    // Corrupt browser cache should never block the portfolio.
  }
  return {};
}

function writeTranslationCache(language: string, translations: TranslationMap) {
  memoryCache.set(language, translations);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(storageKey(language), JSON.stringify(translations));
  }
}

export async function translateEntries(request: TranslationRequest): Promise<TranslationResponse> {
  if (request.language === request.sourceLanguage) {
    return { language: request.language, translations: request.entries, cached: Object.keys(request.entries), generated: [] };
  }

  const local = readTranslationCache(request.language);
  const missing = Object.fromEntries(Object.entries(request.entries).filter(([key]) => !local[key]));
  if (!Object.keys(missing).length) {
    return { language: request.language, translations: local, cached: Object.keys(request.entries), generated: [] };
  }

  const response = await fetch("/api/translations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...request, entries: missing }),
  });
  if (!response.ok) throw new Error(`Translation request failed: ${response.status}`);
  const result = await response.json() as TranslationResponse;
  const merged = { ...local, ...result.translations };
  writeTranslationCache(request.language, merged);
  return { ...result, translations: merged };
}
