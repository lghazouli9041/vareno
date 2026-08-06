import type { CatalogCollection, CatalogProduct } from "@/types/catalog";
import type { Product } from "@/types";

/** Map a catalog product into the legacy Product shape (cart / best-seller cards). */
export function catalogToLegacyProduct(
  product: CatalogProduct,
  collectionName?: string,
): Product {
  const finish = product.finishOptions[0];
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    tagline: product.shortDescription,
    description: product.marketingDescription,
    category: product.category,
    collectionSlug: product.collection,
    collectionName: collectionName ?? product.collection,
    style: "Architectural",
    installationType: "Varies",
    material: product.material,
    status: "ACTIVE",
    featured: true,
    bestSeller: true,
    newArrival: false,
    rating: 4.9,
    reviewCount: 24,
    basePrice: product.price,
    price: finish?.price ?? product.price,
    finish: finish?.name ?? "Standard",
    inStock: product.availability !== "out_of_stock",
    images: [product.featuredImage, ...product.gallery],
    variants: product.finishOptions.map((option) => ({
      id: option.id,
      sku: option.sku,
      finish: option.slug as Product["variants"][number]["finish"],
      finishName: option.name,
      price: option.price,
      inStock: option.available,
      inventory: option.available ? 12 : 0,
      images: [],
    })),
    features: [],
    specifications: [
      { label: "Height", value: product.dimensions.height },
      { label: "Spout reach", value: product.dimensions.spoutReach },
      { label: "Material", value: product.material },
      { label: "Warranty", value: product.warranty },
    ],
    downloads: [],
  };
}

export function collectionNameFromList(
  collections: CatalogCollection[],
  slug: string,
): string {
  return collections.find((item) => item.slug === slug)?.name ?? slug;
}
