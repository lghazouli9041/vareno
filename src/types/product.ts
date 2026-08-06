import type { CategorySlug, FinishSlug } from "@/constants/catalog";

export type ProductStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  isPrimary?: boolean;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  sku: string;
  finish: FinishSlug;
  finishName: string;
  price: number;
  compareAtPrice?: number;
  inStock: boolean;
  inventory: number;
  images: ProductImage[];
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface ProductDownload {
  label: string;
  url: string;
  type: "spec-sheet" | "installation" | "cad" | "warranty" | "other";
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: CategorySlug;
  collectionSlug: string;
  collectionName: string;
  style: string;
  installationType: string;
  material: string;
  status: ProductStatus;
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  rating: number;
  reviewCount: number;
  basePrice: number;
  variants: ProductVariant[];
  features: string[];
  specifications: ProductSpecification[];
  downloads: ProductDownload[];
  /** Primary gallery — derived from default variant when available */
  images: string[];
  /** Default finish display name for cards */
  finish: string;
  price: number;
  compareAtPrice?: number;
  inStock: boolean;
}

export interface ProductFilters {
  category?: CategorySlug | CategorySlug[];
  finish?: FinishSlug | FinishSlug[];
  collection?: string | string[];
  installationType?: string | string[];
  material?: string | string[];
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  minRating?: number;
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  query?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
