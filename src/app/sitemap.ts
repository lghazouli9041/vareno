import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getCatalogProductsAsync } from "@/lib/catalog/repository";

const staticRoutes = [
  "/",
  "/shop",
  "/about",
  "/trade-program",
  "/warranty",
  "/shipping-returns",
  "/contact",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const products = await getCatalogProductsAsync();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "daily" : "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${siteConfig.url}/products/${product.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticEntries, ...productEntries];
}
