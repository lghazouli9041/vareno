"use client";

import { useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Section } from "@/components/layout/Section";
import { motion as motionTokens } from "@/constants/design";

export function Newsletter() {
  const reduceMotion = useReducedMotion();
  const ease = motionTokens.easeLuxury;
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success">("idle");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;
    setStatus("success");
    setEmail("");
  };

  return (
    <Section
      id="newsletter"
      tone="inverse"
      aria-labelledby="newsletter-heading"
      className="relative overflow-hidden"
      containerClassName="relative z-10 mx-auto flex max-w-2xl flex-col items-center text-center"
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 30% 20%, rgba(182,141,64,0.16), transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(182,141,64,0.1), transparent 45%)",
        }}
      />

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: reduceMotion ? 0 : 1, ease }}
        className="relative w-full"
      >
        <p className="mb-5 text-[11px] uppercase tracking-[0.32em] text-accent">
          Concierge List
        </p>
        <h2
          id="newsletter-heading"
          className="font-display text-3xl text-inverse-text md:text-5xl"
        >
          Join the VARENO Collection
        </h2>
        <div className="gold-line-center mt-8" aria-hidden="true" />
        <p className="mx-auto mt-8 max-w-md text-pretty text-sm leading-relaxed text-inverse-text/55 md:text-base">
          Early access to new brass pieces and private atelier correspondence.
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-10 flex w-full flex-col gap-3 sm:flex-row"
        >
          <label htmlFor="home-newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="home-newsletter-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (status === "success") setStatus("idle");
            }}
            placeholder="Your email address"
            className="min-h-12 flex-1 border border-inverse-text/20 bg-transparent px-5 text-sm text-inverse-text placeholder:text-inverse-text/35 focus:border-accent focus:outline-none"
          />
          <button
            type="submit"
            className="min-h-12 bg-accent px-8 text-[11px] font-medium uppercase tracking-[0.22em] text-primary transition-colors duration-500 hover:bg-accent-hover"
          >
            Subscribe
          </button>
        </form>

        <p
          className="mt-4 min-h-5 text-xs text-inverse-text/40"
          role="status"
          aria-live="polite"
        >
          {status === "success"
            ? "Thank you. You are on the private list."
            : "Considered correspondence only."}
        </p>
      </motion.div>
    </Section>
  );
}
