"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { motion as motionTokens } from "@/constants/design";

export function AboutExperience() {
  const reduceMotion = useReducedMotion();
  const ease = motionTokens.easeLuxury;

  return (
    <>
      <section className="relative flex min-h-[75vh] items-end overflow-hidden pb-16 pt-36 md:min-h-[85vh] md:pb-24">
        <Image
          src="https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=2400&q=90"
          alt="Luxury interior with warm brass accents"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-primary/20"
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
              About VARENO
            </p>
            <h1 className="mt-5 font-display text-4xl leading-[1.08] text-inverse-text md:text-6xl lg:text-7xl">
              A philosophy of living metal.
            </h1>
            <p className="mt-7 max-w-xl text-sm leading-[1.9] text-inverse-text/75 md:text-base">
              We believe brass should be solid, handmade, and allowed to age—
              hardware that becomes part of a home’s memory.
            </p>
          </motion.div>
        </Container>
      </section>

      <Section tone="default" aria-labelledby="philosophy-heading">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: reduceMotion ? 0 : 0.95, ease }}
            className="relative aspect-[4/5] overflow-hidden bg-surface"
          >
            <Image
              src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1600&q=88"
              alt="Hand finishing a brass faucet"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: reduceMotion ? 0 : 0.9, ease }}
          >
            <p className="text-[11px] uppercase tracking-[0.32em] text-accent">
              Philosophy
            </p>
            <h2
              id="philosophy-heading"
              className="mt-4 font-display text-3xl text-primary md:text-5xl"
            >
              Quiet luxury.
              <br />
              Honest material.
            </h2>
            <div className="gold-line mt-7" aria-hidden="true" />
            <p className="mt-7 text-sm leading-[1.95] text-muted md:text-base">
              VARENO exists for interiors that reject fashion cycles. We work
              exclusively in solid brass—casting, machining, and finishing each
              silhouette until it feels inevitable in a room. Our references are
              European ateliers and the great bath houses of design history—not
              the catalog aisle.
            </p>
            <p className="mt-5 text-sm leading-[1.95] text-muted md:text-base">
              From kitchen taps to the smallest robe hook, every object is made
              to carry weight, warmth, and time.
            </p>
            <div className="mt-10">
              <Button href="/craftsmanship" variant="outline">
                Explore Craftsmanship
              </Button>
            </div>
          </motion.div>
        </div>
      </Section>

      <Section tone="surface" aria-labelledby="values-heading">
        <h2
          id="values-heading"
          className="text-center font-display text-3xl text-primary md:text-5xl"
        >
          What we refuse to compromise
        </h2>
        <ul className="mx-auto mt-14 grid max-w-5xl gap-10 md:grid-cols-3 md:gap-12">
          {[
            {
              title: "Solid Brass",
              body: "Never hollow plating. Density you can feel the moment you lift the piece.",
            },
            {
              title: "Hand Finish",
              body: "Polished, antique, or aged—each surface is brought to life by hand.",
            },
            {
              title: "Generational Design",
              body: "Silhouettes composed to remain beautiful long after trends dissolve.",
            },
          ].map((item, index) => (
            <motion.li
              key={item.title}
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: reduceMotion ? 0 : 0.8,
                delay: reduceMotion ? 0 : index * 0.1,
                ease,
              }}
              className="text-center"
            >
              <h3 className="font-display text-2xl text-primary">{item.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                {item.body}
              </p>
            </motion.li>
          ))}
        </ul>
      </Section>

      <Section tone="inverse" aria-labelledby="about-cta">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="about-cta"
            className="font-display text-3xl text-inverse-text md:text-5xl"
          >
            Visit the collection
          </h2>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button href="/shop" variant="gold" size="lg">
              Shop Brass
            </Button>
            <Button
              href="/contact"
              variant="outline"
              size="lg"
              className="border-inverse-text/40 text-inverse-text hover:bg-inverse-text hover:text-primary"
            >
              Speak with Concierge
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
