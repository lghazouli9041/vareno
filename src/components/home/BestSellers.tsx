"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BestSellerCard } from "@/components/home/BestSellerCard";
import { Section } from "@/components/layout/Section";
import { motion as motionTokens } from "@/constants/design";
import type { Product } from "@/types";

interface BestSellersProps {
  products: Product[];
}

export function BestSellers({ products }: BestSellersProps) {
  const reduceMotion = useReducedMotion();
  const ease = motionTokens.easeLuxury;

  return (
    <Section
      id="best-sellers"
      tone="surface"
      aria-labelledby="best-sellers-heading"
      containerClassName="flex flex-col gap-14 md:gap-16"
    >
      <motion.header
        className="mx-auto max-w-2xl text-center"
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: reduceMotion ? 0 : 0.7, ease }}
      >
        <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-accent">
          Best Sellers
        </p>
        <h2
          id="best-sellers-heading"
          className="font-display text-3xl text-primary md:text-5xl"
        >
          The Collection Everyone Wants
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-pretty text-sm leading-relaxed text-muted md:text-base md:leading-relaxed">
          Our most desired architectural faucets, selected for exceptional
          craftsmanship, timeless beauty and lasting performance.
        </p>
        <div className="gold-line-center mt-8" aria-hidden="true" />
      </motion.header>

      <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7 xl:gap-8">
        {products.map((product, index) => (
          <li key={product.id}>
            <BestSellerCard product={product} index={index} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
