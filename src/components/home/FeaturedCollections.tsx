"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Section } from "@/components/layout/Section";
import { featuredCollections } from "@/config/navigation";
import { motion as motionTokens } from "@/constants/design";

export function FeaturedCollections() {
  const reduceMotion = useReducedMotion();
  const ease = motionTokens.easeLuxury;

  return (
    <Section
      id="featured-collections"
      tone="default"
      aria-labelledby="featured-collections-heading"
      containerClassName="flex flex-col gap-14 md:gap-20"
    >
      <motion.header
        className="mx-auto max-w-2xl text-center"
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: reduceMotion ? 0 : 0.9, ease }}
      >
        <p className="mb-4 text-[11px] uppercase tracking-[0.32em] text-accent">
          Collections
        </p>
        <h2
          id="featured-collections-heading"
          className="font-display text-3xl text-primary md:text-5xl"
        >
          Featured Collections
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-pretty text-sm leading-relaxed text-muted md:text-base">
          Curated brass for kitchens, baths, and the details that complete a
          room.
        </p>
      </motion.header>

      <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:gap-7">
        {featuredCollections.map((collection, index) => (
          <motion.li
            key={collection.id}
            initial={reduceMotion ? false : { opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: reduceMotion ? 0 : 0.85,
              delay: reduceMotion ? 0 : index * 0.08,
              ease,
            }}
          >
            <Link
              href={collection.href}
              className="group relative block aspect-[4/3] overflow-hidden bg-surface md:aspect-[5/4]"
            >
              <Image
                src={collection.image}
                alt={collection.imageAlt}
                fill
                className="object-cover transition-transform duration-[1.3s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-primary/75 via-primary/15 to-transparent"
                aria-hidden="true"
              />
              <div className="absolute inset-x-0 bottom-0 p-7 md:p-9">
                <h3 className="font-display text-2xl text-inverse-text md:text-3xl">
                  {collection.title}
                </h3>
                <span className="relative mt-3 inline-block text-[10px] uppercase tracking-[0.28em] text-accent">
                  Explore
                  <span
                    className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </Link>
          </motion.li>
        ))}
      </ul>
    </Section>
  );
}
