"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Award, Gem, PenTool, Settings2 } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { motion as motionTokens } from "@/constants/design";

const pillars = [
  {
    title: "Solid Brass Construction",
    description:
      "Made from premium solid brass for unmatched durability and corrosion resistance.",
    icon: Gem,
  },
  {
    title: "Lifetime Warranty",
    description:
      "Designed to last generations and backed by our lifetime limited warranty.",
    icon: Award,
  },
  {
    title: "Architectural Design",
    description:
      "Minimal timeless silhouettes created for luxury interiors.",
    icon: PenTool,
  },
  {
    title: "Precision Engineering",
    description:
      "Advanced ceramic cartridges deliver smooth performance for decades.",
    icon: Settings2,
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
        transition={{ duration: reduceMotion ? 0 : 0.7, ease }}
      >
        <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-accent">
          Why VARENO
        </p>
        <h2
          id="why-vareno-heading"
          className="font-display text-3xl text-primary md:text-5xl"
        >
          Engineered for a Lifetime of Exceptional Living
        </h2>
        <div className="gold-line-center mt-7" aria-hidden="true" />
        <p className="mx-auto mt-7 max-w-xl text-pretty text-sm leading-relaxed text-muted md:text-base md:leading-relaxed">
          Every VARENO fixture is crafted from premium solid brass and engineered
          with architectural precision to deliver timeless beauty, flawless
          performance, and lasting reliability.
        </p>
      </motion.header>

      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:gap-8">
        {pillars.map((pillar, index) => {
          const Icon = pillar.icon;
          return (
            <motion.li
              key={pillar.title}
              initial={reduceMotion ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: reduceMotion ? 0 : 0.65,
                delay: reduceMotion ? 0 : index * 0.1,
                ease,
              }}
            >
              <article className="group h-full rounded-2xl border border-border/80 bg-background p-8 shadow-sm transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-lg md:p-10">
                <span
                  className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-primary shadow-[0_8px_24px_rgb(201_161_74_/_0.28)] transition-transform duration-500 group-hover:scale-105"
                  aria-hidden="true"
                >
                  <Icon size={22} strokeWidth={1.5} />
                </span>
                <h3 className="font-display text-2xl text-primary md:text-[1.65rem]">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted md:text-[0.95rem] md:leading-relaxed">
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
