import type { Language } from "../core/EraProvider";

const timelineEn = [
  {
    label: "Around 2009",
    title: "I started building for the web around 2009.",
    description: "I explored HTML, CSS and PHP, experimenting with uCoz, DLE, WordPress and Bitrix. These were early web experiments, not the beginning of continuous professional software development experience.",
  },
  {
    label: "Medicine",
    title: "Then my path changed. Medicine. Radiology.",
    description: "My professional path moved into medicine and radiology. But I never stopped solving problems. Repetitive operations in a medical information system later became the starting point for MIS-Bot.",
  },
  {
    label: "Return to technology",
    title: "A return to technology, with a different perspective.",
    description: "I returned to technology and completed education and retraining in software testing and ML Engineering. Today, I work with Python, APIs, automation and AI-assisted development to turn real problems into working tools.",
  },
] as const;

const timelineRu = [
  {
    label: "Около 2009",
    title: "Примерно в 2009 году я начал делать сайты.",
    description: "Изучал HTML, CSS и PHP, экспериментировал с uCoz, DLE, WordPress и Bitrix. Это были ранние веб-эксперименты, а не начало непрерывного профессионального опыта в разработке.",
  },
  {
    label: "Медицина",
    title: "Затем путь изменился: медицина и рентгенология.",
    description: "Профессиональная деятельность ушла в медицину и рентгенологию, но работа с задачами и процессами осталась. Повторяющиеся операции в медицинской информационной системе позже стали отправной точкой для MIS-Bot.",
  },
  {
    label: "Возвращение в технологии",
    title: "Возвращение в технологии — уже с другим опытом.",
    description: "Я вернулся в технологии, прошёл обучение по тестированию ПО и переподготовку по ML Engineering. Сейчас работаю с Python, API, автоматизацией и AI-assisted разработкой, превращая реальные задачи в работающие инструменты.",
  },
] as const;

export function getTimeline(language: Language) {
  return language === "ru" ? timelineRu : timelineEn;
}

export const timeline = timelineEn;
