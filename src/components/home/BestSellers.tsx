"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ProductCardV2 } from "@/components/shop/ProductCardV2";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/layout/Section";
import { motion as motionTokens } from "@/constants/design";
import type { CatalogCollection, CatalogProduct } from "@/types/catalog";

interface BestSellersProps {
  products: CatalogProduct[];
  collections: CatalogCollection[];
}

export function BestSellers({ products, collections }: BestSellersProps) {
  const reduceMotion = useReducedMotion();
  const ease = motionTokens.easeLuxury;

  return (
    <Section
      id="best-sellers"
      tone="default"
      aria-labelledby="best-sellers-heading"
      containerClassName="flex flex-col gap-14 md:gap-16"
    >
      <motion.header
        className="mx-auto max-w-2xl text-center"
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: reduceMotion ? 0 : 0.9, ease }}
      >
        <p className="mb-4 text-[11px] uppercase tracking-[0.32em] text-accent">
          Best Sellers
        </p>
        <h2
          id="best-sellers-heading"
          className="font-display text-3xl text-primary md:text-5xl"
        >
          Coveted Pieces
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-pretty text-sm leading-relaxed text-muted md:text-base">
          The fixtures collectors return to—solid brass, hand finished, made to
          endure.
        </p>
      </motion.header>

      {products.length > 0 ? (
        <ul className="grid grid-cols-1 gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => (
            <li key={product.id}>
              <ProductCardV2
                product={product}
                index={index}
                collections={collections}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-sm text-muted">
          New pieces are arriving from the atelier.
        </p>
      )}

      <div className="flex justify-center">
        <Button href="/shop" variant="outline" size="md">
          View Full Collection
        </Button>
      </div>
    </Section>
  );
}
