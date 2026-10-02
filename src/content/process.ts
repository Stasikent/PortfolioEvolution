import type { Language } from "../core/EraProvider";

const processEn = ["Problem", "Understand", "Decompose", "Build with AI", "Read the code", "Test", "Debug", "Ship"] as const;
const processRu = ["Проблема", "Разобраться", "Декомпозировать", "Создать с AI", "Прочитать код", "Протестировать", "Отладить", "Выпустить"] as const;

export function getBuildProcess(language: Language) {
  return language === "ru" ? processRu : processEn;
}

export const buildProcess = processEn;
