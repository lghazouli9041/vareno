"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Star } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { motion as motionTokens } from "@/constants/design";

const stories = [
  {
    id: "sophia",
    name: "Sophia Bennett",
    profession: "Interior Designer",
    location: "New York",
    quote:
      "Every detail feels intentional. VARENO transformed our project.",
    portrait:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=85",
    featured: true,
  },
  {
    id: "daniel",
    name: "Daniel Foster",
    profession: "Architect",
    location: "California",
    quote:
      "The finish quality rivals anything we've specified before.",
    portrait:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=85",
    featured: false,
  },
  {
    id: "emma",
    name: "Emma Richardson",
    profession: "Luxury Homeowner",
    location: "Florida",
    quote:
      "Our kitchen became the centerpiece of the entire house.",
    portrait:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=85",
    featured: false,
  },
  {
    id: "michael",
    name: "Michael Hayes",
    profession: "Builder",
    location: "Texas",
    quote:
      "Installation was flawless and the craftsmanship is exceptional.",
    portrait:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=85",
    featured: false,
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

export function CustomerStories() {
  const reduceMotion = useReducedMotion();
  const ease = motionTokens.easeLuxury;
  const featured = stories.find((story) => story.featured)!;
  const secondary = stories.filter((story) => !story.featured);

  return (
    <Section
      id="customer-stories"
      tone="default"
      aria-labelledby="customer-stories-heading"
      containerClassName="flex flex-col gap-14 md:gap-16"
    >
      <motion.header
        className="mx-auto max-w-2xl text-center"
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: reduceMotion ? 0 : 0.7, ease }}
      >
        <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-accent">
          Customer Stories
        </p>
        <h2
          id="customer-stories-heading"
          className="font-display text-3xl text-primary md:text-5xl"
        >
          Trusted by Designers and Homeowners
        </h2>
        <div className="gold-line-center mt-7" aria-hidden="true" />
        <p className="mx-auto mt-7 max-w-xl text-pretty text-sm leading-relaxed text-muted md:text-base">
          See why architects, interior designers and discerning homeowners choose
          VARENO for their most important projects.
        </p>
      </motion.header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
        <motion.blockquote
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: reduceMotion ? 0 : 0.7, ease }}
          className="group flex h-full flex-col justify-between rounded-2xl border border-border/70 bg-background p-8 shadow-sm transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-accent/35 hover:shadow-lg md:p-10 lg:p-12"
        >
          <div>
            <Stars />
            <p className="mt-8 font-display text-2xl leading-[1.35] text-primary md:text-3xl md:leading-[1.35]">
              “{featured.quote}”
            </p>
          </div>
          <footer className="mt-10 flex items-center gap-4 border-t border-border/80 pt-8">
            <div className="relative h-16 w-16 overflow-hidden rounded-full bg-surface shadow-sm ring-1 ring-border/80">
              <Image
                src={featured.portrait}
                alt={featured.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="64px"
              />
            </div>
            <div>
              <cite className="not-italic font-display text-xl text-primary">
                {featured.name}
              </cite>
              <p className="mt-1 text-sm text-muted">
                {featured.profession} · {featured.location}
              </p>
            </div>
          </footer>
        </motion.blockquote>

        <ul className="flex flex-col gap-6">
          {secondary.map((story, index) => (
            <motion.li
              key={story.id}
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: reduceMotion ? 0 : 0.6,
                delay: reduceMotion ? 0 : (index + 1) * 0.08,
                ease,
              }}
            >
              <blockquote className="group rounded-2xl border border-border/70 bg-background p-6 shadow-sm transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-accent/35 hover:shadow-md md:p-7">
                <Stars />
                <p className="mt-4 text-base leading-relaxed text-primary md:text-[1.05rem]">
                  “{story.quote}”
                </p>
                <footer className="mt-6 flex items-center gap-3">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full bg-surface ring-1 ring-border/80">
                    <Image
                      src={story.portrait}
                      alt={story.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="48px"
                    />
                  </div>
                  <div>
                    <cite className="not-italic text-sm font-medium text-primary">
                      {story.name}
                    </cite>
                    <p className="text-xs text-muted">
                      {story.profession} · {story.location}
                    </p>
                  </div>
                </footer>
              </blockquote>
            </motion.li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
