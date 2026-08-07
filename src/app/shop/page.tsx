import type { Metadata } from "next";
import { ShopView } from "@/components/shop/ShopView";
import { siteConfig } from "@/config/site";
import {
  getCatalogCollectionsAsync,
  getCatalogProductsAsync,
} from "@/lib/catalog/repository";

export const metadata: Metadata = {
  title: "Shop Handcrafted Brass Faucets & Accessories",
  description:
    "Browse VARENO handmade solid brass faucets and bathroom accessories. Filter by kitchen, bath, finish, and collection.",
  alternates: {
    canonical: "/shop",
  },
  openGraph: {
    title: `Shop | ${siteConfig.name}`,
    description:
      "Explore luxury handmade brass faucets and bathroom accessories from VARENO.",
    url: `${siteConfig.url}/shop`,
  },
};

interface ShopPageProps {
  searchParams: Promise<{
    collection?: string;
    category?: string;
    q?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const [products, collections] = await Promise.all([
    getCatalogProductsAsync(),
    getCatalogCollectionsAsync(),
  ]);

  const initialCollection = params.collection?.trim().toLowerCase();
  const validCollection =
    initialCollection &&
    collections.some((collection) => collection.slug === initialCollection)
      ? initialCollection
      : undefined;

  const categoryParam = params.category?.trim().toLowerCase();
  const validCategory =
    categoryParam === "kitchen" || categoryParam === "bathroom"
      ? categoryParam
      : undefined;

  const initialQuery = params.q?.trim() || undefined;

  return (
    <ShopView
      initialProducts={products}
      collections={collections}
      initialCollection={validCollection}
      initialCategory={validCategory}
      initialQuery={initialQuery}
    />
  );
}
