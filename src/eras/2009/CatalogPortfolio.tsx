import { useEra } from "../../core/EraProvider";
import { profile } from "../../content/profile";
import { contacts } from "../../content/contacts";
import { projects } from "../../content/projects";
import { skills, historicalSkills } from "../../content/skills";
import { timeline } from "../../content/timeline";
import { buildProcess } from "../../content/process";
import { RetroEffects } from "../../effects/RetroEffects";
import { Module } from "./Module";
import { ProjectEntry } from "./ProjectEntry";
import { CalendarWidget } from "./CalendarWidget";
import { MiniChat, LocalPoll, MusicWidget, SiteStatistics } from "./NostalgiaWidgets";
import "./catalog.css";

const navigation = [
  { id: "home", label: "Главная" }, { id: "about", label: "Обо мне" },
  { id: "projects", label: "Каталог файлов" }, { id: "story", label: "История" },
  { id: "skills", label: "Технологии" }, { id: "contact", label: "Контакты" },
];

export function CatalogPortfolio() {
  const { effectsEnabled, setEffectsEnabled } = useEra();
  return <div className={`catalog-2009 ${effectsEnabled ? "" : "effects-paused"}`}>
    <RetroEffects enabled={effectsEnabled} />
    <div className="catalog-shell">
      <header className="catalog-header" id="home" data-position>
        <div className="catalog-utility"><span lang="ru">Личный сайт / Разработка / Программы</span><button aria-pressed={effectsEnabled} onClick={() => setEffectsEnabled(!effectsEnabled)} lang="ru">Эффекты: {effectsEnabled ? "вкл" : "выкл"}</button></div>
        <div className="catalog-masthead"><div className="catalog-monogram" aria-hidden="true">SR<span>.WEB</span></div><div><p className="catalog-kicker">PERSONAL WEB SITE</p><h1>{profile.name}</h1><p>{profile.roles}</p></div><div className="catalog-edition" aria-hidden="true"><b>2009</b><span>WEB EDITION</span></div></div>
        <nav className="catalog-navigation" aria-label="Main navigation" lang="ru">{navigation.map(item => <a key={item.id} href={`#${item.id}`}>{item.label}</a>)}</nav>
        <div className="catalog-ticker"><span lang="ru">Добро пожаловать!</span><p>{profile.concept}</p><a href="#projects" lang="ru">Проекты: {projects.length} »</a></div>
      </header>
      <div className="catalog-columns">
        <main id="main" tabIndex={-1} className="catalog-main">
          <section className="catalog-introduction" id="about" data-position><h2 lang="ru"><span aria-hidden="true">★</span> Обо мне <span className="pinned-label">ЗАКРЕПЛЕНО</span></h2><div><h3>{profile.message}</h3><p>{profile.introduction}</p><a href="#story" lang="ru">Читать историю автора »</a></div></section>
          <section id="projects" data-position><div className="catalog-section-title"><h2 lang="ru">Каталог файлов</h2><span lang="ru">Всего проектов: {projects.length}</span></div>{projects.map(project => <ProjectEntry key={project.id} project={project} />)}</section>
          <section id="story" data-position><Module title="История автора" icon="✎">{timeline.map(item => <article className="catalog-story" key={item.label}><span>{item.label}</span><h3>{item.title}</h3><p>{item.description}</p></article>)}</Module></section>
          <section id="skills" data-position><Module title="Технологии и интересы" icon="⚙"><h3>Current technologies & areas</h3><ul className="catalog-skills">{skills.map(skill => <li key={skill}>{skill}</li>)}</ul><h3>Earlier web experiments</h3><p>{historicalSkills.join(" · ")}</p></Module></section>
          <section id="process" data-position><Module title="Как я разрабатываю" icon="▤"><ol className="catalog-process">{buildProcess.map(step => <li key={step}>{step === "Read the code" ? <strong>{step}</strong> : step}</li>)}</ol></Module></section>
          <section id="contact" data-position><Module title="Контакты" icon="@"><p>{profile.name} · {profile.roles}</p><ul className="catalog-contacts">{contacts.map(contact => <li key={contact.id}><a href={contact.url} target="_blank" rel="noreferrer">{contact.label} — {contact.display} ↗</a></li>)}</ul></Module></section>
        </main>
        <aside className="catalog-left" aria-label="Site directory and profile">
          <Module title="Меню сайта" icon="▣"><nav className="catalog-side-menu" aria-label="Site directory" lang="ru">{navigation.slice(1).map(item => <a key={item.id} href={`#${item.id}`}><span aria-hidden="true">›</span>{item.label}</a>)}<a href="#process"><span aria-hidden="true">›</span>Как я разрабатываю</a></nav></Module>
          <Module title="Автор сайта" icon="♙"><div className="mini-profile"><span className="profile-file-icon" aria-hidden="true">&lt;/&gt;</span><strong>{profile.name}</strong><p>{profile.roles}</p>{contacts.map(contact => <a href={contact.url} target="_blank" rel="noreferrer" key={contact.id}>{contact.label} ↗</a>)}</div></Module>
          <CalendarWidget /><SiteStatistics />
        </aside>
        <aside className="catalog-right" aria-label="Period widgets">
          <MusicWidget /><MiniChat /><LocalPoll />
          <Module title="Облако технологий" icon="#"><div className="catalog-tag-cloud">{skills.map(skill => <a key={skill} href="#skills">{skill}</a>)}</div></Module>
          <Module title="На заметку" icon="! "><p lang="ru" className="widget-note">2009 — оформление, а не дата создания проектов. Содержание портфолио остаётся актуальным.</p></Module>
        </aside>
      </div>
      <footer className="catalog-footer"><span>{profile.name} · Personal web site</span><span lang="ru">Вы в версии 2009. Добро пожаловать в веб, который мы помним.</span><a href="#home" lang="ru">Наверх ↑</a></footer>
    </div>
  </div>;
}
