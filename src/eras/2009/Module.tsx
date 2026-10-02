import type { ReactNode } from "react";

export function Module({ title, icon = "◆", children, className = "" }: {
  title: string;
  icon?: string;
  children: ReactNode;
  className?: string;
}) {
  return <section className={`catalog-module ${className}`}>
    <h2 className="module-title" lang="ru"><span aria-hidden="true">{icon}</span> {title}</h2>
    <div className="module-body">{children}</div>
  </section>;
}
