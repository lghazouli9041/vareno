"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Instagram } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { instagramGallery } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { motion as motionTokens } from "@/constants/design";
import { cn } from "@/lib/utils";

export function InstagramGallery() {
  const reduceMotion = useReducedMotion();
  const ease = motionTokens.easeLuxury;

  return (
    <Section
      id="instagram"
      tone="default"
      aria-labelledby="instagram-heading"
      containerClassName="flex flex-col gap-16 md:gap-20"
    >
      <motion.header
        className="mx-auto max-w-2xl text-center"
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: reduceMotion ? 0 : 0.9, ease }}
      >
        <p className="mb-4 text-[11px] uppercase tracking-[0.32em] text-accent">
          On Instagram
        </p>
        <h2
          id="instagram-heading"
          className="font-display text-3xl text-primary md:text-5xl"
        >
          Life in Brass
        </h2>
        <a
          href={siteConfig.social.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-muted transition-colors hover:text-accent"
        >
          <Instagram size={14} strokeWidth={1.4} />
          @vareeno
        </a>
      </motion.header>

      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        {instagramGallery.map((item, index) => (
          <motion.li
            key={item.id}
            className={cn(
              index === 0 && "md:row-span-2",
              index === 3 && "md:col-span-2",
            )}
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: reduceMotion ? 0 : 0.75,
              delay: reduceMotion ? 0 : index * 0.05,
              ease,
            }}
          >
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "group relative block overflow-hidden bg-surface",
                index === 0
                  ? "aspect-[3/4] md:h-full md:min-h-[28rem] md:aspect-auto"
                  : index === 3
                    ? "aspect-[16/9] md:aspect-[21/9]"
                    : "aspect-square",
              )}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                sizes={
                  index === 0 || index === 3
                    ? "(max-width: 768px) 50vw, 66vw"
                    : "(max-width: 768px) 50vw, 33vw"
                }
              />
              <div
                className="absolute inset-0 bg-primary/0 transition-colors duration-500 group-hover:bg-primary/25"
                aria-hidden="true"
              />
            </a>
          </motion.li>
        ))}
      </ul>
    </Section>
  );
}
