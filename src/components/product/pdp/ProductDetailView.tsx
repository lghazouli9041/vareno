"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { ProductGallery } from "@/components/product/pdp/ProductGallery";
import { ProductInfoSections } from "@/components/product/pdp/ProductInfoSections";
import { ProductPurchasePanel } from "@/components/product/pdp/ProductPurchasePanel";
import { ProductReviews } from "@/components/product/pdp/ProductReviews";
import { ProductUpsells } from "@/components/product/pdp/ProductUpsells";
import { Button } from "@/components/ui/Button";
import { motion as motionTokens } from "@/constants/design";
import { resolveProductGallery } from "@/lib/catalog/finish-gallery";
import { catalogToCartProduct } from "@/lib/catalog-to-cart";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import type { StorefrontReview } from "@/lib/reviews";
import type { CatalogProduct } from "@/types/catalog";

interface ProductDetailViewProps {
  product: CatalogProduct;
  reviews?: StorefrontReview[];
  collectionName?: string;
  collectionNames?: Record<string, string>;
  relatedProducts?: CatalogProduct[];
}

export function ProductDetailView({
  product,
  reviews = [],
  collectionName: collectionNameProp,
  collectionNames,
  relatedProducts = [],
}: ProductDetailViewProps) {
  const reduceMotion = useReducedMotion();
  const ease = motionTokens.easeLuxury;
  const addItem = useCartStore((s) => s.addItem);
  const [selectedFinish, setSelectedFinish] = useState(
    product.finishOptions[0],
  );
  const [showSticky, setShowSticky] = useState(false);

  const collectionName = collectionNameProp ?? product.collection;

  const images = useMemo(
    () => resolveProductGallery(product, selectedFinish),
    [product, selectedFinish],
  );

  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 560);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!selectedFinish) return null;

  const canPurchase =
    selectedFinish.available && product.availability !== "out_of_stock";

  return (
    <>
      <Container className="pb-28 pt-28 md:pb-36 md:pt-36">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.9, ease }}
        >
          <nav aria-label="Breadcrumb" className="mb-12 md:mb-16">
            <ol className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-muted">
              <li>
                <Link
                  href="/"
                  className="transition-colors duration-300 hover:text-accent"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href="/shop"
                  className="transition-colors duration-300 hover:text-accent"
                >
                  Shop
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href={`/shop?collection=${product.collection}`}
                  className="transition-colors duration-300 hover:text-accent"
                >
                  {collectionName}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-primary" aria-current="page">
                {product.name}
              </li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)] lg:gap-16 xl:gap-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedFinish.id}
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.55, ease }}
              >
                <ProductGallery
                  name={`${product.name} — ${selectedFinish.name}`}
                  images={images}
                  finishLabel={selectedFinish.name}
                />
              </motion.div>
            </AnimatePresence>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="border border-border/70 bg-background/90 px-6 py-8 shadow-sm backdrop-blur-sm md:px-8 md:py-10">
                <ProductPurchasePanel
                  product={product}
                  selectedFinish={selectedFinish}
                  onFinishChange={setSelectedFinish}
                  collectionName={collectionName}
                />
              </div>
            </aside>
          </div>

          <ProductInfoSections
            product={product}
            selectedFinish={selectedFinish}
          />
          <ProductReviews product={product} reviews={reviews} />
          <ProductUpsells
            product={product}
            relatedProducts={relatedProducts}
            collectionNames={
              collectionNames ?? { [product.collection]: collectionName }
            }
          />
        </motion.div>
      </Container>

      <div
        className={`fixed inset-x-0 bottom-0 z-[70] border-t border-border/70 bg-background/88 shadow-[0_-12px_40px_rgb(17_17_17_/_0.06)] backdrop-blur-xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          showSticky ? "translate-y-0" : "translate-y-full"
        }`}
        aria-hidden={!showSticky}
      >
        <Container className="flex items-center justify-between gap-4 py-3.5">
          <div className="min-w-0">
            <p className="truncate font-display text-lg leading-tight text-primary">
              {product.name}
            </p>
            <p className="mt-0.5 truncate text-sm text-muted">
              {selectedFinish.name} · {formatPrice(selectedFinish.price)}
            </p>
          </div>
          <Button
            type="button"
            variant="gold"
            className="shrink-0"
            disabled={!canPurchase}
            onClick={() =>
              addItem(
                catalogToCartProduct(product, selectedFinish, collectionName),
                1,
              )
            }
            tabIndex={showSticky ? 0 : -1}
          >
            Add to Cart
          </Button>
        </Container>
      </div>
    </>
  );
}
