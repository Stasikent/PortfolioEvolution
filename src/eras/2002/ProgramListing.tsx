import { useMemo } from "react";
import { ProjectMediaGallery } from "../../components/ProjectMediaGallery";
import { ProjectOverview } from "../../components/ProjectOverview";
import type { Project } from "../../content/projects";
import { useTranslations } from "../../core/TranslationProvider";

export function ProgramListing({ project }: { project: Project }) {
  const prefix = `projects.${project.id}`;
  const entries = useMemo(() => {
    const e: Record<string, string> = {
      [`${prefix}.category`]: project.category,
      [`${prefix}.headline`]: project.headline,
      [`${prefix}.description`]: project.description,
      [`${prefix}.labels.new`]: "NEW",
      [`${prefix}.labels.problem`]: "Problem",
      [`${prefix}.labels.authorWork`]: "Author's work",
      [`${prefix}.labels.aiAssistance`]: "AI assistance",
      [`${prefix}.labels.firstRelease`]: "First release",
      [`${prefix}.labels.features`]: "Features",
      [`${prefix}.labels.technologies`]: "Technologies",
    };
    project.features.forEach((text, i) => { e[`${prefix}.features.${i}`] = text; });
    project.journey?.forEach((text, i) => { e[`${prefix}.journey.${i}`] = text; });
    project.links.forEach((link, i) => { e[`${prefix}.links.${i}`] = link.label; });
    if (project.caseStudy) {
      e[`${prefix}.case.challenge`] = project.caseStudy.challenge;
      e[`${prefix}.case.ownership`] = project.caseStudy.ownership;
      e[`${prefix}.case.ai`] = project.caseStudy.aiContribution;
      e[`${prefix}.case.delivery`] = project.caseStudy.delivery;
    }
    return e;
  }, [project, prefix]);
  const { t } = useTranslations(entries);

  return (
    <article className="program-listing" id={project.id} data-position>
      <div className="directory-path">PROGRAMS &gt; {t(`${prefix}.category`, project.category).toUpperCase()}</div>
      <h3><span className="new-badge">{t(`${prefix}.labels.new`, "NEW")}</span> {project.name}</h3>
      <strong>{t(`${prefix}.headline`, project.headline)}</strong>
      <p>{t(`${prefix}.description`, project.description)}</p>
      <ProjectOverview overview={project.overview} className="portal-case-facts" translationPrefix={prefix} />
      {project.caseStudy && <dl className="portal-case-facts">
        <div><dt>{t(`${prefix}.labels.problem`, "Problem")}:</dt><dd>{t(`${prefix}.case.challenge`, project.caseStudy.challenge)}</dd></div>
        <div><dt>{t(`${prefix}.labels.authorWork`, "Author's work")}:</dt><dd>{t(`${prefix}.case.ownership`, project.caseStudy.ownership)}</dd></div>
        <div><dt>{t(`${prefix}.labels.aiAssistance`, "AI assistance")}:</dt><dd>{t(`${prefix}.case.ai`, project.caseStudy.aiContribution)}</dd></div>
        <div><dt>{t(`${prefix}.labels.firstRelease`, "First release")}:</dt><dd>{t(`${prefix}.case.delivery`, project.caseStudy.delivery)}</dd></div>
      </dl>}
      {project.journey && <p className="portal-journey">{project.journey.map((step, i) => t(`${prefix}.journey.${i}`, step)).join(" → ")}</p>}
      {project.features.length > 0 && <p><b>{t(`${prefix}.labels.features`, "Features")}:</b> {project.features.map((feature, i) => t(`${prefix}.features.${i}`, feature)).join(" • ")}</p>}
      <p><b>{t(`${prefix}.labels.technologies`, "Technologies")}:</b> {project.technologies.join(", ")}</p>
      <ProjectMediaGallery media={project.media} />
      <div className="portal-links">{project.links.map((link, i) => <a key={link.url} href={link.url} target="_blank" rel="noreferrer">[{t(`${prefix}.links.${i}`, link.label)}]</a>)}</div>
    </article>
  );
}
