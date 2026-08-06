"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { FeaturedCollectionCard } from "@/types/catalog";
import { motion as motionTokens } from "@/constants/design";

interface CollectionCardProps {
  collection: FeaturedCollectionCard;
  index: number;
}

export function CollectionCard({ collection, index }: CollectionCardProps) {
  const reduceMotion = useReducedMotion();
  const ease = motionTokens.easeLuxury;

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: reduceMotion ? 0 : 0.7,
        delay: reduceMotion ? 0 : index * 0.12,
        ease,
      }}
      className="h-full"
    >
      <Link
        href={collection.href}
        aria-label={`Explore ${collection.title}`}
        className="group relative block h-full overflow-hidden rounded-2xl shadow-md outline-none transition-all duration-500 hover:-translate-y-1 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4"
      >
        <div className="luxury-media relative aspect-[4/5] sm:aspect-[3/4]">
          <Image
            src={collection.image}
            alt={collection.imageAlt}
            fill
            className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07] group-focus-visible:scale-[1.07]"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          <div
            className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-primary/10 transition-opacity duration-500 group-hover:from-primary/95 group-hover:via-primary/50"
            aria-hidden="true"
          />

          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-7 md:p-9">
            <div className="flex items-end justify-between gap-4">
              <div className="min-w-0 text-left">
                <h3 className="font-display text-2xl leading-[1.15] text-inverse-text md:text-3xl">
                  {collection.title}
                </h3>
                <p className="mt-2.5 max-w-xs text-sm leading-[1.7] text-inverse-text/78 transition-colors duration-300 group-hover:text-inverse-text/92">
                  {collection.description}
                </p>
              </div>

              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-inverse-text/30 bg-inverse-text/12 text-inverse-text shadow-sm backdrop-blur-md transition-all duration-500 group-hover:border-accent group-hover:bg-accent group-hover:text-primary group-hover:shadow-gold"
                aria-hidden="true"
              >
                <ArrowUpRight
                  size={18}
                  strokeWidth={1.5}
                  className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
