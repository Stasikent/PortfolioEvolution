import { ProjectMediaGallery } from "../../components/ProjectMediaGallery";
import { ProjectOverview } from "../../components/ProjectOverview";
import { profile } from "../../content/profile";
import { projects } from "../../content/projects";
import { contacts } from "../../content/contacts";
import { skills, historicalSkills } from "../../content/skills";
import { timeline } from "../../content/timeline";
import { buildProcess } from "../../content/process";
import "./flat.css";

export function FlatPortfolio() {
  return <div className="flat-2013">
    <header className="flat-header"><div className="flat-container flat-nav"><a className="flat-logo" href="#home" aria-label={`${profile.name}, home`}>SR<span>.</span></a><nav aria-label="Main navigation"><a href="#about">About</a><a href="#projects">Work</a><a href="#skills">Toolkit</a><a href="#story">Story</a><a href="#contact">Contact</a></nav></div></header>
    <main id="main" tabIndex={-1}>
      <section className="flat-hero" id="home" data-position><div className="flat-container"><p className="flat-eyebrow">{profile.name} / PORTFOLIO</p><h1>{profile.message}</h1><p className="flat-hero-role">{profile.roles}</p><a className="flat-button" href="#projects">VIEW MY WORK <span aria-hidden="true">↓</span></a><div className="flat-hero-decoration" aria-hidden="true"><span>&lt;</span><i>/</i><span>&gt;</span></div><p className="flat-edition">2013 EDITION · TODAY’S WORK, ANOTHER WEB</p></div></section>
      <section className="flat-about flat-container" id="about" data-position><div className="flat-about-icon" aria-hidden="true">hello<span>world.</span></div><div><p className="flat-eyebrow">A LITTLE ABOUT ME</p><h2>{profile.concept}</h2><p>{profile.introduction}</p><a className="flat-text-link" href="#story">The story so far <span aria-hidden="true">→</span></a></div></section>
      <section className="flat-work" id="projects" data-position><div className="flat-container"><div className="flat-section-heading"><p className="flat-eyebrow">IDEAS INTO APPLICATIONS</p><h2>Selected work<span>.</span></h2><p>Explore a project, then open its case notes.</p></div>
        <nav className="flat-gallery" aria-label="Choose a project">{projects.map((project, index) => <a className={`flat-tile flat-tile-${index % 3}`} key={project.id} href={`#${project.id}`}><span className="flat-tile-art" aria-hidden="true"><span className="flat-art-window"><i /><i /><i /><b>{["{ }", "✓", "…"][index % 3]}</b></span></span><span className="flat-tile-caption"><strong>{project.name}</strong><small>{project.category}</small><span aria-hidden="true">↗</span></span></a>)}</nav>
        <div className="flat-cases">{projects.map((project, index) => <article id={project.id} data-position className="flat-case" key={project.id}><div className="flat-case-top"><span className="flat-case-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><div><p className="flat-eyebrow">{project.category}</p><h3>{project.name}</h3><p className="flat-case-headline">{project.headline}</p></div></div><p>{project.description}</p><details className="flat-case-details"><summary>Inside the project<span className="sr-only"> — {project.name}</span><span aria-hidden="true">＋</span></summary><div className="flat-case-body">
          <ProjectOverview overview={project.overview} className="flat-case-facts" />
          {project.caseStudy && <dl className="flat-case-facts"><div><dt>Challenge</dt><dd>{project.caseStudy.challenge}</dd></div><div><dt>My role</dt><dd>{project.caseStudy.ownership}</dd></div><div><dt>AI in the process</dt><dd>{project.caseStudy.aiContribution}</dd></div><div><dt>Delivery</dt><dd>{project.caseStudy.delivery}</dd></div></dl>}
          {project.journey && <div><h4>From problem to product</h4><ol>{project.journey.map(step => <li key={step}>{step}</li>)}</ol></div>}
          {project.features.length > 0 && <div><h4>What’s inside</h4><ul>{project.features.map(feature => <li key={feature}>{feature}</li>)}</ul></div>}
          <div><h4>Built with</h4><ul className="flat-tags">{project.technologies.map(tech => <li key={tech}>{tech}</li>)}</ul></div>
          <ProjectMediaGallery media={project.media} />
        </div></details><div className="flat-case-links">{project.links.map(link => <a key={link.url} href={link.url} target="_blank" rel="noreferrer">{link.label} <span aria-hidden="true">↗</span></a>)}</div></article>)}</div>
      </div></section>
      <section className="flat-skills flat-container" id="skills" data-position><div className="flat-section-heading"><p className="flat-eyebrow">THE TOOLKIT</p><h2>Tools for the job<span>.</span></h2></div><ul className="flat-skill-grid">{skills.map(skill => <li key={skill}><span aria-hidden="true">＋</span>{skill}</li>)}</ul><div className="flat-earlier"><h3>Earlier web experiments</h3><p>{historicalSkills.join(" · ")}</p></div></section>
      <section className="flat-story" id="story" data-position><div className="flat-container"><div className="flat-section-heading"><p className="flat-eyebrow">THE PATH HERE</p><h2>One story. Different chapters.</h2></div><div className="flat-chapters">{timeline.map((item, index) => <article key={item.label}><span className="flat-chapter-dot" aria-hidden="true">{index + 1}</span><p className="flat-eyebrow">{item.label}</p><h3>{item.title}</h3><p>{item.description}</p></article>)}</div></div></section>
      <section className="flat-process flat-container" id="process" data-position><div className="flat-section-heading"><p className="flat-eyebrow">THE PROCESS</p><h2>From problem to ship<span>.</span></h2></div><ol>{buildProcess.map((step, index) => <li key={step} className={step === "Read the code" ? "flat-read-code" : ""}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><strong>{step}</strong></li>)}</ol></section>
      <section className="flat-contact" id="contact" data-position><div className="flat-container"><p className="flat-eyebrow">FIND ME ONLINE</p><h2>Let the work speak.</h2>{contacts.map(contact => <a className="flat-button" key={contact.id} href={contact.url} target="_blank" rel="noreferrer">{contact.display} <span aria-hidden="true">↗</span></a>)}</div></section>
    </main><footer className="flat-footer"><div className="flat-container"><span>{profile.name} · {profile.roles}</span><a href="#home">Back to top ↑</a></div></footer>
  </div>;
}
