import { prisma } from "@/lib/prisma";
import {
  mapPrismaProductToCatalog,
  type PrismaProductBundle,
} from "@/lib/catalog/map-prisma-product";
import { catalogProducts } from "@/constants/catalog-products";
import { catalogCollections } from "@/constants/catalog-collections";
import {
  collectionCoverBySlug,
  featuredCollectionsFallback,
} from "@/lib/catalog/featured-collections-fallback";
import type {
  CatalogCategory,
  CatalogCollection,
  CatalogProduct,
  FeaturedCollectionCard,
} from "@/types/catalog";

export const productInclude = {
  category: true,
  collection: true,
  variants: true,
  images: { orderBy: { sortOrder: "asc" as const } },
} as const;

async function safeDb<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.error("Catalog DB query failed, using static fallback:", error);
    return fallback;
  }
}

function mapRows(rows: PrismaProductBundle[]): CatalogProduct[] {
  return rows.map((row) => mapPrismaProductToCatalog(row));
}

function staticById(id: string): CatalogProduct | null {
  return catalogProducts.find((item) => item.id === id) ?? null;
}

function staticBySlug(slug: string): CatalogProduct | null {
  return catalogProducts.find((item) => item.slug === slug) ?? null;
}

export async function getCatalogProductsAsync(): Promise<CatalogProduct[]> {
  return safeDb(async () => {
    const rows = await prisma.product.findMany({
      where: { status: { in: ["ACTIVE", "DRAFT"] } },
      include: productInclude,
      orderBy: { updatedAt: "desc" },
    });
    if (!rows.length) return catalogProducts;
    return mapRows(rows as PrismaProductBundle[]);
  }, catalogProducts);
}

export async function getActiveCatalogProductsAsync(): Promise<
  CatalogProduct[]
> {
  return safeDb(async () => {
    const rows = await prisma.product.findMany({
      where: { status: "ACTIVE" },
      include: productInclude,
      orderBy: { updatedAt: "desc" },
    });
    if (!rows.length) {
      return catalogProducts.filter((p) => p.availability !== "out_of_stock");
    }
    return mapRows(rows as PrismaProductBundle[]);
  }, catalogProducts.filter((p) => p.availability !== "out_of_stock"));
}

export async function getCatalogProductBySlugAsync(
  slug: string,
): Promise<CatalogProduct | null> {
  return safeDb(async () => {
    const row = await prisma.product.findUnique({
      where: { slug },
      include: productInclude,
    });
    if (!row) return staticBySlug(slug);
    return mapPrismaProductToCatalog(row as PrismaProductBundle);
  }, staticBySlug(slug));
}

export async function getCatalogProductByIdAsync(
  id: string,
): Promise<CatalogProduct | null> {
  return safeDb(async () => {
    const row = await prisma.product.findUnique({
      where: { id },
      include: productInclude,
    });
    if (row) return mapPrismaProductToCatalog(row as PrismaProductBundle);

    const variant = await prisma.variant.findFirst({
      where: { OR: [{ id }, { sku: id }] },
      select: { productId: true },
    });
    if (variant) {
      const byVariant = await prisma.product.findUnique({
        where: { id: variant.productId },
        include: productInclude,
      });
      if (byVariant) {
        return mapPrismaProductToCatalog(byVariant as PrismaProductBundle);
      }
    }

    return staticById(id) ?? staticBySlug(id);
  }, staticById(id) ?? staticBySlug(id));
}

export async function getCatalogProductsByIdsAsync(
  ids: string[],
): Promise<CatalogProduct[]> {
  const unique = [...new Set(ids.filter(Boolean))];
  if (!unique.length) return [];

  return safeDb(async () => {
    const rows = await prisma.product.findMany({
      where: { id: { in: unique } },
      include: productInclude,
    });
    const mapped = mapRows(rows as PrismaProductBundle[]);
    const byId = new Map(mapped.map((product) => [product.id, product]));

    return unique
      .map((id) => byId.get(id) ?? staticById(id))
      .filter((product): product is CatalogProduct => Boolean(product));
  }, unique
    .map((id) => staticById(id))
    .filter((product): product is CatalogProduct => Boolean(product)));
}

export async function getCatalogProductsBySlugsAsync(
  slugs: string[],
): Promise<CatalogProduct[]> {
  const unique = [...new Set(slugs.filter(Boolean))];
  if (!unique.length) return [];

  return safeDb(async () => {
    const rows = await prisma.product.findMany({
      where: { slug: { in: unique } },
      include: productInclude,
    });
    const mapped = mapRows(rows as PrismaProductBundle[]);
    const bySlug = new Map(mapped.map((product) => [product.slug, product]));

    return unique
      .map((slug) => bySlug.get(slug) ?? staticBySlug(slug))
      .filter((product): product is CatalogProduct => Boolean(product));
  }, unique
    .map((slug) => staticBySlug(slug))
    .filter((product): product is CatalogProduct => Boolean(product)));
}

export async function getCatalogCollectionsAsync(): Promise<
  CatalogCollection[]
> {
  return safeDb(async () => {
    const rows = await prisma.collection.findMany({
      orderBy: { name: "asc" },
    });
    if (!rows.length) return catalogCollections;
    return rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      tagline: row.tagline ?? "",
      description: row.description ?? "",
    }));
  }, catalogCollections);
}

export async function getCollectionNameMapAsync(): Promise<
  Record<string, string>
> {
  const collections = await getCatalogCollectionsAsync();
  return Object.fromEntries(
    collections.map((collection) => [collection.slug, collection.name]),
  );
}

export async function getRelatedByCollectionAsync(
  collectionSlug: string,
  excludeId?: string,
  limit = 4,
): Promise<CatalogProduct[]> {
  return safeDb(async () => {
    const rows = await prisma.product.findMany({
      where: {
        status: "ACTIVE",
        collection: { slug: collectionSlug },
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
      include: productInclude,
      take: limit,
      orderBy: { updatedAt: "desc" },
    });
    if (!rows.length) {
      return catalogProducts
        .filter(
          (product) =>
            product.collection === collectionSlug && product.id !== excludeId,
        )
        .slice(0, limit);
    }
    return mapRows(rows as PrismaProductBundle[]);
  }, catalogProducts
    .filter(
      (product) =>
        product.collection === collectionSlug && product.id !== excludeId,
    )
    .slice(0, limit));
}

export async function getFeaturedCatalogProductsAsync(
  limit = 8,
): Promise<CatalogProduct[]> {
  return safeDb(async () => {
    const rows = await prisma.product.findMany({
      where: { status: "ACTIVE", featured: true },
      include: productInclude,
      take: limit,
      orderBy: { updatedAt: "desc" },
    });
    if (!rows.length) {
      return catalogProducts.slice(0, limit);
    }
    return mapRows(rows as PrismaProductBundle[]);
  }, catalogProducts.slice(0, limit));
}

export async function getBestSellerCatalogProductsAsync(
  limit = 4,
): Promise<CatalogProduct[]> {
  return safeDb(async () => {
    let rows = await prisma.product.findMany({
      where: { status: "ACTIVE", bestSeller: true },
      include: productInclude,
      take: limit,
      orderBy: { updatedAt: "desc" },
    });
    if (!rows.length) {
      rows = await prisma.product.findMany({
        where: { status: "ACTIVE", featured: true },
        include: productInclude,
        take: limit,
        orderBy: { updatedAt: "desc" },
      });
    }
    if (!rows.length) {
      rows = await prisma.product.findMany({
        where: { status: "ACTIVE" },
        include: productInclude,
        take: limit,
        orderBy: { updatedAt: "desc" },
      });
    }
    if (!rows.length) return catalogProducts.slice(0, limit);
    return mapRows(rows as PrismaProductBundle[]);
  }, catalogProducts.slice(0, limit));
}

export async function getCatalogByCategoryAsync(
  category: CatalogCategory,
): Promise<CatalogProduct[]> {
  return safeDb(async () => {
    const rows = await prisma.product.findMany({
      where: {
        status: "ACTIVE",
        category: { slug: category },
      },
      include: productInclude,
      orderBy: { name: "asc" },
    });
    if (!rows.length) {
      return catalogProducts.filter((product) => product.category === category);
    }
    return mapRows(rows as PrismaProductBundle[]);
  }, catalogProducts.filter((product) => product.category === category));
}

/** Database-backed product search — falls back to static contains match. */
export async function searchCatalogProductsAsync(
  query: string,
): Promise<CatalogProduct[]> {
  const q = query.trim();
  if (!q) return getCatalogProductsAsync();

  const staticFilter = () => {
    const lower = q.toLowerCase();
    return catalogProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(lower) ||
        product.shortDescription.toLowerCase().includes(lower) ||
        product.sku.toLowerCase().includes(lower),
    );
  };

  return safeDb(async () => {
    const rows = await prisma.product.findMany({
      where: {
        status: "ACTIVE",
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { tagline: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
          { slug: { contains: q, mode: "insensitive" } },
          {
            variants: {
              some: {
                OR: [
                  { sku: { contains: q, mode: "insensitive" } },
                  { finishName: { contains: q, mode: "insensitive" } },
                ],
              },
            },
          },
        ],
      },
      include: productInclude,
      take: 48,
    });
    if (!rows.length) return staticFilter();
    return mapRows(rows as PrismaProductBundle[]);
  }, staticFilter());
}

export async function getAdminCatalogProductsAsync(): Promise<
  Array<
    CatalogProduct & {
      status: "active" | "draft" | "archived";
      stock: number;
      updatedAt: string;
    }
  >
> {
  return safeDb(async () => {
    const rows = await prisma.product.findMany({
      include: productInclude,
      orderBy: { updatedAt: "desc" },
    });
    if (!rows.length) {
      return catalogProducts.map((product) => ({
        ...product,
        status: "active" as const,
        stock:
          product.availability === "out_of_stock"
            ? 0
            : product.availability === "made_to_order"
              ? 8
              : 24,
        updatedAt: new Date().toISOString(),
      }));
    }

    return (rows as PrismaProductBundle[]).map((row) => {
      const catalog = mapPrismaProductToCatalog(row);
      const stock = row.variants.reduce(
        (sum, variant) => sum + variant.inventory,
        0,
      );
      const status =
        row.status === "ACTIVE"
          ? ("active" as const)
          : row.status === "DRAFT"
            ? ("draft" as const)
            : ("archived" as const);
      return {
        ...catalog,
        status,
        stock,
        updatedAt: row.updatedAt.toISOString(),
      };
    });
  }, catalogProducts.map((product) => ({
    ...product,
    status: "active" as const,
    stock:
      product.availability === "out_of_stock"
        ? 0
        : product.availability === "made_to_order"
          ? 8
          : 24,
    updatedAt: new Date().toISOString(),
  })));
}

export async function countCatalogProductsAsync(): Promise<number> {
  return safeDb(async () => {
    const count = await prisma.product.count();
    return count || catalogProducts.length;
  }, catalogProducts.length);
}

/**
 * Homepage featured collection cards from Prisma (static fallback when DB is down).
 */
export async function getFeaturedHomeCollectionsAsync(
  limit = 3,
): Promise<FeaturedCollectionCard[]> {
  return safeDb(async () => {
    const include = {
      products: {
        where: { status: "ACTIVE" as const },
        take: 1,
        include: {
          images: {
            orderBy: { sortOrder: "asc" as const },
            take: 1,
          },
        },
      },
    };

    let rows = await prisma.collection.findMany({
      where: { featured: true },
      include,
      orderBy: { name: "asc" },
      take: limit,
    });

    if (!rows.length) {
      rows = await prisma.collection.findMany({
        include,
        orderBy: { name: "asc" },
        take: limit,
      });
    }

    if (!rows.length) {
      return featuredCollectionsFallback.slice(0, limit);
    }

    return rows.map((row) => {
      const productImage = row.products[0]?.images[0]?.url;
      const image =
        row.coverImage ||
        productImage ||
        collectionCoverBySlug[row.slug] ||
        featuredCollectionsFallback[0]?.image ||
        "/brand/monogram.svg";

      return {
        id: row.id,
        title: row.name,
        description: row.tagline || row.description || row.name,
        href: `/shop?collection=${encodeURIComponent(row.slug)}`,
        image,
        imageAlt: `${row.name} — VARENO architectural faucets`,
      };
    });
  }, featuredCollectionsFallback.slice(0, limit));
}

/**
 * Resolve a cart/checkout product id which may be:
 * - product id
 * - variant id / sku
 * - composite `${productId}-${variantId}` from catalogToCartProduct
 */
export async function resolveCheckoutCatalogProductAsync(
  productId: string,
): Promise<CatalogProduct | null> {
  const direct = await getCatalogProductByIdAsync(productId);
  if (direct) return direct;

  const staticComposite = (): CatalogProduct | null => {
    for (const product of catalogProducts) {
      if (product.id === productId) return product;
      for (const finish of product.finishOptions) {
        if (
          finish.id === productId ||
          finish.sku === productId ||
          `${product.id}-${finish.id}` === productId
        ) {
          return product;
        }
      }
    }
    return null;
  };

  return safeDb(async () => {
    const variants = await prisma.variant.findMany({
      select: { id: true, productId: true, sku: true },
    });
    const hit = variants.find(
      (variant) =>
        variant.id === productId ||
        variant.sku === productId ||
        `${variant.productId}-${variant.id}` === productId ||
        productId.endsWith(`-${variant.id}`),
    );
    if (!hit) return staticComposite();
    return getCatalogProductByIdAsync(hit.productId);
  }, staticComposite());
}
