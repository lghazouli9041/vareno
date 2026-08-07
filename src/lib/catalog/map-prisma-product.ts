import type {
  Category,
  Collection,
  Product,
  ProductImage,
  Variant,
} from "@prisma/client";
import type { CatalogAvailability, CatalogProduct } from "@/types/catalog";
import { FINISH_HEX, FINISH_MOOD_IMAGES } from "@/lib/catalog/finish-gallery";

export type PrismaProductBundle = Product & {
  category: Category;
  collection: Collection | null;
  variants: Variant[];
  images: ProductImage[];
};

type Specs = {
  height?: string;
  spoutReach?: string;
  spoutHeight?: string;
  maxDeckThickness?: string;
  warranty?: string;
  seoTitle?: string;
  seoDescription?: string;
  availability?: CatalogAvailability;
};

function readSpecs(value: unknown): Specs {
  if (!value || typeof value !== "object") return {};
  return value as Specs;
}

export function mapPrismaProductToCatalog(
  product: PrismaProductBundle,
): CatalogProduct {
  const specs = readSpecs(product.specifications);
  const primaryImage =
    product.images.find((image) => image.isPrimary)?.url ??
    product.images[0]?.url ??
    "/brand/monogram.svg";
  const gallery = product.images
    .filter((image) => image.url !== primaryImage)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((image) => image.url);

  const finishOptions = product.variants.map((variant) => ({
    id: variant.id,
    name: variant.finishName,
    slug: variant.finishSlug,
    hex: FINISH_HEX[variant.finishSlug] ?? "#B68D40",
    sku: variant.sku,
    price: Number(variant.price),
    available: variant.inStock && variant.inventory > 0,
    images: FINISH_MOOD_IMAGES[variant.finishSlug] ?? [],
  }));

  const availability: CatalogAvailability =
    specs.availability ??
    (finishOptions.some((finish) => finish.available)
      ? "in_stock"
      : "out_of_stock");

  return {
    id: product.id,
    slug: product.slug,
    collection: product.collection?.slug ?? "signature",
    name: product.name,
    category:
      product.category.slug === "kitchen" ? "kitchen" : "bathroom",
    finishOptions,
    price: Number(product.basePrice),
    sku: product.variants[0]?.sku ?? product.slug.toUpperCase(),
    shortDescription: product.tagline,
    marketingDescription: product.description,
    seoTitle: specs.seoTitle ?? `${product.name} | VARENO`,
    seoDescription: specs.seoDescription ?? product.tagline,
    featuredImage: primaryImage,
    gallery,
    dimensions: {
      height: specs.height ?? "",
      spoutReach: specs.spoutReach ?? "",
      spoutHeight: specs.spoutHeight,
      maxDeckThickness: specs.maxDeckThickness,
    },
    material: product.material ?? "Solid brass with PVD finish",
    warranty: specs.warranty ?? "Limited lifetime warranty",
    availability,
  };
}
