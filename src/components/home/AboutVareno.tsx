"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/layout/Section";
import { motion as motionTokens } from "@/constants/design";

export function AboutVareno() {
  const reduceMotion = useReducedMotion();
  const ease = motionTokens.easeLuxury;

  return (
    <Section
      id="about-vareno"
      tone="surface"
      aria-labelledby="about-vareno-heading"
      className="overflow-hidden"
      containerClassName="grid items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20"
    >
      <motion.div
        className="relative aspect-[4/5] overflow-hidden bg-primary/5 lg:aspect-[5/6]"
        initial={reduceMotion ? false : { opacity: 0, x: -28 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: reduceMotion ? 0 : 0.9, ease }}
      >
        <Image
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=88"
          alt="Artisan finishing a solid brass bathroom fixture by hand"
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-tr from-primary/25 via-transparent to-transparent"
          aria-hidden="true"
        />
      </motion.div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: reduceMotion ? 0 : 0.8, delay: 0.1, ease }}
      >
        <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-accent">
          About VARENO
        </p>
        <h2
          id="about-vareno-heading"
          className="font-display text-3xl text-primary md:text-5xl"
        >
          Forged in Brass. Finished by Hand.
        </h2>
        <div className="gold-line mt-7" aria-hidden="true" />
        <p className="mt-7 max-w-xl text-pretty text-sm leading-[1.9] text-muted md:text-base md:leading-[1.95]">
          VARENO is a European-minded house devoted to handmade brass faucets
          and bathroom accessories. We work exclusively in solid brass—
          polishing, patinating, and perfecting each silhouette until it feels
          inevitable in a room. Our pieces are not trends; they are quiet
          heirlooms for kitchens and baths that value warmth, weight, and
          timeless proportion.
        </p>
        <p className="mt-5 max-w-xl text-pretty text-sm leading-[1.9] text-muted md:text-base md:leading-[1.95]">
          From sculptural kitchen taps to refined towel rails and soap holders,
          every object is shaped to age with character—living metal for
          interiors that refuse the ordinary.
        </p>
        <div className="mt-9">
          <Button href="/about" variant="outline" size="md">
            Our Story
          </Button>
        </div>
      </motion.div>
    </Section>
  );
}
