"use server";

import {
  getAdminCatalogProductsAsync,
  getCatalogCollectionsAsync,
  getCatalogProductByIdAsync,
  getCatalogProductBySlugAsync,
  getCatalogProductsAsync,
  getCatalogProductsByIdsAsync,
  getCatalogProductsBySlugsAsync,
  getCollectionNameMapAsync,
} from "@/lib/catalog/repository";

export async function getCatalogSnapshotAction() {
  const [products, collections, collectionNames] = await Promise.all([
    getCatalogProductsAsync(),
    getCatalogCollectionsAsync(),
    getCollectionNameMapAsync(),
  ]);
  return { products, collections, collectionNames };
}

export async function resolveCatalogProductsByIdsAction(ids: string[]) {
  try {
    const products = await getCatalogProductsByIdsAsync(ids);
    return { ok: true as const, products };
  } catch {
    return { ok: false as const, products: [], error: "Unable to resolve products" };
  }
}

export async function resolveCatalogProductsBySlugsAction(slugs: string[]) {
  try {
    const products = await getCatalogProductsBySlugsAsync(slugs);
    return { ok: true as const, products };
  } catch {
    return { ok: false as const, products: [], error: "Unable to resolve products" };
  }
}

export async function resolveCatalogProductByIdAction(id: string) {
  try {
    const product = await getCatalogProductByIdAsync(id);
    return { ok: true as const, product };
  } catch {
    return { ok: false as const, product: null, error: "Unable to resolve product" };
  }
}

export async function resolveCatalogProductBySlugAction(slug: string) {
  try {
    const product = await getCatalogProductBySlugAsync(slug);
    return { ok: true as const, product };
  } catch {
    return { ok: false as const, product: null, error: "Unable to resolve product" };
  }
}

export async function listCatalogCollectionsAction() {
  try {
    const collections = await getCatalogCollectionsAsync();
    return { ok: true as const, collections };
  } catch {
    return { ok: false as const, collections: [], error: "Unable to load collections" };
  }
}

export async function listAdminCatalogProductsAction() {
  try {
    const products = await getAdminCatalogProductsAsync();
    return { ok: true as const, products };
  } catch {
    return { ok: false as const, products: [], error: "Unable to load products" };
  }
}
