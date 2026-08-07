"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Section } from "@/components/layout/Section";
import { awards, pressLogos } from "@/config/collections";
import { motion as motionTokens } from "@/constants/design";

export function PressAwards() {
  const reduceMotion = useReducedMotion();
  const ease = motionTokens.easeLuxury;

  return (
    <Section
      id="press"
      tone="default"
      aria-labelledby="press-heading"
      containerClassName="flex flex-col gap-16 md:gap-20"
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: reduceMotion ? 0 : 0.9, ease }}
        className="text-center"
      >
        <p className="text-[11px] uppercase tracking-[0.32em] text-accent">
          Recognition
        </p>
        <h2
          id="press-heading"
          className="mt-4 font-display text-3xl text-primary md:text-5xl"
        >
          Press & Awards
        </h2>
      </motion.div>

      <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:gap-x-14">
        {pressLogos.map((logo, index) => (
          <motion.li
            key={logo}
            initial={reduceMotion ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: reduceMotion ? 0 : 0.7,
              delay: reduceMotion ? 0 : index * 0.06,
              ease,
            }}
            className="font-display text-xl tracking-[0.04em] text-primary/45 transition-colors duration-500 hover:text-accent md:text-2xl"
          >
            {logo}
          </motion.li>
        ))}
      </ul>

      <ul className="grid grid-cols-1 gap-6 border-t border-border pt-12 md:grid-cols-3 md:gap-8">
        {awards.map((award, index) => (
          <motion.li
            key={award.title}
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: reduceMotion ? 0 : 0.75,
              delay: reduceMotion ? 0 : index * 0.08,
              ease,
            }}
            className="text-center md:text-left"
          >
            <p className="text-[10px] uppercase tracking-[0.28em] text-accent">
              {award.year}
            </p>
            <h3 className="mt-3 font-display text-2xl text-primary">
              {award.title}
            </h3>
            <p className="mt-2 text-sm text-muted">{award.detail}</p>
          </motion.li>
        ))}
      </ul>
    </Section>
  );
}
