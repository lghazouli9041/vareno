export const FINISHES = [
  { slug: "polished-brass", name: "Polished Brass", hex: "#C5A45A" },
  { slug: "antique-brass", name: "Antique Brass", hex: "#9A7B3C" },
  { slug: "aged-brass", name: "Aged Brass", hex: "#7A6236" },
  { slug: "matte-black", name: "Matte Black", hex: "#1A1A1A" },
  { slug: "chrome", name: "Chrome", hex: "#D4D4D4" },
  // Legacy aliases still referenced in older data
  { slug: "brushed-gold", name: "Polished Brass", hex: "#C5A45A" },
  { slug: "polished-chrome", name: "Chrome", hex: "#D4D4D4" },
  { slug: "brushed-nickel", name: "Aged Brass", hex: "#7A6236" },
  { slug: "satin-brass", name: "Antique Brass", hex: "#9A7B3C" },
  { slug: "gunmetal", name: "Matte Black", hex: "#1A1A1A" },
] as const;

export const CATEGORIES = [
  { slug: "kitchen", name: "Kitchen Faucets", href: "/shop?category=kitchen" },
  { slug: "bathroom", name: "Bathroom Faucets", href: "/shop?category=bathroom" },
] as const;

export const INSTALLATION_TYPES = [
  "Deck Mount",
  "Wall Mount",
  "Floor Mount",
  "Widespread",
  "Single Hole",
  "Centerset",
] as const;

export const MATERIALS = [
  "Solid Brass",
  "Stainless Steel",
  "Zinc Alloy",
] as const;

export const PRODUCT_SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A–Z" },
  { value: "rating-desc", label: "Top Rated" },
] as const;

export type FinishSlug = (typeof FINISHES)[number]["slug"];
export type CategorySlug = (typeof CATEGORIES)[number]["slug"];
export type ProductSort = (typeof PRODUCT_SORT_OPTIONS)[number]["value"];
