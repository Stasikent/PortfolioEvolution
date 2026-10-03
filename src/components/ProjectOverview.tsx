import { useMemo } from "react";
import type { ProjectOverview as Overview } from "../content/projects";
import { useTranslations } from "../core/TranslationProvider";

export function ProjectOverview({ overview, className, translationPrefix = "project" }: { overview?: Overview; className: string; translationPrefix?: string }) {
  const entries = useMemo(() => {
    if (!overview) return {};
    const result: Record<string, string> = {
      [`${translationPrefix}.overview.labels.purpose`]: "Purpose",
      [`${translationPrefix}.overview.labels.approach`]: "Approach",
      [`${translationPrefix}.overview.labels.role`]: "My role",
      [`${translationPrefix}.overview.labels.explore`]: "Explore",
      [`${translationPrefix}.overview.labels.status`]: "Status",
      [`${translationPrefix}.overview.purpose`]: overview.purpose,
      [`${translationPrefix}.overview.approach`]: overview.approach,
      [`${translationPrefix}.overview.evidence`]: overview.evidence,
    };
    if (overview.ownership) result[`${translationPrefix}.overview.ownership`] = overview.ownership;
    if (overview.status) result[`${translationPrefix}.overview.status`] = overview.status;
    return result;
  }, [overview, translationPrefix]);
  const { t } = useTranslations(entries);
  if (!overview) return null;
  return <dl className={className}>
    <div><dt>{t(`${translationPrefix}.overview.labels.purpose`, "Purpose")}</dt><dd>{t(`${translationPrefix}.overview.purpose`, overview.purpose)}</dd></div>
    <div><dt>{t(`${translationPrefix}.overview.labels.approach`, "Approach")}</dt><dd>{t(`${translationPrefix}.overview.approach`, overview.approach)}</dd></div>
    {overview.ownership && <div><dt>{t(`${translationPrefix}.overview.labels.role`, "My role")}</dt><dd>{t(`${translationPrefix}.overview.ownership`, overview.ownership)}</dd></div>}
    <div><dt>{t(`${translationPrefix}.overview.labels.explore`, "Explore")}</dt><dd>{t(`${translationPrefix}.overview.evidence`, overview.evidence)}</dd></div>
    {overview.status && <div><dt>{t(`${translationPrefix}.overview.labels.status`, "Status")}</dt><dd>{t(`${translationPrefix}.overview.status`, overview.status)}</dd></div>}
  </dl>;
}
