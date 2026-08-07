"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Star } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { motion as motionTokens } from "@/constants/design";

const reviews = [
  {
    id: "claire",
    name: "Claire Moreau",
    role: "Interior Designer · Paris",
    quote:
      "The brass has a depth you cannot find in plated hardware. VARENO feels like true atelier work—warm, substantial, and endlessly elegant.",
  },
  {
    id: "james",
    name: "James Whitfield",
    role: "Architect · London",
    quote:
      "We specify VARENO when a project needs quiet luxury. The handmade finish reads as vintage European without ever feeling costume.",
  },
  {
    id: "elena",
    name: "Elena Rossi",
    role: "Homeowner · Milan",
    quote:
      "From the kitchen faucet to the smallest hook, every piece arrived with the weight and polish of something meant to last generations.",
  },
] as const;

function Stars() {
  return (
    <div
      className="flex items-center gap-1 text-accent"
      aria-label="Rated 5 out of 5 stars"
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          size={12}
          strokeWidth={0}
          className="fill-accent"
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export function CustomerReviews() {
  const reduceMotion = useReducedMotion();
  const ease = motionTokens.easeLuxury;

  return (
    <Section
      id="testimonials"
      tone="surface"
      aria-labelledby="testimonials-heading"
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
          Testimonials
        </p>
        <h2
          id="testimonials-heading"
          className="font-display text-3xl text-primary md:text-5xl"
        >
          Voices of Distinction
        </h2>
      </motion.header>

      <ul className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-7">
        {reviews.map((review, index) => (
          <motion.li
            key={review.id}
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{
              duration: reduceMotion ? 0 : 0.85,
              delay: reduceMotion ? 0 : index * 0.1,
              ease,
            }}
          >
            <blockquote className="flex h-full flex-col border border-border bg-background px-7 py-10 transition-all duration-500 hover:-translate-y-1 hover:border-accent/35 hover:shadow-md md:px-8 md:py-11">
              <span
                className="font-display text-5xl leading-none text-accent/70"
                aria-hidden="true"
              >
                “
              </span>
              <div className="mt-4">
                <Stars />
              </div>
              <p className="mt-5 flex-1 text-sm leading-[1.9] text-primary md:text-[0.95rem]">
                {review.quote}
              </p>
              <footer className="mt-8 border-t border-border pt-6">
                <cite className="not-italic font-display text-xl text-primary">
                  {review.name}
                </cite>
                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted">
                  {review.role}
                </p>
              </footer>
            </blockquote>
          </motion.li>
        ))}
      </ul>
    </Section>
  );
}
