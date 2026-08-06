/** VARENO catalog domain types — data foundation only. */

export type CatalogCategory = "kitchen" | "bathroom";

export type CatalogAvailability =
  | "in_stock"
  | "made_to_order"
  | "out_of_stock";

export type CatalogFinishOption = {
  id: string;
  name: string;
  slug: string;
  hex: string;
  sku: string;
  price: number;
  available: boolean;
};

export type CatalogDimensions = {
  height: string;
  spoutReach: string;
  spoutHeight?: string;
  maxDeckThickness?: string;
};

export type CatalogCollection = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
};

/** Homepage featured-collection card (visual contract for CollectionCard). */
export type FeaturedCollectionCard = {
  id: string;
  title: string;
  description: string;
  href: string;
  image: string;
  imageAlt: string;
};

export type CatalogProduct = {
  id: string;
  slug: string;
  collection: string;
  name: string;
  category: CatalogCategory;
  finishOptions: CatalogFinishOption[];
  price: number;
  sku: string;
  shortDescription: string;
  marketingDescription: string;
  seoTitle: string;
  seoDescription: string;
  featuredImage: string;
  gallery: string[];
  dimensions: CatalogDimensions;
  material: string;
  warranty: string;
  availability: CatalogAvailability;
};
