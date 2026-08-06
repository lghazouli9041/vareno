import { resolveCatalogProductsBySlugsAction } from "@/features/catalog/actions";
import type { CatalogProduct } from "@/types/catalog";

export const RECENTLY_VIEWED_KEY = "hajamed-recently-viewed";
const MAX_RECENT = 12;

export function readRecentlyViewedSlugs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECENTLY_VIEWED_KEY);
    const slugs = raw ? (JSON.parse(raw) as string[]) : [];
    return Array.isArray(slugs) ? slugs.filter((s) => typeof s === "string") : [];
  } catch {
    return [];
  }
}

export function trackRecentlyViewed(slug: string): string[] {
  const next = [
    slug,
    ...readRecentlyViewedSlugs().filter((item) => item !== slug),
  ].slice(0, MAX_RECENT);
  try {
    window.localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(next));
  } catch {
    // Ignore quota / private mode failures.
  }

  if (typeof window !== "undefined") {
    void import("@/features/commerce/actions")
      .then((mod) => mod.trackRecentlyViewedAction(slug))
      .catch(() => undefined);
  }

  return next;
}

export function mergeRecentlyViewedSlugs(remoteSlugs: string[]): string[] {
  const merged = [
    ...remoteSlugs,
    ...readRecentlyViewedSlugs().filter((slug) => !remoteSlugs.includes(slug)),
  ].slice(0, MAX_RECENT);
  try {
    window.localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(merged));
  } catch {
    // ignore
  }
  return merged;
}

/** Resolve recently viewed slugs against Prisma catalog (static fallback inside action). */
export async function getRecentlyViewedProductsAsync(
  excludeSlug?: string,
): Promise<CatalogProduct[]> {
  const slugs = readRecentlyViewedSlugs().filter((slug) => slug !== excludeSlug);
  if (!slugs.length) return [];
  const result = await resolveCatalogProductsBySlugsAction(slugs);
  return result.products;
}
