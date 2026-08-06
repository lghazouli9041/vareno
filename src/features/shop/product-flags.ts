import type { CatalogProduct } from "@/types/catalog";

/**
 * Shop presentation flags — derived outside the CatalogProduct model
 * so the product data contract stays unchanged.
 */
const BEST_SELLER_SLUGS = new Set([
  "signature-eclipse-kitchen",
  "signature-nova-single",
  "heritage-arbour-bridge",
  "imperial-sovereign-tub",
  "atelier-line-minimal",
  "element-axis-kitchen",
]);

const NEW_ARRIVAL_SLUGS = new Set([
  "atelier-folio-wall",
  "atelier-vector-kitchen",
  "atelier-caliper-widespread",
  "element-halo-centerset",
  "element-drift-wall",
  "imperial-monarch-kitchen",
]);

const FEATURED_ORDER = [
  "signature-eclipse-kitchen",
  "imperial-sovereign-tub",
  "heritage-arbour-bridge",
  "atelier-line-minimal",
  "signature-atria-widespread",
  "element-axis-kitchen",
];

export function isBestSeller(product: CatalogProduct): boolean {
  return BEST_SELLER_SLUGS.has(product.slug);
}

export function isNewArrival(product: CatalogProduct): boolean {
  return NEW_ARRIVAL_SLUGS.has(product.slug);
}

export function featuredRank(product: CatalogProduct): number {
  const index = FEATURED_ORDER.indexOf(product.slug);
  return index === -1 ? FEATURED_ORDER.length + 1 : index;
}

export function popularityScore(product: CatalogProduct): number {
  let score = 0;
  if (isBestSeller(product)) score += 100;
  if (isNewArrival(product)) score += 40;
  if (product.availability === "in_stock") score += 20;
  score += Math.min(product.finishOptions.filter((f) => f.available).length, 6);
  return score;
}

/** Color families for shop filter (maps to finish slugs). */
export const COLOR_FILTERS = [
  {
    id: "gold",
    label: "Gold / Brass",
    finishSlugs: ["brushed-gold", "satin-brass"],
  },
  {
    id: "black",
    label: "Black / Dark",
    finishSlugs: ["matte-black", "gunmetal"],
  },
  {
    id: "chrome",
    label: "Chrome",
    finishSlugs: ["polished-chrome"],
  },
  {
    id: "nickel",
    label: "Nickel",
    finishSlugs: ["brushed-nickel"],
  },
] as const;

export type ColorFilterId = (typeof COLOR_FILTERS)[number]["id"];
