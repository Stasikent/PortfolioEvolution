import { useMemo } from "react";
import { getProfile } from "../../content/profile";
import { contacts } from "../../content/contacts";
import { projects } from "../../content/projects";
import { skills, historicalSkills } from "../../content/skills";
import { getTimeline } from "../../content/timeline";
import { getBuildProcess } from "../../content/process";
import { useEra } from "../../core/EraProvider";
import { useTranslations } from "../../core/TranslationProvider";
import { ProjectStudy } from "./ProjectStudy";
import "./modern.css";

const sourceProfile = getProfile("en");
const sourceTimeline = getTimeline("en");
const sourceProcess = getBuildProcess("en");

export function ModernPortfolio() {
  const { setEra, language } = useEra();
  const ru = language === "ru";
  const profile = getProfile(ru ? "ru" : "en");
  const timeline = getTimeline(ru ? "ru" : "en");
  const buildProcess = getBuildProcess(ru ? "ru" : "en");
  const entries = useMemo(() => ({
    "2026.profile.name": sourceProfile.name,
    "2026.profile.roles": sourceProfile.roles,
    "2026.profile.value": sourceProfile.valueProposition,
    "2026.hero.before": sourceProfile.hero[0].text,
    "2026.hero.emphasis": sourceProfile.hero[1].text,
    "2026.profile.concept": sourceProfile.concept,
    "2026.profile.evolution": sourceProfile.evolution,
    "2026.profile.introduction": sourceProfile.introduction,
    "2026.nav.projects": "Projects", "2026.nav.story": "Story", "2026.nav.skills": "Skills", "2026.nav.process": "How I build",
    "2026.shortcuts.case": "case study", "2026.shortcuts.find": "Find me", "2026.hero.explore": "Explore the work", "2026.hero.trip": "Take a trip to 2002",
    "2026.hero.margin": "PROBLEM → CODE → PRODUCT", "2026.work.label": "Selected work", "2026.work.title1": "Software with", "2026.work.title2": "a reason to exist.",
    "2026.story.label": "The story", "2026.skills.label": "Toolkit", "2026.skills.title1": "Tools follow", "2026.skills.title2": "the problem.",
    "2026.skills.current": "Current technologies & areas", "2026.skills.earlier": "Earlier web experiments", "2026.process.label": "How I build",
    "2026.process.title1": "AI in the process.", "2026.process.title2": "Understanding at the core.", "2026.contact.label": "Find me", "2026.contact.title": "Let’s talk about the work.",
    "2026.footer.tagline": "One portfolio. Five different webs.", "2026.footer.top": "Back to top",
    ...Object.fromEntries(sourceTimeline.flatMap((item, i) => [[`2026.timeline.${i}.label`, item.label], [`2026.timeline.${i}.title`, item.title], [`2026.timeline.${i}.description`, item.description]])),
    ...Object.fromEntries(sourceProcess.map((step, i) => [`2026.process.${i}`, step])),
  }), []);
  const { t, status } = useTranslations(entries);
  const smart = !ru && language !== "en";
  const text = (key: string, en: string, ruText: string) => ru ? ruText : smart ? t(key, en) : en;

  return <div className="modern" data-translation-status={status}>
    <header className="modern-header">
      <a href="#home" className="wordmark" aria-label={`${smart ? t("2026.profile.name", profile.name) : profile.name}, ${text("2026.a11y.home", "home", "главная")}`}>sr<span> / </span></a>
      <nav aria-label={text("2026.a11y.nav", "Main navigation", "Основная навигация")}>
        <a href="#projects">{text("2026.nav.projects", "Projects", "Проекты")}</a><a href="#story">{text("2026.nav.story", "Story", "История")}</a><a href="#skills">{text("2026.nav.skills", "Skills", "Навыки")}</a><a href="#process">{text("2026.nav.process", "How I build", "Как я работаю")}</a>
      </nav><a className="header-github" href={profile.github} target="_blank" rel="noreferrer">GitHub ↗</a>
    </header>
    <main id="main" tabIndex={-1}>
      <section className="hero" id="home" data-position>
        <div className="eyebrow">{smart ? t("2026.profile.name", profile.name) : profile.name}</div><p className="hero-role">{smart ? t("2026.profile.roles", profile.roles) : profile.roles}</p>
        <h1>{smart ? <>{t("2026.hero.before", sourceProfile.hero[0].text)}<em>{t("2026.hero.emphasis", sourceProfile.hero[1].text)}</em></> : profile.hero.map((part, i) => part.emphasis ? <em key={i}>{part.text}</em> : part.text)}</h1>
        <p className="hero-value">{smart ? t("2026.profile.value", profile.valueProposition) : profile.valueProposition}</p>
        <nav className="career-shortcuts" aria-label={text("2026.a11y.shortcuts", "Portfolio shortcuts", "Быстрые ссылки портфолио")}><a href="#mis-bot">MIS-Bot {text("2026.shortcuts.case", "case study", "— кейс")} <span aria-hidden="true">↘</span></a><a href="#release-guardian">AI Release Guardian</a><a href="#aichatflutter">AIChatFlutter</a><a href="#contact">{text("2026.shortcuts.find", "Find me", "Контакты")}</a></nav>
        <div className="hero-bottom"><a className="primary-link" href="#projects">{text("2026.hero.explore", "Explore the work", "Смотреть проекты")} <span aria-hidden="true">↓</span></a><p><span className="concept-signature">{smart ? t("2026.profile.concept", profile.concept) : profile.concept}</span><br /><span className="evolution-explainer">{smart ? t("2026.profile.evolution", profile.evolution) : profile.evolution}</span><br /><button className="text-button" onClick={() => setEra(2002)}>{text("2026.hero.trip", "Take a trip to 2002", "Перенестись в 2002")} <span aria-hidden="true">↗</span></button></p></div>
        <span className="hero-margin" aria-hidden="true">{text("2026.hero.margin", "PROBLEM → CODE → PRODUCT", "ПРОБЛЕМА → КОД → ПРОДУКТ")}</span>
      </section>
      <section className="work-section" id="projects" data-position><div className="section-heading"><span className="eyebrow">01 / {text("2026.work.label", "Selected work", "Избранные проекты")}</span><h2>{text("2026.work.title1", "Software with", "Софт, у которого")}<br />{text("2026.work.title2", "a reason to exist.", "есть причина существовать.")}</h2></div>{projects.map((project, index) => <ProjectStudy key={project.id} project={project} index={index} />)}</section>
      <section className="story-section" id="story" data-position><div><span className="eyebrow">02 / {text("2026.story.label", "The story", "История")}</span><h2>{smart ? t("2026.profile.concept", profile.concept) : profile.concept}</h2><p className="story-intro" id="about" data-position>{smart ? t("2026.profile.introduction", profile.introduction) : profile.introduction}</p></div><div className="story-timeline">{timeline.map((item, i) => <article key={i}><span className="eyebrow">{smart ? t(`2026.timeline.${i}.label`, item.label) : item.label}</span><h3>{smart ? t(`2026.timeline.${i}.title`, item.title) : item.title}</h3><p>{smart ? t(`2026.timeline.${i}.description`, item.description) : item.description}</p></article>)}</div></section>
      <section className="skills-section" id="skills" data-position><div><span className="eyebrow">03 / {text("2026.skills.label", "Toolkit", "Инструменты")}</span><h2>{text("2026.skills.title1", "Tools follow", "Инструменты следуют")}<br />{text("2026.skills.title2", "the problem.", "за задачей.")}</h2></div><div><h3>{text("2026.skills.current", "Current technologies & areas", "Текущие технологии и направления")}</h3><ul className="skill-grid">{skills.map(skill => <li key={skill}>{skill}</li>)}</ul><p className="historical-skills"><strong>{text("2026.skills.earlier", "Earlier web experiments", "Ранние веб-эксперименты")}</strong><br />{historicalSkills.join(" · ")}</p></div></section>
      <section className="process-section" id="process" data-position><span className="eyebrow">04 / {text("2026.process.label", "How I build", "Как я работаю")}</span><h2>{text("2026.process.title1", "AI in the process.", "AI — в процессе.")}<br />{text("2026.process.title2", "Understanding at the core.", "Понимание — в основе.")}</h2><ol className="process-grid">{buildProcess.map((step, i) => <li className={i === 4 ? "read-code" : ""} key={i}><span>0{i + 1}</span><strong>{smart ? t(`2026.process.${i}`, step) : step}</strong><span aria-hidden="true">↘</span></li>)}</ol></section>
      <section className="contact-section" id="contact" data-position><span className="eyebrow">05 / {text("2026.contact.label", "Find me", "Контакты")}</span><h2>{text("2026.contact.title", "Let’s talk about the work.", "Обсудим работу.")}</h2>{contacts.map(contact => <a key={contact.id} href={contact.url} target="_blank" rel="noreferrer">{contact.display} <span aria-hidden="true">↗</span></a>)}</section>
    </main>
    <footer className="modern-footer"><span>{smart ? t("2026.profile.name", profile.name) : profile.name}</span><span>{text("2026.footer.tagline", "One portfolio. Five different webs.", "Одно портфолио. Пять разных вебов.")}</span><a href="#home">{text("2026.footer.top", "Back to top", "Наверх")} ↑</a></footer>
  </div>;
}
