import { useMemo } from "react";
import { getProfile } from "../../content/profile";
import { contacts } from "../../content/contacts";
import { projects } from "../../content/projects";
import { skills, historicalSkills } from "../../content/skills";
import { getTimeline } from "../../content/timeline";
import { getBuildProcess } from "../../content/process";
import { useEra } from "../../core/EraProvider";
import { useTranslations } from "../../core/TranslationProvider";
import { ProgramListing } from "./ProgramListing";
import "./portal.css";

export function PortalPortfolio() {
  const { setEra } = useEra();
  const profile = getProfile("en");
  const timeline = getTimeline("en");
  const buildProcess = getBuildProcess("en");
  const entries = useMemo(() => {
    const e: Record<string, string> = {
      "2002.topline": "PERSONAL HOMEPAGE :: SOFTWARE / WEB / AI", "2002.nav.home": "Home", "2002.nav.about": "About me", "2002.nav.programs": "My programs", "2002.nav.skills": "Skills", "2002.nav.process": "How I build", "2002.nav.links": "Links",
      "2002.directory": "Site directory", "2002.programs": `Programs (${projects.length})`, "2002.author": "About the author", "2002.technologies": "Technologies", "2002.development": "Development process", "2002.useful": "Useful links", "2002.machine": "Web time machine", "2002.edition": "You are viewing the 2002 edition.", "2002.go2026": "Go to 2026 >>", "2002.best": "Best viewed at 1024×768", "2002.period": "A period reference — works on mobile, too.",
      "2002.welcome": "Welcome to my homepage!", "2002.profile.message": profile.message, "2002.profile.concept": profile.concept, "2002.profile.introduction": profile.introduction, "2002.software": "My programs / Software directory", "2002.current": "Current technologies & areas", "2002.early": "Earlier web experiments", "2002.build": "How I build", "2002.contacts": "Links / Find me", "2002.featured": "Featured program", "2002.siteInfo": "Site information", "2002.sameAuthor": "Same author. Same programs. Another web.", "2002.counter": "Visitor counter", "2002.counterAria": "Decorative visitor counter", "2002.decorative": "Decorative, not analytics.", "2002.personal": "Personal homepage", "2002.top": "Back to top", "2002.return": "Return to 2026", "2002.mainNav": "Main navigation",
      "2002.featuredHeadline": projects[0].headline,
    };
    timeline.forEach((item, i) => { e[`2002.timeline.${i}.title`] = item.title; e[`2002.timeline.${i}.description`] = item.description; });
    buildProcess.forEach((step, i) => { e[`2002.process.${i}`] = step; });
    return e;
  }, [profile, timeline, buildProcess]);
  const { t } = useTranslations(entries);
  return <div className="portal"><div className="portal-shell">
    <header className="portal-header" id="home" data-position><div className="portal-topline">{t("2002.topline", entries["2002.topline"])}</div><div className="portal-masthead"><div><span className="portal-logo" aria-hidden="true">&lt;SR&gt;</span><h1>{profile.name}</h1><p>{profile.roles}</p></div><div className="web-badge">WORLD WIDE WEB<br /><b>2002 EDITION</b></div></div>
      <nav aria-label={t("2002.mainNav", "Main navigation")}><a href="#home">{t("2002.nav.home", "Home")}</a> | <a href="#story">{t("2002.nav.about", "About me")}</a> | <a href="#projects">{t("2002.nav.programs", "My programs")}</a> | <a href="#skills">{t("2002.nav.skills", "Skills")}</a> | <a href="#process">{t("2002.nav.process", "How I build")}</a> | <a href="#contact">{t("2002.nav.links", "Links")}</a></nav></header>
    <div className="portal-columns"><aside className="portal-sidebar"><div className="portal-panel"><h2>{t("2002.directory", "Site directory")}</h2><ul><li><a href="#projects">{t("2002.programs", `Programs (${projects.length})`)}</a><ul>{projects.map(project => <li key={project.id}><a href={`#${project.id}`}>{project.name}</a></li>)}</ul></li><li><a href="#story">{t("2002.author", "About the author")}</a></li><li><a href="#skills">{t("2002.technologies", "Technologies")}</a></li><li><a href="#process">{t("2002.development", "Development process")}</a></li><li><a href="#contact">{t("2002.useful", "Useful links")}</a></li></ul></div><div className="portal-panel"><h2>{t("2002.machine", "Web time machine")}</h2><p>{t("2002.edition", "You are viewing the 2002 edition.")}</p><button onClick={() => setEra(2026)}>{t("2002.go2026", "Go to 2026 >>")}</button></div><div className="period-note">{t("2002.best", "Best viewed at 1024×768")}<br /><small>{t("2002.period", "A period reference — works on mobile, too.")}</small></div></aside>
      <main id="main" tabIndex={-1} className="portal-main"><section className="welcome" id="about" data-position><h2>{t("2002.welcome", "Welcome to my homepage!")}</h2><strong>{t("2002.profile.message", profile.message)}</strong><p>{t("2002.profile.concept", profile.concept)}</p><p>{t("2002.profile.introduction", profile.introduction)}</p></section><section className="portal-panel" id="projects" data-position><h2>{t("2002.software", "My programs / Software directory")}</h2>{projects.map(project => <ProgramListing key={project.id} project={project} />)}</section>
        <section className="portal-panel" id="story" data-position><h2>{t("2002.author", "About the author")}</h2>{timeline.map((item, i) => <article className="portal-story" key={item.label}><h3>{item.label}: {t(`2002.timeline.${i}.title`, item.title)}</h3><p>{t(`2002.timeline.${i}.description`, item.description)}</p></article>)}</section><section className="portal-panel" id="skills" data-position><h2>{t("2002.technologies", "Technologies & interests")}</h2><div className="panel-content"><h3>{t("2002.current", "Current technologies & areas")}</h3><ul className="portal-skills">{skills.map(skill => <li key={skill}>{skill}</li>)}</ul><h3>{t("2002.early", "Earlier web experiments")}</h3><p>{historicalSkills.join(" / ")}</p></div></section><section className="portal-panel" id="process" data-position><h2>{t("2002.build", "How I build")}</h2><ol className="portal-process">{buildProcess.map((step, i) => <li key={step}>{i === 4 ? <strong>{t(`2002.process.${i}`, step).toUpperCase()}</strong> : t(`2002.process.${i}`, step).toUpperCase()}</li>)}</ol></section><section className="portal-panel" id="contact" data-position><h2>{t("2002.contacts", "Links / Find me")}</h2><p className="panel-content">{contacts.map(contact => <a key={contact.id} href={contact.url} target="_blank" rel="noreferrer">{contact.label}: {contact.display}</a>)}</p></section></main>
      <aside className="portal-right"><div className="portal-panel"><h2>{t("2002.featured", "Featured program")}</h2><p><a href="#mis-bot">{projects[0].name}</a></p><p>{t("2002.featuredHeadline", projects[0].headline)}</p></div><div className="portal-panel"><h2>{t("2002.siteInfo", "Site information")}</h2><p>{t("2002.sameAuthor", "Same author. Same programs. Another web.")}</p><p>{t("2002.counter", "Visitor counter")}<br /><span className="visitor-counter" aria-label={t("2002.counterAria", "Decorative visitor counter")}>000001</span><br /><small>{t("2002.decorative", "Decorative, not analytics.")}</small></p></div><div className="html-badge">&lt;/&gt; HTML<br /><b>MADE FOR THE WEB</b></div></aside></div>
    <footer className="portal-footer">{profile.name} · {t("2002.personal", "Personal homepage")}<br /><a href="#home">[{t("2002.top", "Back to top")}]</a> · <button onClick={() => setEra(2026)}>{t("2002.return", "Return to 2026")}</button></footer>
  </div></div>;
}
