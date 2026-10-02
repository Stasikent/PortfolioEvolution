import { ProjectMediaGallery } from "../../components/ProjectMediaGallery";
import { ProjectOverview } from "../../components/ProjectOverview";
import { profile } from "../../content/profile";
import { projects } from "../../content/projects";
import { contacts } from "../../content/contacts";
import { skills, historicalSkills } from "../../content/skills";
import { timeline } from "../../content/timeline";
import { buildProcess } from "../../content/process";
import "./blog.css";

export function BlogPortfolio() {
  return <div className="blog-2006">
    <div className="blog-paper">
      <header className="blog-header" id="home" data-position>
        <div className="blog-topline"><span>A PERSONAL WEBLOG</span><span>2006 DESIGN EDITION</span></div>
        <div className="blog-masthead"><p className="blog-overline">Notes on code &amp; the things I build</p><h1>{profile.name}<span>’s weblog</span></h1><p>{profile.concept}</p><span className="blog-flower" aria-hidden="true">✳</span></div>
        <nav className="blog-tabs" aria-label="Main navigation"><a href="#projects">The weblog</a><a href="#about">About the author</a><a href="#story">My story</a><a href="#contact">Elsewhere ↗</a></nav>
      </header>
      <div className="blog-layout">
        <main id="main" tabIndex={-1}>
          <section className="blog-welcome" id="about" data-position><span className="blog-label">A NOTE FROM THE AUTHOR</span><h2>{profile.message}</h2><p>{profile.introduction}</p><p className="blog-signature">— {profile.name}</p></section>
          <section id="projects" data-position className="blog-feed">
            <div className="blog-feed-heading"><h2>From the workbench</h2><span>{projects.length} project notes</span></div>
            {projects.map((project, index) => <article className="blog-post" key={project.id} id={project.id} data-position>
              <div className="blog-post-heading"><span className="blog-post-mark" aria-hidden="true">¶</span><div><p className="blog-post-meta">FILED UNDER <a href={`#${project.id}`}>{project.category}</a></p><h3><a href={`#${project.id}`}>{project.name}</a></h3></div></div>
              <p className="blog-deck">{project.headline}</p><p>{project.description}</p>
              <details className="blog-more"><summary>Read the rest of this entry <span aria-hidden="true">»</span><span className="sr-only"> — {project.name}</span></summary><div>
                <ProjectOverview overview={project.overview} className="blog-case-facts" />
          {project.caseStudy && <><h4>Case notes</h4><dl className="blog-case-facts"><div><dt>Challenge</dt><dd>{project.caseStudy.challenge}</dd></div><div><dt>My role</dt><dd>{project.caseStudy.ownership}</dd></div><div><dt>AI in the process</dt><dd>{project.caseStudy.aiContribution}</dd></div><div><dt>Delivery</dt><dd>{project.caseStudy.delivery}</dd></div></dl></>}
                {project.journey && <><h4>From problem to tool</h4><ol>{project.journey.map(step => <li key={step}>{step}</li>)}</ol></>}
                {project.features.length > 0 && <><h4>Inside the project</h4><ul>{project.features.map(feature => <li key={feature}>{feature}</li>)}</ul></>}
                <h4>Technologies</h4><p>{project.technologies.join(" · ")}</p>
                <ProjectMediaGallery media={project.media} />
              </div></details>
              <footer className="blog-post-footer"><span>Entry {String(index + 1).padStart(2, "0")}</span><div>{project.links.map(link => <a key={link.url} href={link.url} target="_blank" rel="noreferrer">{link.label} ↗</a>)}</div></footer>
            </article>)}
          </section>
          <section className="blog-story" id="story" data-position><span className="blog-label">THE LONG VERSION</span><h2>A few chapters along the way.</h2>{timeline.map(item => <article key={item.label}><p className="blog-chapter">{item.label}</p><h3>{item.title}</h3><p>{item.description}</p></article>)}</section>
          <section className="blog-toolkit" id="skills" data-position><span className="blog-label">MY TOOLBOX</span><h2>Technologies &amp; interests</h2><ul>{skills.map(skill => <li key={skill}>{skill}</li>)}</ul><h3>Earlier web experiments</h3><p>{historicalSkills.join(" / ")}</p></section>
          <section className="blog-process" id="process" data-position><span className="blog-label">A NOTE TO SELF</span><h2>How I build</h2><ol>{buildProcess.map(step => <li key={step}>{step === "Read the code" ? <strong>{step}</strong> : step}</li>)}</ol></section>
          <section className="blog-contact" id="contact" data-position><h2>Find me elsewhere</h2><p>{profile.roles}</p>{contacts.map(contact => <a key={contact.id} href={contact.url} target="_blank" rel="noreferrer">{contact.display} ↗</a>)}</section>
        </main>
        <aside className="blog-sidebar" aria-label="Weblog directory">
          <div className="blog-author-stamp" aria-hidden="true"><span>&lt;/&gt;</span><small>A PERSONAL CORNER<br />OF THE INTERNET</small></div>
          <section><h2>Hello, reader.</h2><p><strong>{profile.name}</strong></p><p>{profile.roles}</p><a href="#about">More about the author »</a></section>
          <section><h2>On this weblog</h2><ul className="blog-side-links"><li><a href="#projects">Project notes <span>{projects.length}</span></a></li><li><a href="#story">The personal story</a></li><li><a href="#skills">The toolbox</a></li><li><a href="#process">How I build</a></li></ul></section>
          <section><h2>Project index</h2><ul className="blog-side-links">{projects.map(project => <li key={project.id}><a href={`#${project.id}`}>{project.name} <span>»</span></a></li>)}</ul></section>
          <section><h2>Blogroll / links</h2><ul className="blog-side-links">{contacts.map(contact => <li key={contact.id}><a href={contact.url} target="_blank" rel="noreferrer">{contact.label} ↗</a></li>)}</ul></section>
          <p className="blog-era-note">An old-school weblog, with the current portfolio inside. 2006 is the design edition, not a publication date.</p>
        </aside>
      </div>
      <footer className="blog-footer"><span>{profile.name} · A personal weblog</span><a href="#home">Back to the top ↑</a></footer>
    </div>
  </div>;
}
