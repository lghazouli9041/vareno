import { BestSellers } from "@/components/home/BestSellers";
import { Craftsmanship } from "@/components/home/Craftsmanship";
import { CustomerReviews } from "@/components/home/CustomerReviews";
import { FeaturedCollections } from "@/components/home/FeaturedCollections";
import { Hero } from "@/components/home/Hero";
import { InstagramGallery } from "@/components/home/InstagramGallery";
import { Newsletter } from "@/components/home/Newsletter";
import { WhyVareno } from "@/components/home/WhyVareno";
import {
  getBestSellerCatalogProductsAsync,
  getCatalogCollectionsAsync,
} from "@/lib/catalog/repository";

/** Route `/` — European luxury VARENO homepage. */
export default async function HomePage() {
  const [bestSellers, collections] = await Promise.all([
    getBestSellerCatalogProductsAsync(4),
    getCatalogCollectionsAsync(),
  ]);

  return (
    <>
      <Hero />
      <FeaturedCollections />
      <BestSellers products={bestSellers} collections={collections} />
      <Craftsmanship />
      <WhyVareno />
      <CustomerReviews />
      <InstagramGallery />
      <Newsletter />
    </>
  );
}
