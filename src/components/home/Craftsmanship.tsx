"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/layout/Section";
import { motion as motionTokens } from "@/constants/design";

export function Craftsmanship() {
  const reduceMotion = useReducedMotion();
  const ease = motionTokens.easeLuxury;

  return (
    <Section
      id="craftsmanship"
      tone="surface"
      aria-labelledby="craftsmanship-heading"
      className="overflow-hidden"
      containerClassName="grid items-center gap-12 lg:grid-cols-2 lg:gap-20"
    >
      <motion.div
        className="relative aspect-[4/5] overflow-hidden bg-primary/5 lg:aspect-[5/6]"
        initial={reduceMotion ? false : { opacity: 0, x: -36 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: reduceMotion ? 0 : 1, ease }}
      >
        <Image
          src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1600&q=88"
          alt="Artisan hand-finishing a solid brass faucet"
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </motion.div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: reduceMotion ? 0 : 0.9, delay: 0.1, ease }}
        className="max-w-xl lg:py-8"
      >
        <p className="mb-4 text-[11px] uppercase tracking-[0.32em] text-accent">
          Craftsmanship
        </p>
        <h2
          id="craftsmanship-heading"
          className="font-display text-3xl leading-[1.1] text-primary md:text-5xl"
        >
          Made by Hand.
          <br />
          Built for Generations.
        </h2>
        <div className="gold-line mt-8" aria-hidden="true" />
        <p className="mt-8 text-pretty text-sm leading-[1.95] text-muted md:text-base">
          Every VARENO fixture begins as solid brass—cast, machined, and
          finished by hand. Surfaces are polished, brushed, or allowed to deepen
          into living patina. Nothing is plated thin; nothing is rushed. The
          result is hardware with weight, warmth, and the quiet authority of
          European atelier tradition.
        </p>
        <p className="mt-5 text-pretty text-sm leading-[1.95] text-muted md:text-base">
          From kitchen taps to the smallest robe hook, each piece is made to age
          with grace—and to remain beautiful for decades.
        </p>
        <div className="mt-10">
          <Button href="/craftsmanship" variant="outline" size="md">
            Discover the Process
          </Button>
        </div>
      </motion.div>
    </Section>
  );
}
