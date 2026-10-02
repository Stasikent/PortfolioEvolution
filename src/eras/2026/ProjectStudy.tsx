import { ProjectMediaGallery } from "../../components/ProjectMediaGallery";
import { ProjectOverview } from "../../components/ProjectOverview";
import type { Project } from "../../content/projects";
export function ProjectStudy({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <article
      className={`project-study ${index === 0 ? "featured-study" : ""}`}
      id={project.id}
      data-position
    >
      <div className="project-index">
        <span>
          0{index + 1} / {project.category}
        </span>
        <h3>{project.name}</h3>
      </div>
      <div className="project-narrative">
        <h4>{project.headline}</h4>
        <p>{project.description}</p>
        <ProjectOverview overview={project.overview} className="project-case-facts" />
          {project.caseStudy && (
          <dl className="project-case-facts">
            <div><dt>Challenge</dt><dd>{project.caseStudy.challenge}</dd></div>
            <div><dt>My role</dt><dd>{project.caseStudy.ownership}</dd></div>
            <div><dt>AI in the process</dt><dd>{project.caseStudy.aiContribution}</dd></div>
            <div><dt>Delivery</dt><dd>{project.caseStudy.delivery}</dd></div>
          </dl>
        )}
        {project.journey && (
          <ol className="project-journey">
            {project.journey.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        )}
        {project.features.length > 0 && (
          <ul className="feature-list">
            {project.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        )}
        <ul className="tags" aria-label="Project technologies">
          {project.technologies.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
      <ProjectMediaGallery media={project.media} />
        <div className="project-links">
          {project.links.map((link) => (
            <a href={link.url} key={link.url} target="_blank" rel="noreferrer">
              {link.label}
              <span aria-hidden="true"> ↗</span>
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}
