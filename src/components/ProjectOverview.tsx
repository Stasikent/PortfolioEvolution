import type { ProjectOverview as Overview } from "../content/projects";

export function ProjectOverview({ overview, className }: { overview?: Overview; className: string }) {
  if (!overview) return null;
  return <dl className={className}>
    <div><dt>Purpose</dt><dd>{overview.purpose}</dd></div>
    <div><dt>Approach</dt><dd>{overview.approach}</dd></div>
    {overview.ownership && <div><dt>My role</dt><dd>{overview.ownership}</dd></div>}
    <div><dt>Explore</dt><dd>{overview.evidence}</dd></div>
    {overview.status && <div><dt>Status</dt><dd>{overview.status}</dd></div>}
  </dl>;
}
