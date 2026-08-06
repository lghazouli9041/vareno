import { BestSellers } from "@/components/home/BestSellers";
import { CustomerStories } from "@/components/home/CustomerStories";
import { FeaturedCollections } from "@/components/home/FeaturedCollections";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { Hero } from "@/components/home/Hero";
import { LuxuryFinishes } from "@/components/home/LuxuryFinishes";
import { WhyVareno } from "@/components/home/WhyVareno";
import {
  getBestSellerCatalogProductsAsync,
  getCatalogCollectionsAsync,
  getFeaturedHomeCollectionsAsync,
} from "@/lib/catalog/repository";
import { catalogToLegacyProduct } from "@/lib/catalog/to-legacy-product";

export default async function HomePage() {
  const [bestSellerCatalog, collections, featuredCollections] =
    await Promise.all([
      getBestSellerCatalogProductsAsync(4),
      getCatalogCollectionsAsync(),
      getFeaturedHomeCollectionsAsync(3),
    ]);
  const nameBySlug = Object.fromEntries(
    collections.map((collection) => [collection.slug, collection.name]),
  );
  const bestSellers = bestSellerCatalog.map((product) =>
    catalogToLegacyProduct(product, nameBySlug[product.collection]),
  );

  return (
    <>
      <Hero />
      <FeaturedCollections collections={featuredCollections} />
      <BestSellers products={bestSellers} />
      <WhyVareno />
      <FeaturedProjects />
      <CustomerStories />
      <LuxuryFinishes />
    </>
  );
}
