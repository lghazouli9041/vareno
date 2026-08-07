"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Section } from "@/components/layout/Section";
import { customerHomes } from "@/config/collections";
import { motion as motionTokens } from "@/constants/design";

export function CustomerHomes() {
  const reduceMotion = useReducedMotion();
  const ease = motionTokens.easeLuxury;

  return (
    <Section
      id="customer-homes"
      tone="surface"
      aria-labelledby="customer-homes-heading"
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
          In Residence
        </p>
        <h2
          id="customer-homes-heading"
          className="font-display text-3xl text-primary md:text-5xl"
        >
          Customer Homes
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-muted md:text-base">
          VARENO brass living in extraordinary European interiors.
        </p>
      </motion.header>

      <ul className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
        {customerHomes.map((home, index) => (
          <motion.li
            key={home.id}
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{
              duration: reduceMotion ? 0 : 0.85,
              delay: reduceMotion ? 0 : index * 0.08,
              ease,
            }}
          >
            <article className="group">
              <div className="relative aspect-[3/4] overflow-hidden bg-surface">
                <Image
                  src={home.image}
                  alt={home.location}
                  fill
                  className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="pt-5">
                <h3 className="font-display text-2xl text-primary">
                  {home.location}
                </h3>
                <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-muted">
                  {home.credit}
                </p>
              </div>
            </article>
          </motion.li>
        ))}
      </ul>
    </Section>
  );
}
