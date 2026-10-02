import { ProjectMediaGallery } from "../../components/ProjectMediaGallery";
import { ProjectOverview } from "../../components/ProjectOverview";
import type { Project } from "../../content/projects";

export function ProjectEntry({ project }: { project: Project }) {
  return <article className="catalog-entry" id={project.id} data-position>
    <div className="catalog-breadcrumb"><span lang="ru">Каталог файлов » Программы » </span>{project.category}</div>
    <h3><span className="file-symbol" aria-hidden="true">▤</span> {project.name}</h3>
    <div className="entry-content">
      <p className="entry-headline">{project.headline}</p>
      <p><b lang="ru">Описание: </b>{project.description}</p>
      <dl className="entry-meta"><div><dt lang="ru">Категория:</dt><dd>{project.category}</dd></div><div><dt lang="ru">Технологии:</dt><dd>{project.technologies.join(" · ")}</dd></div></dl>
      <details className="entry-details">
        <summary><span lang="ru">Подробнее</span><span className="sr-only"> — {project.name}</span></summary>
        <div className="entry-expanded">
          <ProjectOverview overview={project.overview} className="entry-case-facts" />
          {project.caseStudy && <><h4 lang="ru">Разбор кейса</h4><dl className="entry-case-facts"><div><dt lang="ru">Задача</dt><dd>{project.caseStudy.challenge}</dd></div><div><dt lang="ru">Моя роль</dt><dd>{project.caseStudy.ownership}</dd></div><div><dt lang="ru">Роль AI</dt><dd>{project.caseStudy.aiContribution}</dd></div><div><dt lang="ru">Результат</dt><dd>{project.caseStudy.delivery}</dd></div></dl></>}
          {project.journey && <><h4 lang="ru">От задачи к инструменту</h4><ol>{project.journey.map(step => <li key={step}>{step}</li>)}</ol></>}
          {project.features.length > 0 && <><h4 lang="ru">Возможности</h4><ul>{project.features.map(feature => <li key={feature}>{feature}</li>)}</ul></>}
          {!project.journey && !project.features.length && <><h4 lang="ru">Области проекта</h4><ul>{project.technologies.map(tech => <li key={tech}>{tech}</li>)}</ul></>}
          <h4 lang="ru">Материалы проекта</h4><ul>{project.links.map(link => <li key={link.url}><a href={link.url} target="_blank" rel="noreferrer">{link.label} ↗</a></li>)}</ul>
          <ProjectMediaGallery media={project.media} />
        </div>
      </details>
    </div>
    <footer className="entry-footer"><span lang="ru">Ссылки:</span>{project.links.map(link => <a className="catalog-button" key={link.url} href={link.url} target="_blank" rel="noreferrer">{link.label} <span aria-hidden="true">↗</span></a>)}</footer>
  </article>;
}
