"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { storefrontCollections } from "@/config/collections";
import { motion as motionTokens } from "@/constants/design";

export function CollectionsShowcase() {
  const reduceMotion = useReducedMotion();
  const ease = motionTokens.easeLuxury;

  return (
    <>
      <section className="border-b border-border bg-background pb-16 pt-28 md:pb-20 md:pt-36">
        <Container>
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.9, ease }}
          >
            <p className="text-[11px] uppercase tracking-[0.32em] text-accent">
              Collections
            </p>
            <h1 className="mt-5 max-w-3xl font-display text-5xl leading-[1.05] text-primary md:text-7xl">
              Brass, Composed
            </h1>
            <p className="mt-7 max-w-xl text-sm leading-[1.9] text-muted md:text-base">
              Four curated worlds—kitchen, bath, accessories, and the newest
              arrivals from the atelier.
            </p>
          </motion.div>
        </Container>
      </section>

      <section className="bg-background" aria-label="Collection banners">
        <ul>
          {storefrontCollections.map((collection, index) => (
            <motion.li
              key={collection.id}
              initial={reduceMotion ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: reduceMotion ? 0 : 1, ease }}
            >
              <Link
                href={collection.href}
                className="group relative flex min-h-[70vh] items-end overflow-hidden md:min-h-[78vh]"
              >
                <Image
                  src={collection.image}
                  alt={collection.imageAlt}
                  fill
                  className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  sizes="100vw"
                  priority={index === 0}
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/25 to-primary/10"
                  aria-hidden="true"
                />
                <Container className="relative z-10 w-full pb-16 pt-32 md:pb-24">
                  <p className="text-[11px] uppercase tracking-[0.32em] text-accent">
                    {collection.eyebrow}
                  </p>
                  <h2 className="mt-4 max-w-2xl font-display text-4xl text-inverse-text md:text-6xl">
                    {collection.title}
                  </h2>
                  <p className="mt-5 max-w-lg text-sm leading-[1.9] text-inverse-text/75 md:text-base">
                    {collection.description}
                  </p>
                  <span className="relative mt-8 inline-block text-[11px] uppercase tracking-[0.28em] text-accent">
                    Enter Collection
                    <span
                      className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-500 group-hover:scale-x-100"
                      aria-hidden="true"
                    />
                  </span>
                </Container>
              </Link>
            </motion.li>
          ))}
        </ul>
      </section>
    </>
  );
}
