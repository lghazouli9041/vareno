"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Globe2, Hammer, Shield, Sparkles } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { motion as motionTokens } from "@/constants/design";

const pillars = [
  {
    title: "Solid Brass",
    description:
      "Every fixture begins as solid brass—dense, warm metal chosen for lifetime integrity.",
    icon: Sparkles,
  },
  {
    title: "Handmade",
    description:
      "Cast, finished, and inspected by hand in the European atelier tradition.",
    icon: Hammer,
  },
  {
    title: "Lifetime Quality",
    description:
      "Built to age with grace and perform for decades in extraordinary homes.",
    icon: Shield,
  },
  {
    title: "Worldwide Shipping",
    description:
      "White-glove delivery from our workshop to interiors across the globe.",
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
      containerClassName="flex flex-col gap-16 md:gap-20"
    >
      <motion.header
        className="mx-auto max-w-2xl text-center"
        initial={reduceMotion ? false : { opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: reduceMotion ? 0 : 1, ease }}
      >
        <p className="mb-5 text-[11px] uppercase tracking-[0.32em] text-accent">
          The Standard
        </p>
        <h2
          id="why-vareno-heading"
          className="font-display text-3xl text-primary md:text-5xl"
        >
          Why Choose VARENO
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
                duration: reduceMotion ? 0 : 0.8,
                delay: reduceMotion ? 0 : index * 0.08,
                ease,
              }}
            >
              <article className="group h-full border border-border bg-background px-6 py-10 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-md md:px-7 md:py-11">
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
