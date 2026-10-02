import { projects } from "../content/projects";
import type { ImplementedEra } from "./EraProvider";

export type LogicalSection = "home" | "about" | "projects" | "story" | "skills" | "process" | "contact";
export type LogicalPosition = LogicalSection | `project:${string}`;

const sectionAnchors = {
  2002: { home: "home", about: "about", projects: "projects", story: "story", skills: "skills", process: "process", contact: "contact" },
  2006: { home: "home", about: "about", projects: "projects", story: "story", skills: "skills", process: "process", contact: "contact" },
  2009: { home: "home", about: "about", projects: "projects", story: "story", skills: "skills", process: "process", contact: "contact" },
  2013: { home: "home", about: "about", projects: "projects", story: "story", skills: "skills", process: "process", contact: "contact" },
  2026: { home: "home", about: "about", projects: "projects", story: "story", skills: "skills", process: "process", contact: "contact" },
} satisfies Record<ImplementedEra, Record<LogicalSection, string>>;

export function positionAnchors(era: ImplementedEra): [LogicalPosition, string][] {
  return [
    ...Object.entries(sectionAnchors[era]) as [LogicalSection, string][],
    ...projects.map(project => [`project:${project.id}`, project.id] as [LogicalPosition, string]),
  ];
}

export function targetFor(era: ImplementedEra, position: LogicalPosition) {
  const id = positionAnchors(era).find(([key]) => key === position)?.[1];
  return (id ? document.getElementById(id) : null)
    ?? document.getElementById(position.startsWith("project:") ? "projects" : "home");
}

export function targetScrollTop(element: HTMLElement) {
  const margin = parseFloat(getComputedStyle(element).scrollMarginTop) || 0;
  const maximum = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  return Math.max(0, Math.min(maximum, window.scrollY + element.getBoundingClientRect().top - margin));
}

export function readPosition(era: ImplementedEra): LogicalPosition {
  const anchors = positionAnchors(era).flatMap(([position, id]) => {
    const element = document.getElementById(id);
    return element ? [{ position, element, top: element.getBoundingClientRect().top }] : [];
  }).sort((a, b) => a.top - b.top);

  // A native anchor can be clamped at the page bottom, above the reading line.
  const linked = anchors.find(({ element }) => `#${element.id}` === window.location.hash);
  if (linked && Math.abs(window.scrollY - targetScrollTop(linked.element)) < 2) return linked.position;

  const atBottom = window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
  return anchors.filter(({ top }) => top <= (atBottom ? window.innerHeight - 1 : 160)).at(-1)?.position ?? "home";
}
