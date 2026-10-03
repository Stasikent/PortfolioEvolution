import { useMemo } from "react";
import { ProjectMediaGallery } from "../../components/ProjectMediaGallery";
import { ProjectOverview } from "../../components/ProjectOverview";
import type { Project } from "../../content/projects";
import { useTranslations } from "../../core/TranslationProvider";

function projectEntries(project: Project) {
  const prefix = `projects.${project.id}`;
  const entries: Record<string, string> = {
    [`${prefix}.category`]: project.category,
    [`${prefix}.headline`]: project.headline,
    [`${prefix}.description`]: project.description,
    [`${prefix}.labels.challenge`]: "Challenge",
    [`${prefix}.labels.role`]: "My role",
    [`${prefix}.labels.ai`]: "AI in the process",
    [`${prefix}.labels.delivery`]: "Delivery",
    [`${prefix}.labels.technologies`]: "Project technologies",
  };
  project.features.forEach((text, index) => { entries[`${prefix}.features.${index}`] = text; });
  project.journey?.forEach((text, index) => { entries[`${prefix}.journey.${index}`] = text; });
  project.links.forEach((link, index) => { entries[`${prefix}.links.${index}`] = link.label; });
  if (project.caseStudy) {
    entries[`${prefix}.case.challenge`] = project.caseStudy.challenge;
    entries[`${prefix}.case.ownership`] = project.caseStudy.ownership;
    entries[`${prefix}.case.ai`] = project.caseStudy.aiContribution;
    entries[`${prefix}.case.delivery`] = project.caseStudy.delivery;
  }
  return entries;
}

export function ProjectStudy({ project, index }: { project: Project; index: number }) {
  const entries = useMemo(() => projectEntries(project), [project]);
  const { t } = useTranslations(entries);
  const prefix = `projects.${project.id}`;
  return (
    <article className={`project-study ${index === 0 ? "featured-study" : ""}`} id={project.id} data-position>
      <div className="project-index"><span>0{index + 1} / {t(`${prefix}.category`, project.category)}</span><h3>{project.name}</h3></div>
      <div className="project-narrative">
        <h4>{t(`${prefix}.headline`, project.headline)}</h4>
        <p>{t(`${prefix}.description`, project.description)}</p>
        <ProjectOverview overview={project.overview} className="project-case-facts" translationPrefix={prefix} />
        {project.caseStudy && <dl className="project-case-facts">
          <div><dt>{t(`${prefix}.labels.challenge`, "Challenge")}</dt><dd>{t(`${prefix}.case.challenge`, project.caseStudy.challenge)}</dd></div>
          <div><dt>{t(`${prefix}.labels.role`, "My role")}</dt><dd>{t(`${prefix}.case.ownership`, project.caseStudy.ownership)}</dd></div>
          <div><dt>{t(`${prefix}.labels.ai`, "AI in the process")}</dt><dd>{t(`${prefix}.case.ai`, project.caseStudy.aiContribution)}</dd></div>
          <div><dt>{t(`${prefix}.labels.delivery`, "Delivery")}</dt><dd>{t(`${prefix}.case.delivery`, project.caseStudy.delivery)}</dd></div>
        </dl>}
        {project.journey && <ol className="project-journey">{project.journey.map((step, i) => <li key={step}>{t(`${prefix}.journey.${i}`, step)}</li>)}</ol>}
        {project.features.length > 0 && <ul className="feature-list">{project.features.map((feature, i) => <li key={feature}>{t(`${prefix}.features.${i}`, feature)}</li>)}</ul>}
        <ul className="tags" aria-label={t(`${prefix}.labels.technologies`, "Project technologies")}>{project.technologies.map((tech) => <li key={tech}>{tech}</li>)}</ul>
        <ProjectMediaGallery media={project.media} />
        <div className="project-links">{project.links.map((link, i) => <a href={link.url} key={link.url} target="_blank" rel="noreferrer">{t(`${prefix}.links.${i}`, link.label)}<span aria-hidden="true"> ↗</span></a>)}</div>
      </div>
    </article>
  );
}
