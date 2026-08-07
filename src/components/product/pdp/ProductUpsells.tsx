"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  getRecentlyViewedProductsAsync,
  trackRecentlyViewed,
} from "@/lib/recently-viewed";
import { formatPrice, cn } from "@/lib/utils";
import type { CatalogProduct } from "@/types/catalog";

interface ProductUpsellsProps {
  product: CatalogProduct;
  relatedProducts?: CatalogProduct[];
  collectionNames?: Record<string, string>;
}

function MiniCard({
  product,
  collectionNames,
}: {
  product: CatalogProduct;
  collectionNames?: Record<string, string>;
}) {
  const collection =
    collectionNames?.[product.collection] ?? product.collection;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block w-[220px] shrink-0 snap-start sm:w-[240px]"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-surface shadow-sm">
        <Image
          src={product.featuredImage}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-[1.1s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
          sizes="240px"
        />
      </div>
      <div className="pt-5">
        <p className="text-[10px] uppercase tracking-[0.22em] text-muted">
          {collection}
        </p>
        <h3 className="mt-2 font-display text-xl leading-tight text-primary transition-colors group-hover:text-accent">
          {product.name}
        </h3>
        <p className="mt-2 font-display text-lg text-primary">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}

function ProductCarousel({
  title,
  eyebrow,
  products,
  headingId,
  collectionNames,
}: {
  title: string;
  eyebrow: string;
  products: CatalogProduct[];
  headingId: string;
  collectionNames?: Record<string, string>;
}) {
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateArrows = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [products.length]);

  const scrollBy = (direction: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * 280, behavior: "smooth" });
  };

  if (products.length === 0) return null;

  return (
    <section aria-labelledby={headingId} className="relative">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-accent">
            {eyebrow}
          </p>
          <h2
            id={headingId}
            className="mt-2 font-display text-3xl text-primary md:text-4xl"
          >
            {title}
          </h2>
        </div>
        <div className="hidden gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            disabled={!canPrev}
            className={cn(
              "border border-border p-2 text-primary transition-colors",
              canPrev
                ? "hover:border-accent hover:text-accent"
                : "cursor-not-allowed opacity-30",
            )}
            aria-label={`Scroll ${title} left`}
          >
            <ChevronLeft size={18} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            disabled={!canNext}
            className={cn(
              "border border-border p-2 text-primary transition-colors",
              canNext
                ? "hover:border-accent hover:text-accent"
                : "cursor-not-allowed opacity-30",
            )}
            aria-label={`Scroll ${title} right`}
          >
            <ChevronRight size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <ul
        ref={scrollerRef}
        className="flex gap-5 overflow-x-auto scroll-smooth pb-2 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((item) => (
          <li key={item.id}>
            <MiniCard product={item} collectionNames={collectionNames} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ProductUpsells({
  product,
  relatedProducts = [],
  collectionNames,
}: ProductUpsellsProps) {
  const [recent, setRecent] = useState<CatalogProduct[]>([]);

  useEffect(() => {
    trackRecentlyViewed(product.slug);
    void getRecentlyViewedProductsAsync(product.slug).then((items) =>
      setRecent(items.slice(0, 8)),
    );
  }, [product.slug]);

  return (
    <div className="space-y-20 border-t border-border py-16 md:space-y-24 md:py-24">
      <ProductCarousel
        eyebrow="Continue Exploring"
        title="Related Products"
        headingId="related-heading"
        products={relatedProducts}
        collectionNames={collectionNames}
      />
      <ProductCarousel
        eyebrow="Your Path"
        title="Recently Viewed"
        headingId="recent-heading"
        products={recent}
        collectionNames={collectionNames}
      />
    </div>
  );
}
