export type TranslationMap = Record<string, string>;

type LocalTranslation = { source: string; text: string };
type LocalTranslationMap = Record<string, LocalTranslation>;

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

const memoryCache = new Map<string, LocalTranslationMap>();

function storageKey(language: string) {
  return `portfolio-translations:v2:${language}`;
}

function readLocalCache(language: string): LocalTranslationMap {
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

export function readTranslationCache(language: string): TranslationMap {
  return Object.fromEntries(Object.entries(readLocalCache(language)).map(([key, item]) => [key, item.text]));
}

function writeLocalCache(language: string, cache: LocalTranslationMap) {
  memoryCache.set(language, cache);
  if (typeof window !== "undefined") window.localStorage.setItem(storageKey(language), JSON.stringify(cache));
}

export async function translateEntries(request: TranslationRequest): Promise<TranslationResponse> {
  if (request.language === request.sourceLanguage) {
    return { language: request.language, translations: request.entries, cached: Object.keys(request.entries), generated: [] };
  }

  const local = readLocalCache(request.language);
  const validLocal: TranslationMap = {};
  const missing: Record<string, string> = {};
  for (const [key, source] of Object.entries(request.entries)) {
    const item = local[key];
    if (item?.source === source && typeof item.text === "string") validLocal[key] = item.text;
    else missing[key] = source;
  }
  if (!Object.keys(missing).length) {
    return { language: request.language, translations: validLocal, cached: Object.keys(request.entries), generated: [] };
  }

  const response = await fetch("/api/translations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...request, entries: missing }),
  });
  if (!response.ok) throw new Error(`Translation request failed: ${response.status}`);
  const result = await response.json() as TranslationResponse;
  const nextLocal = { ...local };
  for (const [key, text] of Object.entries(result.translations)) nextLocal[key] = { source: request.entries[key], text };
  writeLocalCache(request.language, nextLocal);
  return { ...result, translations: { ...validLocal, ...result.translations } };
}
