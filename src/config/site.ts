export const siteConfig = {
  name: "VARENO",
  legalName: "Vareno LLC",
  tagline: "Crafted for Timeless Living",
  description:
    "VARENO creates architectural faucets engineered for designers, architects and refined American homes. Premium kitchen and bathroom fixtures crafted with enduring materials and timeless form for the United States market.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://hajamed.com",
  locale: "en_US",
  language: "English",
  country: "United States",
  currency: "USD" as const,
  supportEmail: "concierge@hajamed.com",
  tradeEmail: "trade@hajamed.com",
  phone: "+1 (800) 555-0148",
  address: {
    street: "450 Park Avenue",
    city: "New York",
    state: "NY",
    zip: "10022",
    country: "United States",
  },
  social: {
    instagram: "https://instagram.com/hajamed",
    pinterest: "https://pinterest.com/hajamed",
    linkedin: "https://linkedin.com/company/hajamed",
  },
  shipping: {
    freeThreshold: 500,
    standardDays: "5–7",
    expressDays: "2–3",
  },
  seo: {
    titleTemplate: "%s | VARENO",
    defaultTitle: "VARENO — Luxury Kitchen & Bathroom Faucets",
    twitterHandle: "@hajamed",
  },
} as const;

export type SiteConfig = typeof siteConfig;
