"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { craftsmanshipTimeline } from "@/config/collections";
import { motion as motionTokens } from "@/constants/design";

export function CraftsmanshipStory() {
  const reduceMotion = useReducedMotion();
  const ease = motionTokens.easeLuxury;

  return (
    <>
      <section className="relative flex min-h-[70vh] items-end overflow-hidden pb-16 pt-36 md:min-h-[80vh] md:pb-24">
        <Image
          src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=2400&q=90"
          alt="Artisan workshop finishing solid brass fixtures"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-primary via-primary/45 to-primary/25"
          aria-hidden="true"
        />
        <Container className="relative z-10">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 1.1, ease }}
            className="max-w-3xl"
          >
            <p className="text-[11px] uppercase tracking-[0.32em] text-accent">
              The Atelier
            </p>
            <h1 className="mt-5 font-display text-4xl leading-[1.08] text-inverse-text md:text-6xl lg:text-7xl">
              Made by Hand.
              <br />
              Measured in Generations.
            </h1>
            <p className="mt-7 max-w-xl text-sm leading-[1.9] text-inverse-text/75 md:text-base">
              VARENO fixtures are not assembled—they are forged, finished, and
              inspected through a process that refuses haste.
            </p>
          </motion.div>
        </Container>
      </section>

      <Section tone="default" aria-labelledby="process-heading">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] uppercase tracking-[0.32em] text-accent">
            Process
          </p>
          <h2
            id="process-heading"
            className="mt-4 font-display text-3xl text-primary md:text-5xl"
          >
            The Craftsmanship Timeline
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-muted md:text-base">
            Five disciplined stages—from traditional casting to white-glove
            packaging.
          </p>
        </div>

        <ol className="mt-16 space-y-20 md:mt-24 md:space-y-28">
          {craftsmanshipTimeline.map((step, index) => {
            const reverse = index % 2 === 1;
            return (
              <motion.li
                key={step.id}
                initial={reduceMotion ? false : { opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.95,
                  delay: reduceMotion ? 0 : 0.05,
                  ease,
                }}
                className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
                  reverse ? "lg:[&>div:first-child]:order-2" : ""
                }`}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-surface">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                <div className={reverse ? "lg:pr-8" : "lg:pl-8"}>
                  <span className="font-display text-5xl text-accent/40 md:text-6xl">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 font-display text-3xl text-primary md:text-4xl">
                    {step.title}
                  </h3>
                  <div className="gold-line mt-6" aria-hidden="true" />
                  <p className="mt-6 max-w-md text-sm leading-[1.95] text-muted md:text-base">
                    {step.body}
                  </p>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </Section>

      <Section tone="inverse" aria-labelledby="craft-cta">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="craft-cta"
            className="font-display text-3xl text-inverse-text md:text-5xl"
          >
            Experience the Collection
          </h2>
          <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-inverse-text/55">
            Solid brass fixtures finished for homes that value permanence.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button href="/shop" variant="gold" size="lg">
              Shop Collection
            </Button>
            <Button
              href="/about"
              variant="outline"
              size="lg"
              className="border-inverse-text/40 text-inverse-text hover:bg-inverse-text hover:text-primary"
            >
              Our Philosophy
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
