"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCatalogSnapshot } from "@/hooks/useCatalogSnapshot";
import { formatPrice, cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart";

export function CartCrossSell() {
  const cartKey = useCartStore((s) =>
    s.items.map((item) => item.product.slug).join("|"),
  );
  const scrollerRef = useRef<HTMLUListElement>(null);
  const { products, collectionNames } = useCatalogSnapshot();

  const recommendations = useMemo(() => {
    const cartSlugs = new Set(cartKey ? cartKey.split("|") : []);
    return products
      .filter((product) => !cartSlugs.has(product.slug))
      .slice(0, 8);
  }, [cartKey, products]);

  if (recommendations.length === 0) return null;

  const scrollBy = (direction: -1 | 1) => {
    scrollerRef.current?.scrollBy({
      left: direction * 280,
      behavior: "smooth",
    });
  };

  return (
    <section
      className="border-t border-border py-14 md:py-20"
      aria-labelledby="cart-cross-sell"
    >
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-accent">
            Complete the Room
          </p>
          <h2
            id="cart-cross-sell"
            className="mt-2 font-display text-3xl text-primary md:text-4xl"
          >
            You may also like
          </h2>
        </div>
        <div className="hidden gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            className="border border-border p-2 text-primary transition-colors hover:border-accent hover:text-accent"
            aria-label="Scroll recommendations left"
          >
            <ChevronLeft size={18} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            className="border border-border p-2 text-primary transition-colors hover:border-accent hover:text-accent"
            aria-label="Scroll recommendations right"
          >
            <ChevronRight size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <ul
        ref={scrollerRef}
        className="flex gap-5 overflow-x-auto scroll-smooth pb-2 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {recommendations.map((product) => {
          const collection = (
            collectionNames[product.collection] ?? product.collection
          ).replace(" Collection", "");
          return (
            <li
              key={product.id}
              className="w-[220px] shrink-0 snap-start sm:w-[240px]"
            >
              <Link
                href={`/products/${product.slug}`}
                className={cn("group block")}
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-surface">
                  <Image
                    src={product.featuredImage}
                    alt={product.name}
                    fill
                    loading="lazy"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    sizes="240px"
                  />
                </div>
                <p className="mt-4 text-[10px] uppercase tracking-[0.18em] text-accent">
                  {collection}
                </p>
                <h3 className="mt-1.5 font-display text-xl text-primary transition-colors group-hover:text-accent">
                  {product.name}
                </h3>
                <p className="mt-2 text-sm text-muted">
                  {formatPrice(product.price)}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
