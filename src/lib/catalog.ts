import type {
  CatalogAvailability,
  CatalogCategory,
  CatalogCollection,
  CatalogProduct,
} from "@/types/catalog";

export type CatalogQuery = {
  collection?: string;
  category?: CatalogCategory;
  availability?: CatalogAvailability;
  finishSlug?: string;
};

/**
 * Sync catalog helpers are intentionally removed from the hot path.
 * Prefer async repository exports below. Static constants remain only as DB fallbacks.
 */
export type { CatalogCollection, CatalogProduct };

/** Async Prisma-backed catalog accessors (static fallback when DB is unavailable). */
export {
  getCatalogProductsAsync,
  getActiveCatalogProductsAsync,
  getCatalogProductBySlugAsync,
  getCatalogProductByIdAsync,
  getCatalogProductsByIdsAsync,
  getCatalogProductsBySlugsAsync,
  getCatalogCollectionsAsync,
  getCollectionNameMapAsync,
  getRelatedByCollectionAsync,
  getFeaturedCatalogProductsAsync,
  getBestSellerCatalogProductsAsync,
  getCatalogByCategoryAsync,
  searchCatalogProductsAsync,
  getAdminCatalogProductsAsync,
  countCatalogProductsAsync,
  getFeaturedHomeCollectionsAsync,
} from "@/lib/catalog/repository";
