import { getProfile } from "../../content/profile";
import { contacts } from "../../content/contacts";
import { projects } from "../../content/projects";
import { skills, historicalSkills } from "../../content/skills";
import { getTimeline } from "../../content/timeline";
import { getBuildProcess } from "../../content/process";
import { useEra } from "../../core/EraProvider";
import { ProgramListing } from "./ProgramListing";
import "./portal.css";
export function PortalPortfolio() {
  const { setEra, language } = useEra();
  const profile = getProfile(language);
  const timeline = getTimeline(language);
  const buildProcess = getBuildProcess(language);
  const ru = language === "ru";
  return (
    <div className="portal"><div className="portal-shell">
      <header className="portal-header" id="home" data-position>
        <div className="portal-topline">{ru ? "ЛИЧНАЯ СТРАНИЦА :: SOFTWARE / WEB / AI" : "PERSONAL HOMEPAGE :: SOFTWARE / WEB / AI"}</div>
        <div className="portal-masthead"><div><span className="portal-logo" aria-hidden="true">&lt;SR&gt;</span><h1>{profile.name}</h1><p>{profile.roles}</p></div><div className="web-badge">WORLD WIDE WEB<br /><b>2002 EDITION</b></div></div>
        <nav aria-label={ru ? "Основная навигация" : "Main navigation"}><a href="#home">{ru ? "Главная" : "Home"}</a> | <a href="#story">{ru ? "Обо мне" : "About me"}</a> |{" "}<a href="#projects">{ru ? "Мои программы" : "My programs"}</a> | <a href="#skills">{ru ? "Навыки" : "Skills"}</a> |{" "}<a href="#process">{ru ? "Как я работаю" : "How I build"}</a> | <a href="#contact">{ru ? "Ссылки" : "Links"}</a></nav>
      </header>
      <div className="portal-columns">
        <aside className="portal-sidebar"><div className="portal-panel"><h2>{ru ? "Каталог сайта" : "Site directory"}</h2><ul><li><a href="#projects">{ru ? `Программы (${projects.length})` : `Programs (${projects.length})`}</a><ul>{projects.map((project) => <li key={project.id}><a href={`#${project.id}`}>{project.name}</a></li>)}</ul></li><li><a href="#story">{ru ? "Об авторе" : "About the author"}</a></li><li><a href="#skills">{ru ? "Технологии" : "Technologies"}</a></li><li><a href="#process">{ru ? "Процесс разработки" : "Development process"}</a></li><li><a href="#contact">{ru ? "Полезные ссылки" : "Useful links"}</a></li></ul></div>
          <div className="portal-panel"><h2>{ru ? "Машина времени" : "Web time machine"}</h2><p>{ru ? "Вы смотрите версию 2002 года." : "You are viewing the 2002 edition."}</p><button onClick={() => setEra(2026)}>{ru ? "В 2026 >>" : "Go to 2026 >>"}</button></div>
          <div className="period-note">{ru ? "Лучше смотреть в 1024×768" : "Best viewed at 1024×768"}<br /><small>{ru ? "Отсылка к эпохе — на мобильном тоже работает." : "A period reference — works on mobile, too."}</small></div></aside>
        <main id="main" tabIndex={-1} className="portal-main">
          <section className="welcome" id="about" data-position><h2>{ru ? "Добро пожаловать на мою домашнюю страницу!" : "Welcome to my homepage!"}</h2><strong>{profile.message}</strong><p>{profile.concept}</p><p>{profile.introduction}</p></section>
          <section className="portal-panel" id="projects" data-position><h2>{ru ? "Мои программы / Каталог ПО" : "My programs / Software directory"}</h2>{projects.map((project) => <ProgramListing key={project.id} project={project} />)}</section>
          <section className="portal-panel" id="story" data-position><h2>{ru ? "Об авторе" : "About the author"}</h2>{timeline.map((item) => <article className="portal-story" key={item.label}><h3>{item.label}: {item.title}</h3><p>{item.description}</p></article>)}</section>
          <section className="portal-panel" id="skills" data-position><h2>{ru ? "Технологии и интересы" : "Technologies & interests"}</h2><div className="panel-content"><h3>{ru ? "Текущие технологии и направления" : "Current technologies & areas"}</h3><ul className="portal-skills">{skills.map((skill) => <li key={skill}>{skill}</li>)}</ul><h3>{ru ? "Ранние веб-эксперименты" : "Earlier web experiments"}</h3><p>{historicalSkills.join(" / ")}</p></div></section>
          <section className="portal-panel" id="process" data-position><h2>{ru ? "Как я работаю" : "How I build"}</h2><ol className="portal-process">{buildProcess.map((step, i) => <li key={step}>{i === 4 ? <strong>{step.toUpperCase()}</strong> : step.toUpperCase()}</li>)}</ol></section>
          <section className="portal-panel" id="contact" data-position><h2>{ru ? "Ссылки / Контакты" : "Links / Find me"}</h2><p className="panel-content">{contacts.map((contact) => <a key={contact.id} href={contact.url} target="_blank" rel="noreferrer">{contact.label}: {contact.display}</a>)}</p></section>
        </main>
        <aside className="portal-right"><div className="portal-panel"><h2>{ru ? "Программа дня" : "Featured program"}</h2><p><a href="#mis-bot">{projects[0].name}</a></p><p>{projects[0].headline}</p></div><div className="portal-panel"><h2>{ru ? "О сайте" : "Site information"}</h2><p>{ru ? <>Тот же автор.<br />Те же программы.<br />Другой веб.</> : <>Same author.<br />Same programs.<br />Another web.</>}</p><p>{ru ? "Счётчик посетителей" : "Visitor counter"}<br /><span className="visitor-counter" aria-label={ru ? "Декоративный счётчик посетителей" : "Decorative visitor counter"}>000001</span><br /><small>{ru ? "Декоративный, не аналитика." : "Decorative, not analytics."}</small></p></div><div className="html-badge">&lt;/&gt; HTML<br /><b>MADE FOR THE WEB</b></div></aside>
      </div>
      <footer className="portal-footer">{profile.name} · {ru ? "Личная страница" : "Personal homepage"}<br /><a href="#home">[{ru ? "Наверх" : "Back to top"}]</a> ·{" "}<button onClick={() => setEra(2026)}>{ru ? "Вернуться в 2026" : "Return to 2026"}</button></footer>
    </div></div>
  );
}
