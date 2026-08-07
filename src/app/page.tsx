import { BestSellers } from "@/components/home/BestSellers";
import { Craftsmanship } from "@/components/home/Craftsmanship";
import { CustomerHomes } from "@/components/home/CustomerHomes";
import { CustomerReviews } from "@/components/home/CustomerReviews";
import { FeaturedCollections } from "@/components/home/FeaturedCollections";
import { Hero } from "@/components/home/Hero";
import { InstagramGallery } from "@/components/home/InstagramGallery";
import { Newsletter } from "@/components/home/Newsletter";
import { PressAwards } from "@/components/home/PressAwards";
import { StoryIntro } from "@/components/home/StoryIntro";
import { WhyVareno } from "@/components/home/WhyVareno";
import {
  getBestSellerCatalogProductsAsync,
  getCatalogCollectionsAsync,
} from "@/lib/catalog/repository";

/**
 * Route: `/` — the only homepage Next.js renders (src/app/page.tsx).
 * Luxury VARENO landing experience.
 */
export default async function HomePage() {
  const [bestSellers, collections] = await Promise.all([
    getBestSellerCatalogProductsAsync(4),
    getCatalogCollectionsAsync(),
  ]);

  return (
    <>
      <Hero />
      <StoryIntro />
      <FeaturedCollections />
      <BestSellers products={bestSellers} collections={collections} />
      <Craftsmanship />
      <WhyVareno />
      <CustomerHomes />
      <PressAwards />
      <CustomerReviews />
      <InstagramGallery />
      <Newsletter />
    </>
  );
}
