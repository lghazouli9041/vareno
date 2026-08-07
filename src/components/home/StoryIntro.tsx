"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Section } from "@/components/layout/Section";
import { motion as motionTokens } from "@/constants/design";

export function StoryIntro() {
  const reduceMotion = useReducedMotion();
  const ease = motionTokens.easeLuxury;

  return (
    <Section
      tone="default"
      aria-labelledby="story-intro-heading"
      className="!py-[clamp(4.5rem,9vw,7rem)]"
    >
      <motion.div
        className="mx-auto max-w-3xl text-center"
        initial={reduceMotion ? false : { opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: reduceMotion ? 0 : 1.1, ease }}
      >
        <p className="text-[11px] uppercase tracking-[0.32em] text-accent">
          The Maison
        </p>
        <h2
          id="story-intro-heading"
          className="mt-6 font-display text-3xl leading-[1.15] text-primary md:text-5xl md:leading-[1.12]"
        >
          Brass that ages with character.
          <br />
          Interiors that refuse the ordinary.
        </h2>
        <div className="gold-line-center mt-8" aria-hidden="true" />
        <p className="mx-auto mt-8 max-w-xl text-pretty text-sm leading-[1.95] text-muted md:text-base">
          VARENO is a European-minded house devoted to solid brass—hand cast,
          hand finished, and composed for kitchens and baths that measure beauty
          in decades, not seasons.
        </p>
      </motion.div>
    </Section>
  );
}
