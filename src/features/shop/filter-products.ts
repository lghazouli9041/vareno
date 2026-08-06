import type {
  CatalogAvailability,
  CatalogCategory,
  CatalogProduct,
} from "@/types/catalog";
import {
  COLOR_FILTERS,
  featuredRank,
  isBestSeller,
  isNewArrival,
  popularityScore,
  type ColorFilterId,
} from "@/features/shop/product-flags";

export type ShopSort =
  | "featured"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "popular"
  | "name-asc";

export type ShopViewMode = "grid" | "list";

export type ShopFiltersState = {
  query: string;
  collections: string[];
  categories: CatalogCategory[];
  finishes: string[];
  colors: ColorFilterId[];
  minPrice: number;
  maxPrice: number;
  availability: CatalogAvailability[];
  newArrivals: boolean;
  bestSellers: boolean;
};

export const DEFAULT_SHOP_FILTERS: ShopFiltersState = {
  query: "",
  collections: [],
  categories: [],
  finishes: [],
  colors: [],
  minPrice: 0,
  maxPrice: 6000,
  availability: [],
  newArrivals: false,
  bestSellers: false,
};

export const PAGE_SIZE = 8;

function matchesColor(product: CatalogProduct, colors: ColorFilterId[]) {
  if (colors.length === 0) return true;
  const allowed = new Set<string>(
    COLOR_FILTERS.filter((c) => colors.includes(c.id)).flatMap((c) => [
      ...c.finishSlugs,
    ]),
  );
  return product.finishOptions.some(
    (finish) => finish.available && allowed.has(finish.slug),
  );
}

export function filterAndSortProducts(
  products: CatalogProduct[],
  filters: ShopFiltersState,
  sort: ShopSort,
): CatalogProduct[] {
  const q = filters.query.trim().toLowerCase();

  let result = products.filter((product) => {
    if (q) {
      const haystack = [
        product.name,
        product.shortDescription,
        product.collection,
        product.sku,
        ...product.finishOptions.map((f) => f.name),
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    if (
      filters.collections.length > 0 &&
      !filters.collections.includes(product.collection)
    ) {
      return false;
    }

    if (
      filters.categories.length > 0 &&
      !filters.categories.includes(product.category)
    ) {
      return false;
    }

    if (
      filters.finishes.length > 0 &&
      !product.finishOptions.some(
        (finish) =>
          finish.available && filters.finishes.includes(finish.slug),
      )
    ) {
      return false;
    }

    if (!matchesColor(product, filters.colors)) return false;

    if (product.price < filters.minPrice || product.price > filters.maxPrice) {
      return false;
    }

    if (
      filters.availability.length > 0 &&
      !filters.availability.includes(product.availability)
    ) {
      return false;
    }

    if (filters.newArrivals && !isNewArrival(product)) return false;
    if (filters.bestSellers && !isBestSeller(product)) return false;

    return true;
  });

  switch (sort) {
    case "price-asc":
      result = [...result].sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result = [...result].sort((a, b) => b.price - a.price);
      break;
    case "name-asc":
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "newest":
      result = [...result].sort((a, b) => {
        const aNew = isNewArrival(a) ? 0 : 1;
        const bNew = isNewArrival(b) ? 0 : 1;
        if (aNew !== bNew) return aNew - bNew;
        return b.slug.localeCompare(a.slug);
      });
      break;
    case "popular":
      result = [...result].sort(
        (a, b) => popularityScore(b) - popularityScore(a),
      );
      break;
    case "featured":
    default:
      result = [...result].sort((a, b) => featuredRank(a) - featuredRank(b));
      break;
  }

  return result;
}

export function highlightMatch(text: string, query: string): string[] {
  const q = query.trim();
  if (!q) return [text];
  const lower = text.toLowerCase();
  const needle = q.toLowerCase();
  const parts: string[] = [];
  let cursor = 0;
  let index = lower.indexOf(needle, cursor);
  while (index !== -1) {
    if (index > cursor) parts.push(text.slice(cursor, index));
    parts.push(text.slice(index, index + needle.length));
    cursor = index + needle.length;
    index = lower.indexOf(needle, cursor);
  }
  if (cursor < text.length) parts.push(text.slice(cursor));
  return parts.length ? parts : [text];
}

export function countActiveFilters(filters: ShopFiltersState): number {
  let count = 0;
  if (filters.query.trim()) count += 1;
  count += filters.collections.length;
  count += filters.categories.length;
  count += filters.finishes.length;
  count += filters.colors.length;
  count += filters.availability.length;
  if (filters.newArrivals) count += 1;
  if (filters.bestSellers) count += 1;
  if (filters.minPrice > 0 || filters.maxPrice < 6000) count += 1;
  return count;
}
