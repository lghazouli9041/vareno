"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FinishCard } from "@/components/home/FinishCard";
import { Section } from "@/components/layout/Section";
import { luxuryFinishes } from "@/constants/luxury-finishes";
import { motion as motionTokens } from "@/constants/design";

export function LuxuryFinishes() {
  const reduceMotion = useReducedMotion();
  const ease = motionTokens.easeLuxury;

  return (
    <Section
      id="luxury-finishes"
      tone="default"
      aria-labelledby="luxury-finishes-heading"
      className="relative overflow-hidden"
      containerClassName="relative z-10 flex flex-col gap-14 md:gap-16"
    >
      {/* Soft luxury texture — very subtle */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgb(201_161_74_/_0.07),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgb(17_17_17_/_0.04),transparent_50%)]" />
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.45'/%3E%3C/svg%3E\")",
            backgroundSize: "180px 180px",
            mixBlendMode: "soft-light",
          }}
        />
      </div>

      <motion.header
        className="mx-auto max-w-2xl text-center"
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: reduceMotion ? 0 : 0.7, ease }}
      >
        <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-accent">
          Luxury Finishes
        </p>
        <h2
          id="luxury-finishes-heading"
          className="font-display text-3xl text-primary md:text-5xl"
        >
          Choose Your Signature Finish
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-pretty text-sm leading-relaxed text-muted md:text-base">
          Each finish is crafted to elevate modern interiors with timeless
          sophistication.
        </p>
        <div className="gold-line-center mt-8" aria-hidden="true" />
      </motion.header>

      <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7">
        {luxuryFinishes.map((finish, index) => (
          <li key={finish.id}>
            <FinishCard finish={finish} index={index} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
