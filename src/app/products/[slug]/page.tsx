import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailView } from "@/components/product/pdp/ProductDetailView";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/config/site";
import {
  getCatalogCollectionsAsync,
  getCatalogProductBySlugAsync,
  getCatalogProductsAsync,
  getCollectionNameMapAsync,
  getRelatedByCollectionAsync,
} from "@/lib/catalog/repository";
import { getApprovedReviewsForProduct } from "@/lib/reviews";
import { absoluteUrl } from "@/lib/utils";
import { breadcrumbJsonLd } from "@/lib/seo/json-ld";
import type { CatalogProduct } from "@/types/catalog";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await getCatalogProductsAsync();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCatalogProductBySlugAsync(slug);
  if (!product) return { title: "Product Not Found" };

  return {
    title: product.seoTitle,
    description: product.seoDescription,
    alternates: {
      canonical: `/products/${product.slug}`,
    },
    openGraph: {
      title: product.seoTitle,
      description: product.seoDescription,
      url: absoluteUrl(`/products/${product.slug}`),
      siteName: siteConfig.name,
      images: [
        {
          url: product.featuredImage,
          width: 1200,
          height: 1500,
          alt: product.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.seoTitle,
      description: product.seoDescription,
      images: [product.featuredImage],
    },
  };
}

function catalogProductJsonLd(
  product: CatalogProduct,
  reviewStats?: { average: number; count: number },
) {
  const finish = product.finishOptions[0];
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.marketingDescription,
    image: [product.featuredImage, ...product.gallery],
    sku: product.sku,
    mpn: product.sku,
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    material: product.material,
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/products/${product.slug}`),
      priceCurrency: siteConfig.currency,
      price: finish?.price ?? product.price,
      availability:
        product.availability === "in_stock"
          ? "https://schema.org/InStock"
          : product.availability === "made_to_order"
            ? "https://schema.org/PreOrder"
            : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    ...(reviewStats && reviewStats.count > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: Number(reviewStats.average.toFixed(1)),
            reviewCount: reviewStats.count,
          },
        }
      : {}),
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getCatalogProductBySlugAsync(slug);
  if (!product) notFound();

  const [reviews, collections, related, collectionNames] = await Promise.all([
    getApprovedReviewsForProduct(product.id),
    getCatalogCollectionsAsync(),
    getRelatedByCollectionAsync(product.collection, product.id, 4),
    getCollectionNameMapAsync(),
  ]);

  const reviewStats =
    reviews.length > 0
      ? {
          average:
            reviews.reduce((sum, review) => sum + review.rating, 0) /
            reviews.length,
          count: reviews.length,
        }
      : undefined;

  const collectionName =
    collectionNames[product.collection] ??
    collections.find((item) => item.slug === product.collection)?.name ??
    product.collection;

  return (
    <>
      <JsonLd
        data={[
          catalogProductJsonLd(product, reviewStats),
          breadcrumbJsonLd([
            { name: "Home", href: "/" },
            { name: "Shop", href: "/shop" },
            { name: collectionName, href: "/shop" },
            { name: product.name, href: `/products/${product.slug}` },
          ]),
        ]}
      />
      <ProductDetailView
        product={product}
        reviews={reviews}
        collectionName={collectionName}
        collectionNames={collectionNames}
        relatedProducts={related}
      />
    </>
  );
}
