export type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
};

export const mainNavigation: NavItem[] = [
  { label: "Shop", href: "/shop" },
  {
    label: "Collections",
    href: "/collections",
    children: [
      { label: "All Collections", href: "/collections" },
      { label: "Kitchen Faucets", href: "/shop?category=kitchen" },
      { label: "Bathroom Faucets", href: "/shop?category=bathroom" },
      { label: "Shower Systems", href: "/shop?q=shower" },
      { label: "Accessories", href: "/shop?q=accessories" },
    ],
  },
  { label: "Craftsmanship", href: "/craftsmanship" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const footerNavigation = {
  collections: [
    { label: "Kitchen Faucets", href: "/shop?category=kitchen" },
    { label: "Bathroom Faucets", href: "/shop?category=bathroom" },
    { label: "Shower Systems", href: "/shop?q=shower" },
    { label: "Accessories", href: "/shop?q=accessories" },
    { label: "All Collections", href: "/collections" },
  ],
  company: [
    { label: "About VARENO", href: "/about" },
    { label: "Craftsmanship", href: "/craftsmanship" },
    { label: "Trade Program", href: "/trade-program" },
    { label: "Shop", href: "/shop" },
  ],
  contact: [
    { label: "Contact Concierge", href: "/contact" },
    { label: "Warranty", href: "/warranty" },
    { label: "Shipping & Returns", href: "/shipping-returns" },
  ],
} as const;

/** Four featured collection cards on the homepage. */
export const featuredCollections = [
  {
    id: "kitchen",
    title: "Kitchen Faucets",
    href: "/shop?category=kitchen",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d4046?w=1400&q=88",
    imageAlt: "Solid brass kitchen faucet in a refined kitchen",
  },
  {
    id: "bathroom",
    title: "Bathroom Faucets",
    href: "/shop?category=bathroom",
    image:
      "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=1400&q=88",
    imageAlt: "Handcrafted brass bathroom faucet",
  },
  {
    id: "shower",
    title: "Shower Systems",
    href: "/shop?q=shower",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1400&q=88",
    imageAlt: "Luxury brass shower system in a spa bathroom",
  },
  {
    id: "accessories",
    title: "Accessories",
    href: "/shop?q=accessories",
    image:
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1400&q=88",
    imageAlt: "Luxury brass bathroom accessories",
  },
] as const;

export const instagramGallery = [
  {
    id: "ig1",
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=85",
    alt: "Luxury bathroom with brass fixtures",
  },
  {
    id: "ig2",
    src: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=900&q=85",
    alt: "Brass towel rail detail",
  },
  {
    id: "ig3",
    src: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=900&q=85",
    alt: "Warm brass accents in a bath",
  },
  {
    id: "ig4",
    src: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=900&q=85",
    alt: "Elegant interior with metal hardware",
  },
  {
    id: "ig5",
    src: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=900&q=85",
    alt: "Marble bath with brass faucet",
  },
  {
    id: "ig6",
    src: "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=900&q=85",
    alt: "Close-up of handcrafted brass faucet",
  },
] as const;
