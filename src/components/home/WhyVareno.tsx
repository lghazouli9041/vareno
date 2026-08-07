"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Globe2, Hammer, Shield, Sparkles } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { motion as motionTokens } from "@/constants/design";

const pillars = [
  {
    title: "Solid Brass",
    description:
      "Dense, enduring metal chosen for warmth, weight, and lifetime integrity—never hollow plating.",
    icon: Sparkles,
  },
  {
    title: "Hand Finished",
    description:
      "Polished, brushed, and perfected by hand so every silhouette carries atelier precision.",
    icon: Hammer,
  },
  {
    title: "Lifetime Durability",
    description:
      "Engineered to perform for decades and age with character in extraordinary interiors.",
    icon: Shield,
  },
  {
    title: "Worldwide Shipping",
    description:
      "From our workshop to homes across the globe, delivered with collector-level care.",
    icon: Globe2,
  },
] as const;

export function WhyVareno() {
  const reduceMotion = useReducedMotion();
  const ease = motionTokens.easeLuxury;

  return (
    <Section
      id="why-vareno"
      tone="default"
      aria-labelledby="why-vareno-heading"
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
          The Standard
        </p>
        <h2
          id="why-vareno-heading"
          className="font-display text-3xl text-primary md:text-5xl"
        >
          Why VARENO
        </h2>
      </motion.header>

      <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {pillars.map((pillar, index) => {
          const Icon = pillar.icon;
          return (
            <motion.li
              key={pillar.title}
              initial={reduceMotion ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: reduceMotion ? 0 : 0.75,
                delay: reduceMotion ? 0 : index * 0.08,
                ease,
              }}
            >
              <article className="group h-full border border-border bg-background px-6 py-9 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-md md:px-7 md:py-10">
                <span
                  className="mb-7 flex h-11 w-11 items-center justify-center border border-accent/45 text-accent transition-all duration-500 group-hover:border-accent group-hover:bg-accent group-hover:text-primary"
                  aria-hidden="true"
                >
                  <Icon size={18} strokeWidth={1.35} />
                </span>
                <h3 className="font-display text-xl text-primary md:text-2xl">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {pillar.description}
                </p>
              </article>
            </motion.li>
          );
        })}
      </ul>
    </Section>
  );
}
