import { useMemo } from "react";
import { useEra } from "../../core/EraProvider";
import { getProfile } from "../../content/profile";
import { contacts } from "../../content/contacts";
import { projects } from "../../content/projects";
import { skills, historicalSkills } from "../../content/skills";
import { getTimeline } from "../../content/timeline";
import { getBuildProcess } from "../../content/process";
import { RetroEffects } from "../../effects/RetroEffects";
import { useTranslations } from "../../core/TranslationProvider";
import { Module } from "./Module";
import { ProjectEntry } from "./ProjectEntry";
import { CalendarWidget } from "./CalendarWidget";
import { MiniChat, LocalPoll, MusicWidget, SiteStatistics } from "./NostalgiaWidgets";
import "./catalog.css";

const navigation = [{ id: "home", key: "home", fallback: "Home" }, { id: "about", key: "about", fallback: "About me" }, { id: "projects", key: "projects", fallback: "File catalog" }, { id: "story", key: "story", fallback: "Story" }, { id: "skills", key: "skills", fallback: "Technologies" }, { id: "contact", key: "contact", fallback: "Contacts" }];

export function CatalogPortfolio() {
  const { effectsEnabled, setEffectsEnabled } = useEra();
  const profile = getProfile("en"); const timeline = getTimeline("en"); const buildProcess = getBuildProcess("en");
  const entries = useMemo(() => {
    const e: Record<string, string> = {
      "2009.utility": "Personal site / Development / Programs", "2009.effects": "Effects", "2009.on": "on", "2009.off": "off", "2009.welcome": "Welcome!", "2009.projectsCount": "Projects", "2009.about": "About me", "2009.pinned": "PINNED", "2009.readStory": "Read the author's story", "2009.catalog": "File catalog", "2009.total": "Total projects", "2009.storyTitle": "Author's story", "2009.techInterests": "Technologies & interests", "2009.current": "Current technologies & areas", "2009.earlier": "Earlier web experiments", "2009.build": "How I build", "2009.contacts": "Contacts", "2009.siteMenu": "Site menu", "2009.author": "Site author", "2009.techCloud": "Technology cloud", "2009.note": "Note", "2009.noteText": "2009 is the visual style, not the creation date of the projects. The portfolio content remains current.", "2009.personal": "Personal web site", "2009.footer": "You are viewing the 2009 version. Welcome to the web we remember.", "2009.top": "Back to top", "2009.mainNav": "Main navigation", "2009.directory": "Site directory and profile", "2009.widgets": "Period widgets",
      "2009.profile.roles": profile.roles, "2009.profile.concept": profile.concept, "2009.profile.message": profile.message, "2009.profile.introduction": profile.introduction,
    };
    navigation.forEach(item => { e[`2009.nav.${item.key}`] = item.fallback; }); timeline.forEach((item, i) => { e[`2009.timeline.${i}.title`] = item.title; e[`2009.timeline.${i}.description`] = item.description; }); buildProcess.forEach((step, i) => { e[`2009.process.${i}`] = step; }); return e;
  }, [profile, timeline, buildProcess]);
  const { t } = useTranslations(entries);
  return <div className={`catalog-2009 ${effectsEnabled ? "" : "effects-paused"}`}><RetroEffects enabled={effectsEnabled} /><div className="catalog-shell">
    <header className="catalog-header" id="home" data-position><div className="catalog-utility"><span>{t("2009.utility", "Personal site / Development / Programs")}</span><button aria-pressed={effectsEnabled} onClick={() => setEffectsEnabled(!effectsEnabled)}>{t("2009.effects", "Effects")}: {effectsEnabled ? t("2009.on", "on") : t("2009.off", "off")}</button></div><div className="catalog-masthead"><div className="catalog-monogram" aria-hidden="true">SR<span>.WEB</span></div><div><p className="catalog-kicker">PERSONAL WEB SITE</p><h1>{profile.name}</h1><p>{t("2009.profile.roles", profile.roles)}</p></div><div className="catalog-edition" aria-hidden="true"><b>2009</b><span>WEB EDITION</span></div></div>
      <nav className="catalog-navigation" aria-label={t("2009.mainNav", "Main navigation")}>{navigation.map(item => <a key={item.id} href={`#${item.id}`}>{t(`2009.nav.${item.key}`, item.fallback)}</a>)}</nav><div className="catalog-ticker"><span>{t("2009.welcome", "Welcome!")}</span><p>{t("2009.profile.concept", profile.concept)}</p><a href="#projects">{t("2009.projectsCount", "Projects")}: {projects.length} »</a></div></header>
    <div className="catalog-columns"><main id="main" tabIndex={-1} className="catalog-main"><section className="catalog-introduction" id="about" data-position><h2><span aria-hidden="true">★</span> {t("2009.about", "About me")} <span className="pinned-label">{t("2009.pinned", "PINNED")}</span></h2><div><h3>{t("2009.profile.message", profile.message)}</h3><p>{t("2009.profile.introduction", profile.introduction)}</p><a href="#story">{t("2009.readStory", "Read the author's story")} »</a></div></section>
      <section id="projects" data-position><div className="catalog-section-title"><h2>{t("2009.catalog", "File catalog")}</h2><span>{t("2009.total", "Total projects")}: {projects.length}</span></div>{projects.map(project => <ProjectEntry key={project.id} project={project} />)}</section>
      <section id="story" data-position><Module title={t("2009.storyTitle", "Author's story")} icon="✎">{timeline.map((item, i) => <article className="catalog-story" key={item.label}><span>{item.label}</span><h3>{t(`2009.timeline.${i}.title`, item.title)}</h3><p>{t(`2009.timeline.${i}.description`, item.description)}</p></article>)}</Module></section>
      <section id="skills" data-position><Module title={t("2009.techInterests", "Technologies & interests")} icon="⚙"><h3>{t("2009.current", "Current technologies & areas")}</h3><ul className="catalog-skills">{skills.map(skill => <li key={skill}>{skill}</li>)}</ul><h3>{t("2009.earlier", "Earlier web experiments")}</h3><p>{historicalSkills.join(" · ")}</p></Module></section>
      <section id="process" data-position><Module title={t("2009.build", "How I build")} icon="▤"><ol className="catalog-process">{buildProcess.map((step, i) => <li key={step}>{i === 4 ? <strong>{t(`2009.process.${i}`, step)}</strong> : t(`2009.process.${i}`, step)}</li>)}</ol></Module></section><section id="contact" data-position><Module title={t("2009.contacts", "Contacts")} icon="@"><p>{profile.name} · {t("2009.profile.roles", profile.roles)}</p><ul className="catalog-contacts">{contacts.map(contact => <li key={contact.id}><a href={contact.url} target="_blank" rel="noreferrer">{contact.label} — {contact.display} ↗</a></li>)}</ul></Module></section></main>
      <aside className="catalog-left" aria-label={t("2009.directory", "Site directory and profile")}><Module title={t("2009.siteMenu", "Site menu")} icon="▣"><nav className="catalog-side-menu" aria-label={t("2009.directory", "Site directory")}>{navigation.slice(1).map(item => <a key={item.id} href={`#${item.id}`}><span aria-hidden="true">›</span>{t(`2009.nav.${item.key}`, item.fallback)}</a>)}<a href="#process"><span aria-hidden="true">›</span>{t("2009.build", "How I build")}</a></nav></Module><Module title={t("2009.author", "Site author")} icon="♙"><div className="mini-profile"><span className="profile-file-icon" aria-hidden="true">&lt;/&gt;</span><strong>{profile.name}</strong><p>{t("2009.profile.roles", profile.roles)}</p>{contacts.map(contact => <a href={contact.url} target="_blank" rel="noreferrer" key={contact.id}>{contact.label} ↗</a>)}</div></Module><CalendarWidget /><SiteStatistics /></aside>
      <aside className="catalog-right" aria-label={t("2009.widgets", "Period widgets")}><MusicWidget /><MiniChat /><LocalPoll /><Module title={t("2009.techCloud", "Technology cloud")} icon="#"><div className="catalog-tag-cloud">{skills.map(skill => <a key={skill} href="#skills">{skill}</a>)}</div></Module><Module title={t("2009.note", "Note")} icon="! "><p className="widget-note">{t("2009.noteText", "2009 is the visual style, not the creation date of the projects. The portfolio content remains current.")}</p></Module></aside></div>
    <footer className="catalog-footer"><span>{profile.name} · {t("2009.personal", "Personal web site")}</span><span>{t("2009.footer", "You are viewing the 2009 version. Welcome to the web we remember.")}</span><a href="#home">{t("2009.top", "Back to top")} ↑</a></footer>
  </div></div>;
}
