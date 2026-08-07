import type { CatalogFinishOption, CatalogProduct } from "@/types/catalog";

/** Curated mood photography when a finish has no dedicated images. */
export const FINISH_MOOD_IMAGES: Record<string, string[]> = {
  "polished-brass": [
    "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=1600&q=90",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1600&q=90",
  ],
  "antique-brass": [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=90",
    "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1600&q=90",
  ],
  "aged-brass": [
    "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1600&q=90",
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1600&q=90",
  ],
  "matte-black": [
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=90",
    "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1600&q=90",
  ],
  chrome: [
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d4046?w=1600&q=90",
    "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1600&q=90",
  ],
  // Legacy slug aliases
  "brushed-gold": [
    "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=1600&q=90",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1600&q=90",
  ],
  "satin-brass": [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=90",
  ],
  "polished-chrome": [
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d4046?w=1600&q=90",
  ],
  "brushed-nickel": [
    "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1600&q=90",
  ],
  gunmetal: [
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=90",
  ],
};

export const FINISH_HEX: Record<string, string> = {
  "polished-brass": "#C5A45A",
  "antique-brass": "#9A7B3C",
  "aged-brass": "#7A6236",
  "matte-black": "#1A1A1A",
  chrome: "#D4D4D4",
  "brushed-gold": "#C5A45A",
  "satin-brass": "#B8954A",
  "polished-chrome": "#D4D4D4",
  "brushed-nickel": "#A8A29A",
  gunmetal: "#3A3D42",
};

/** Gallery for the selected finish — finish mood first, then product photography. */
export function resolveProductGallery(
  product: CatalogProduct,
  finish?: CatalogFinishOption | null,
): string[] {
  const productImages = [product.featuredImage, ...product.gallery].filter(
    Boolean,
  );
  if (!finish) return Array.from(new Set(productImages));

  const finishImages =
    finish.images && finish.images.length > 0
      ? finish.images
      : (FINISH_MOOD_IMAGES[finish.slug] ?? []);

  return Array.from(new Set([...finishImages, ...productImages]));
}
