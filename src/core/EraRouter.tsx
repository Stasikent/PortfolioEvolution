import type { ComponentType } from "react";
import { useEra, type ImplementedEra } from "./EraProvider";
import { ModernPortfolio } from "../eras/2026/ModernPortfolio";
import { PortalPortfolio } from "../eras/2002/PortalPortfolio";
import { CatalogPortfolio } from "../eras/2009/CatalogPortfolio";
import { BlogPortfolio } from "../eras/2006/BlogPortfolio";
import { FlatPortfolio } from "../eras/2013/FlatPortfolio";
const renderers: Record<ImplementedEra, ComponentType> = {
  2002: PortalPortfolio,
  2006: BlogPortfolio,
  2009: CatalogPortfolio,
  2013: FlatPortfolio,
  2026: ModernPortfolio,
};
export function EraRouter() {
  const { era } = useEra();
  const Renderer = renderers[era];
  return <Renderer />;
}
