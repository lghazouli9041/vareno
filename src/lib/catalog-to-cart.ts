import type { CatalogFinishOption, CatalogProduct } from "@/types/catalog";
import type { Product } from "@/types";

/** Map catalog product + finish into the cart Product shape (unchanged contract). */
export function catalogToCartProduct(
  product: CatalogProduct,
  finish: CatalogFinishOption,
  collectionName?: string,
): Product {
  return {
    id: `${product.id}-${finish.id}`,
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
    bestSeller: false,
    newArrival: false,
    rating: 4.9,
    reviewCount: 24,
    basePrice: product.price,
    price: finish.price,
    finish: finish.name,
    inStock: finish.available && product.availability !== "out_of_stock",
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
