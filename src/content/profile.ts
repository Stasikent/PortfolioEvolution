import { contacts } from "./contacts";
import type { Language } from "../core/EraProvider";

type ProfileCopy = {
  name: string;
  roles: string;
  valueProposition: string;
  hero: readonly { text: string; emphasis?: boolean }[];
  message: string;
  concept: string;
  evolution: string;
  introduction: string;
};

const enHero = [
  { text: "I turn real problems into " },
  { text: "working software.", emphasis: true },
] as const;
const ruHero = [
  { text: "Превращаю реальные проблемы в " },
  { text: "работающий софт.", emphasis: true },
] as const;

const copies: Record<Language, ProfileCopy> = {
  en: {
    name: "Stanislav Romanovich",
    roles: "AI-assisted Developer · Product Builder",
    valueProposition: "Python automation, AI-assisted product development and React/TypeScript — applied to real workflows, not abstract demos.",
    hero: enHero,
    message: enHero.map((part) => part.text).join(""),
    concept: "From tables to transformers.",
    evolution: "One portfolio data model, interpreted as five independent websites with the structure and interaction patterns of their eras.",
    introduction: "My path connects early web experiments, medicine and radiology, and a return to technology. Today, I build software with AI, grounded in real problems.",
  },
  ru: {
    name: "Станислав Романович",
    roles: "AI-разработчик · Product Builder",
    valueProposition: "Автоматизация на Python, разработка продуктов с AI и React/TypeScript — для реальных рабочих процессов, а не абстрактных демо.",
    hero: ruHero,
    message: ruHero.map((part) => part.text).join(""),
    concept: "От таблиц к трансформерам.",
    evolution: "Одна модель данных портфолио, представленная как пять самостоятельных сайтов со структурой и паттернами взаимодействия своих эпох.",
    introduction: "Мой путь соединяет ранние эксперименты с вебом, медицину и рентгенологию и возвращение в технологии. Сейчас я создаю программные продукты с AI, отталкиваясь от реальных задач.",
  },
};

export function getProfile(language: Language) {
  return { ...copies[language], github: contacts[0].url };
}

// English remains the canonical export for non-UI consumers and tests.
export const profile = getProfile("en");
