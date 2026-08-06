"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CollectionCard } from "@/components/home/CollectionCard";
import { Section } from "@/components/layout/Section";
import { motion as motionTokens } from "@/constants/design";
import type { FeaturedCollectionCard } from "@/types/catalog";

interface FeaturedCollectionsProps {
  collections: FeaturedCollectionCard[];
}

export function FeaturedCollections({ collections }: FeaturedCollectionsProps) {
  const reduceMotion = useReducedMotion();
  const ease = motionTokens.easeLuxury;

  return (
    <Section
      id="featured-collections"
      tone="default"
      aria-labelledby="featured-collections-heading"
      containerClassName="flex flex-col gap-12 md:gap-16"
    >
      <motion.div
        className="mx-auto max-w-2xl text-center"
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: reduceMotion ? 0 : 0.7, ease }}
      >
        <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-accent">
          Curated Selections
        </p>
        <h2
          id="featured-collections-heading"
          className="font-display text-3xl text-primary md:text-5xl"
        >
          Featured Collections
        </h2>
        <div className="gold-line-center mt-6" aria-hidden="true" />
      </motion.div>

      <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        {collections.map((collection, index) => (
          <li key={collection.id} className="h-full">
            <CollectionCard collection={collection} index={index} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
