export type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
};

export const mainNavigation: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Kitchen", href: "/kitchen" },
  { label: "Bathroom", href: "/bathroom" },
  { label: "Collections", href: "/collections" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const footerNavigation = {
  shop: [
    { label: "Shop", href: "/shop" },
    { label: "Kitchen", href: "/kitchen" },
    { label: "Bathroom", href: "/bathroom" },
    { label: "Collections", href: "/collections" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Trade Program", href: "/trade-program" },
    { label: "Contact", href: "/contact" },
  ],
  support: [
    { label: "Warranty", href: "/warranty" },
    { label: "Shipping & Returns", href: "/shipping-returns" },
    { label: "Contact", href: "/contact" },
  ],
} as const;
