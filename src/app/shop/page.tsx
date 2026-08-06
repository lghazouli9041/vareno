import type { Metadata } from "next";
import { ShopView } from "@/components/shop/ShopView";
import { siteConfig } from "@/config/site";
import {
  getCatalogCollectionsAsync,
  getCatalogProductsAsync,
} from "@/lib/catalog/repository";

export const metadata: Metadata = {
  title: "Shop Luxury Kitchen & Bathroom Faucets",
  description:
    "Browse VARENO architectural faucets for kitchen and bath. Filter by collection, finish, and availability—crafted for designers and refined American homes.",
  alternates: {
    canonical: "/shop",
  },
  openGraph: {
    title: `Shop | ${siteConfig.name}`,
    description:
      "Explore premium kitchen and bathroom faucets from VARENO. Heritage, Signature, Imperial, Atelier, and Element collections.",
    url: `${siteConfig.url}/shop`,
  },
};

interface ShopPageProps {
  searchParams: Promise<{ collection?: string }>;
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

  return (
    <ShopView
      initialProducts={products}
      collections={collections}
      initialCollection={validCollection}
    />
  );
}
