import { profile } from "../../content/profile";
import { contacts } from "../../content/contacts";
import { projects } from "../../content/projects";
import { skills, historicalSkills } from "../../content/skills";
import { timeline } from "../../content/timeline";
import { buildProcess } from "../../content/process";
import { useEra } from "../../core/EraProvider";
import { ProjectStudy } from "./ProjectStudy";
import "./modern.css";
export function ModernPortfolio() {
  const { setEra } = useEra();
  return (
    <div className="modern">
      <header className="modern-header">
        <a
          href="#home"
          className="wordmark"
          aria-label={`${profile.name}, home`}
        >
          sr<span> / </span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#projects">Projects</a>
          <a href="#story">Story</a>
          <a href="#skills">Skills</a>
          <a href="#process">How I build</a>
        </nav>
        <a
          className="header-github"
          href={profile.github}
          target="_blank"
          rel="noreferrer"
        >
          GitHub ↗
        </a>
      </header>
      <main id="main" tabIndex={-1}>
        <section className="hero" id="home" data-position>
          <div className="eyebrow">{profile.name}</div>
          <p className="hero-role">{profile.roles}</p>
          <h1>
            {profile.hero.map((part, index) =>
              part.emphasis ? <em key={index}>{part.text}</em> : part.text,
            )}
          </h1>
          <p className="hero-value">{profile.valueProposition}</p>
          <nav className="career-shortcuts" aria-label="Portfolio shortcuts">
            <a href="#mis-bot">MIS-Bot case study <span aria-hidden="true">↘</span></a>
            <a href="#release-guardian">AI Release Guardian</a>
            <a href="#aichatflutter">AIChatFlutter</a>
            <a href="#contact">Find me</a>
          </nav>
          <div className="hero-bottom">
            <a className="primary-link" href="#projects">
              Explore the work <span aria-hidden="true">↓</span>
            </a>
            <p>
              <span className="concept-signature">{profile.concept}</span>
              <br />
              <span className="evolution-explainer">{profile.evolution}</span>
              <br />
              <button className="text-button" onClick={() => setEra(2002)}>
                Take a trip to 2002 <span aria-hidden="true">↗</span>
              </button>
            </p>
          </div>
          <span className="hero-margin" aria-hidden="true">
            PROBLEM → CODE → PRODUCT
          </span>
        </section>
        <section className="work-section" id="projects" data-position>
          <div className="section-heading">
            <span className="eyebrow">01 / Selected work</span>
            <h2>
              Software with
              <br />a reason to exist.
            </h2>
          </div>
          {projects.map((project, index) => (
            <ProjectStudy key={project.id} project={project} index={index} />
          ))}
        </section>
        <section className="story-section" id="story" data-position>
          <div>
            <span className="eyebrow">02 / The story</span>
            <h2>{profile.concept}</h2>
            <p className="story-intro" id="about" data-position>{profile.introduction}</p>
          </div>
          <div className="story-timeline">
            {timeline.map((item) => (
              <article key={item.label}>
                <span className="eyebrow">{item.label}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="skills-section" id="skills" data-position>
          <div>
            <span className="eyebrow">03 / Toolkit</span>
            <h2>
              Tools follow
              <br />
              the problem.
            </h2>
          </div>
          <div>
            <h3>Current technologies & areas</h3>
            <ul className="skill-grid">
              {skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
            <p className="historical-skills">
              <strong>Earlier web experiments</strong>
              <br />
              {historicalSkills.join(" · ")}
            </p>
          </div>
        </section>
        <section className="process-section" id="process" data-position>
          <span className="eyebrow">04 / How I build</span>
          <h2>
            AI in the process.
            <br />
            Understanding at the core.
          </h2>
          <ol className="process-grid">
            {buildProcess.map((step, i) => (
              <li
                className={step === "Read the code" ? "read-code" : ""}
                key={step}
              >
                <span>0{i + 1}</span>
                <strong>{step}</strong>
                <span aria-hidden="true">↘</span>
              </li>
            ))}
          </ol>
        </section>
        <section className="contact-section" id="contact" data-position>
          <span className="eyebrow">05 / Find me</span>
          <h2>Let’s talk about the work.</h2>
          {contacts.map((contact) => (
            <a key={contact.id} href={contact.url} target="_blank" rel="noreferrer">
              {contact.display} <span aria-hidden="true">↗</span>
            </a>
          ))}
        </section>
      </main>
      <footer className="modern-footer">
        <span>{profile.name}</span>
        <span>One portfolio. Five different webs.</span>
        <a href="#home">Back to top ↑</a>
      </footer>
    </div>
  );
}
