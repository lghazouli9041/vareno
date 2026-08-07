"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { storefrontCollections } from "@/config/collections";
import { motion as motionTokens } from "@/constants/design";

interface ShopBannerProps {
  category?: "kitchen" | "bathroom";
  query?: string;
  collection?: string;
}

function resolveBanner(props: ShopBannerProps) {
  if (props.category === "kitchen") {
    return storefrontCollections.find((c) => c.id === "kitchen")!;
  }
  if (props.category === "bathroom") {
    return storefrontCollections.find((c) => c.id === "bathroom")!;
  }
  if (props.query?.toLowerCase().includes("accessor")) {
    return storefrontCollections.find((c) => c.id === "accessories")!;
  }
  return {
    id: "all",
    title: "The Collection",
    eyebrow: "Shop",
    description:
      "Solid brass faucets and accessories—filter by finish, category, and collection.",
    href: "/shop",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1800&q=90",
    imageAlt: "VARENO brass fixtures in a luxury interior",
  };
}

export function ShopBanner({ category, query, collection }: ShopBannerProps) {
  const reduceMotion = useReducedMotion();
  const ease = motionTokens.easeLuxury;
  const banner = resolveBanner({ category, query, collection });

  return (
    <section
      className="relative overflow-hidden border-b border-border"
      aria-labelledby="shop-heading"
    >
      <div className="absolute inset-0">
        <Image
          src={banner.image}
          alt=""
          fill
          priority
          className="object-cover object-center opacity-[0.18]"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-background via-background/92 to-background"
          aria-hidden="true"
        />
      </div>

      <Container className="relative pb-16 pt-28 md:pb-20 md:pt-36">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.85, ease }}
        >
          <nav aria-label="Breadcrumb" className="mb-12">
            <ol className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-muted">
              <li>
                <Link href="/" className="transition-colors hover:text-accent">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-border">
                /
              </li>
              <li>
                <Link
                  href="/collections"
                  className="transition-colors hover:text-accent"
                >
                  Collections
                </Link>
              </li>
              <li aria-hidden="true" className="text-border">
                /
              </li>
              <li className="text-primary" aria-current="page">
                Shop
              </li>
            </ol>
          </nav>

          <p className="mb-5 text-[11px] uppercase tracking-[0.32em] text-accent">
            {banner.eyebrow}
          </p>
          <h1
            id="shop-heading"
            className="max-w-3xl font-display text-5xl leading-[1.05] text-primary md:text-7xl"
          >
            {banner.title}
          </h1>
          <p className="mt-7 max-w-xl text-pretty text-sm leading-[1.9] text-muted md:text-base">
            {banner.description}
          </p>
        </motion.div>
      </Container>
    </section>
  );
}
