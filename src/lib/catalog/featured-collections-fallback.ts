import type { FeaturedCollectionCard } from "@/types/catalog";

/**
 * Static homepage featured-collection cards — used only when Prisma is
 * unavailable or the collections table is empty.
 */
export const featuredCollectionsFallback: FeaturedCollectionCard[] = [
  {
    id: "kitchen",
    title: "Kitchen Collection",
    description: "Luxury kitchen faucets crafted for modern homes.",
    href: "/shop?collection=heritage",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d4046?w=1600&q=85",
    imageAlt: "Luxury modern kitchen with premium fixtures and natural light",
  },
  {
    id: "bathroom",
    title: "Bathroom Collection",
    description: "Elegant fixtures inspired by contemporary architecture.",
    href: "/shop?collection=signature",
    image:
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1600&q=85",
    imageAlt: "Contemporary luxury bathroom with sculptural fixtures",
  },
  {
    id: "architect",
    title: "Architect Series",
    description: "Designed for luxury residential and commercial projects.",
    href: "/shop?collection=imperial",
    image:
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1600&q=85",
    imageAlt: "High-end architectural interior with refined material palette",
  },
];

/** Default cover images keyed by catalog collection slug (seed + fallback). */
export const collectionCoverBySlug: Record<string, string> = {
  heritage:
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1600&q=85",
  signature:
    "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=1600&q=85",
  imperial:
    "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1600&q=85",
  atelier:
    "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1600&q=85",
  element:
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d4046?w=1600&q=85",
};
