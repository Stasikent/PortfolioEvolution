import { useMemo } from "react";
import { ProjectMediaGallery } from "../../components/ProjectMediaGallery";
import { ProjectOverview } from "../../components/ProjectOverview";
import type { Project } from "../../content/projects";
import { useTranslations } from "../../core/TranslationProvider";

export function ProjectEntry({ project }: { project: Project }) {
  const prefix = `projects.${project.id}`;
  const entries = useMemo(() => {
    const e: Record<string, string> = {
      "2009.entry.breadcrumb": "File catalog » Programs »", "2009.entry.description": "Description:", "2009.entry.category": "Category:", "2009.entry.technologies": "Technologies:", "2009.entry.more": "More details", "2009.entry.case": "Case study", "2009.entry.challenge": "Challenge", "2009.entry.role": "My role", "2009.entry.ai": "AI role", "2009.entry.result": "Result", "2009.entry.journey": "From problem to tool", "2009.entry.features": "Features", "2009.entry.areas": "Project areas", "2009.entry.materials": "Project materials", "2009.entry.links": "Links:",
      [`${prefix}.category`]: project.category, [`${prefix}.headline`]: project.headline, [`${prefix}.description`]: project.description,
    };
    project.features.forEach((text, i) => { e[`${prefix}.features.${i}`] = text; }); project.journey?.forEach((text, i) => { e[`${prefix}.journey.${i}`] = text; }); project.links.forEach((link, i) => { e[`${prefix}.links.${i}`] = link.label; });
    if (project.caseStudy) { e[`${prefix}.case.challenge`] = project.caseStudy.challenge; e[`${prefix}.case.ownership`] = project.caseStudy.ownership; e[`${prefix}.case.ai`] = project.caseStudy.aiContribution; e[`${prefix}.case.delivery`] = project.caseStudy.delivery; }
    return e;
  }, [project, prefix]);
  const { t } = useTranslations(entries);
  return <article className="catalog-entry" id={project.id} data-position>
    <div className="catalog-breadcrumb"><span>{t("2009.entry.breadcrumb", "File catalog » Programs »")} </span>{t(`${prefix}.category`, project.category)}</div>
    <h3><span className="file-symbol" aria-hidden="true">▤</span> {project.name}</h3><div className="entry-content"><p className="entry-headline">{t(`${prefix}.headline`, project.headline)}</p><p><b>{t("2009.entry.description", "Description:")} </b>{t(`${prefix}.description`, project.description)}</p><dl className="entry-meta"><div><dt>{t("2009.entry.category", "Category:")}</dt><dd>{t(`${prefix}.category`, project.category)}</dd></div><div><dt>{t("2009.entry.technologies", "Technologies:")}</dt><dd>{project.technologies.join(" · ")}</dd></div></dl>
      <details className="entry-details"><summary><span>{t("2009.entry.more", "More details")}</span><span className="sr-only"> — {project.name}</span></summary><div className="entry-expanded"><ProjectOverview overview={project.overview} className="entry-case-facts" translationPrefix={prefix} />
        {project.caseStudy && <><h4>{t("2009.entry.case", "Case study")}</h4><dl className="entry-case-facts"><div><dt>{t("2009.entry.challenge", "Challenge")}</dt><dd>{t(`${prefix}.case.challenge`, project.caseStudy.challenge)}</dd></div><div><dt>{t("2009.entry.role", "My role")}</dt><dd>{t(`${prefix}.case.ownership`, project.caseStudy.ownership)}</dd></div><div><dt>{t("2009.entry.ai", "AI role")}</dt><dd>{t(`${prefix}.case.ai`, project.caseStudy.aiContribution)}</dd></div><div><dt>{t("2009.entry.result", "Result")}</dt><dd>{t(`${prefix}.case.delivery`, project.caseStudy.delivery)}</dd></div></dl></>}
        {project.journey && <><h4>{t("2009.entry.journey", "From problem to tool")}</h4><ol>{project.journey.map((step, i) => <li key={step}>{t(`${prefix}.journey.${i}`, step)}</li>)}</ol></>}{project.features.length > 0 && <><h4>{t("2009.entry.features", "Features")}</h4><ul>{project.features.map((feature, i) => <li key={feature}>{t(`${prefix}.features.${i}`, feature)}</li>)}</ul></>}{!project.journey && !project.features.length && <><h4>{t("2009.entry.areas", "Project areas")}</h4><ul>{project.technologies.map(tech => <li key={tech}>{tech}</li>)}</ul></>}<h4>{t("2009.entry.materials", "Project materials")}</h4><ul>{project.links.map((link, i) => <li key={link.url}><a href={link.url} target="_blank" rel="noreferrer">{t(`${prefix}.links.${i}`, link.label)} ↗</a></li>)}</ul><ProjectMediaGallery media={project.media} /></div></details></div>
    <footer className="entry-footer"><span>{t("2009.entry.links", "Links:")}</span>{project.links.map((link, i) => <a className="catalog-button" key={link.url} href={link.url} target="_blank" rel="noreferrer">{t(`${prefix}.links.${i}`, link.label)} <span aria-hidden="true">↗</span></a>)}</footer>
  </article>;
}
