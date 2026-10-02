import { ProjectMediaGallery } from "../../components/ProjectMediaGallery";
import { ProjectOverview } from "../../components/ProjectOverview";
import type { Project } from "../../content/projects";
export function ProgramListing({ project }: { project: Project }) {
  return (
    <article className="program-listing" id={project.id} data-position>
      <div className="directory-path">
        PROGRAMS &gt; {project.category.toUpperCase()}
      </div>
      <h3>
        <span className="new-badge">NEW</span> {project.name}
      </h3>
      <strong>{project.headline}</strong>
      <p>{project.description}</p>
      <ProjectOverview overview={project.overview} className="portal-case-facts" />
          {project.caseStudy && (
        <dl className="portal-case-facts">
          <div><dt>Problem:</dt><dd>{project.caseStudy.challenge}</dd></div>
          <div><dt>Author's work:</dt><dd>{project.caseStudy.ownership}</dd></div>
          <div><dt>AI assistance:</dt><dd>{project.caseStudy.aiContribution}</dd></div>
          <div><dt>First release:</dt><dd>{project.caseStudy.delivery}</dd></div>
        </dl>
      )}
      {project.journey && (
        <p className="portal-journey">{project.journey.join(" → ")}</p>
      )}
      {project.features.length > 0 && (
        <p>
          <b>Features:</b> {project.features.join(" • ")}
        </p>
      )}
      <p>
        <b>Technologies:</b> {project.technologies.join(", ")}
      </p>
      <ProjectMediaGallery media={project.media} />
      <div className="portal-links">
        {project.links.map((link) => (
          <a key={link.url} href={link.url} target="_blank" rel="noreferrer">
            [{link.label}]
          </a>
        ))}
      </div>
    </article>
  );
}
