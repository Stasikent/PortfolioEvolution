import { profile } from "../../content/profile";
import { contacts } from "../../content/contacts";
import { projects } from "../../content/projects";
import { skills, historicalSkills } from "../../content/skills";
import { timeline } from "../../content/timeline";
import { buildProcess } from "../../content/process";
import { useEra } from "../../core/EraProvider";
import { ProgramListing } from "./ProgramListing";
import "./portal.css";
export function PortalPortfolio() {
  const { setEra } = useEra();
  return (
    <div className="portal">
      <div className="portal-shell">
        <header className="portal-header" id="home" data-position>
          <div className="portal-topline">
            PERSONAL HOMEPAGE :: SOFTWARE / WEB / AI
          </div>
          <div className="portal-masthead">
            <div>
              <span className="portal-logo" aria-hidden="true">
                &lt;SR&gt;
              </span>
              <h1>{profile.name}</h1>
              <p>{profile.roles}</p>
            </div>
            <div className="web-badge">
              WORLD WIDE WEB
              <br />
              <b>2002 EDITION</b>
            </div>
          </div>
          <nav aria-label="Main navigation">
            <a href="#home">Home</a> | <a href="#story">About me</a> |{" "}
            <a href="#projects">My programs</a> | <a href="#skills">Skills</a> |{" "}
            <a href="#process">How I build</a> | <a href="#contact">Links</a>
          </nav>
        </header>
        <div className="portal-columns">
          <aside className="portal-sidebar">
            <div className="portal-panel">
              <h2>Site directory</h2>
              <ul>
                <li>
                  <a href="#projects">Programs ({projects.length})</a>
                  <ul>
                    {projects.map((project) => (
                      <li key={project.id}>
                        <a href={`#${project.id}`}>{project.name}</a>
                      </li>
                    ))}
                  </ul>
                </li>
                <li>
                  <a href="#story">About the author</a>
                </li>
                <li>
                  <a href="#skills">Technologies</a>
                </li>
                <li>
                  <a href="#process">Development process</a>
                </li>
                <li>
                  <a href="#contact">Useful links</a>
                </li>
              </ul>
            </div>
            <div className="portal-panel">
              <h2>Web time machine</h2>
              <p>You are viewing the 2002 edition.</p>
              <button onClick={() => setEra(2026)}>Go to 2026 &gt;&gt;</button>
            </div>
            <div className="period-note">
              Best viewed at 1024×768
              <br />
              <small>A period reference — works on mobile, too.</small>
            </div>
          </aside>
          <main id="main" tabIndex={-1} className="portal-main">
            <section className="welcome" id="about" data-position>
              <h2>Welcome to my homepage!</h2>
              <strong>{profile.message}</strong>
              <p>{profile.concept}</p>
              <p>{profile.introduction}</p>
            </section>
            <section className="portal-panel" id="projects" data-position>
              <h2>My programs / Software directory</h2>
              {projects.map((project) => (
                <ProgramListing key={project.id} project={project} />
              ))}
            </section>
            <section className="portal-panel" id="story" data-position>
              <h2>About the author</h2>
              {timeline.map((item) => (
                <article className="portal-story" key={item.label}>
                  <h3>
                    {item.label}: {item.title}
                  </h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </section>
            <section className="portal-panel" id="skills" data-position>
              <h2>Technologies & interests</h2>
              <div className="panel-content">
                <h3>Current technologies & areas</h3>
                <ul className="portal-skills">
                  {skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
                <h3>Earlier web experiments</h3>
                <p>{historicalSkills.join(" / ")}</p>
              </div>
            </section>
            <section className="portal-panel" id="process" data-position>
              <h2>How I build</h2>
              <ol className="portal-process">
                {buildProcess.map((step) => (
                  <li key={step}>
                    {step === "Read the code" ? (
                      <strong>{step.toUpperCase()}</strong>
                    ) : (
                      step.toUpperCase()
                    )}
                  </li>
                ))}
              </ol>
            </section>
            <section className="portal-panel" id="contact" data-position>
              <h2>Links / Find me</h2>
              <p className="panel-content">
                {contacts.map((contact) => (
                  <a key={contact.id} href={contact.url} target="_blank" rel="noreferrer">
                    {contact.label}: {contact.display}
                  </a>
                ))}
              </p>
            </section>
          </main>
          <aside className="portal-right">
            <div className="portal-panel">
              <h2>Featured program</h2>
              <p>
                <a href="#mis-bot">{projects[0].name}</a>
              </p>
              <p>{projects[0].headline}</p>
            </div>
            <div className="portal-panel">
              <h2>Site information</h2>
              <p>
                Same author.
                <br />
                Same programs.
                <br />
                Another web.
              </p>
              <p>
                Visitor counter
                <br />
                <span
                  className="visitor-counter"
                  aria-label="Decorative visitor counter"
                >
                  000001
                </span>
                <br />
                <small>Decorative, not analytics.</small>
              </p>
            </div>
            <div className="html-badge">
              &lt;/&gt; HTML
              <br />
              <b>MADE FOR THE WEB</b>
            </div>
          </aside>
        </div>
        <footer className="portal-footer">
          {profile.name} · Personal homepage
          <br />
          <a href="#home">[Back to top]</a> ·{" "}
          <button onClick={() => setEra(2026)}>Return to 2026</button>
        </footer>
      </div>
    </div>
  );
}
