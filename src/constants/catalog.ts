export const FINISHES = [
  { slug: "brushed-gold", name: "Brushed Gold", hex: "#C9A14A" },
  { slug: "matte-black", name: "Matte Black", hex: "#1A1A1A" },
  { slug: "polished-chrome", name: "Polished Chrome", hex: "#C8C8C8" },
  { slug: "brushed-nickel", name: "Brushed Nickel", hex: "#A8A29A" },
  { slug: "polished-brass", name: "Polished Brass", hex: "#B8860B" },
  { slug: "satin-bronze", name: "Satin Bronze", hex: "#8B6914" },
] as const;

export const CATEGORIES = [
  { slug: "kitchen", name: "Kitchen Faucets", href: "/kitchen-faucets" },
  { slug: "bathroom", name: "Bathroom Faucets", href: "/bathroom-faucets" },
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
