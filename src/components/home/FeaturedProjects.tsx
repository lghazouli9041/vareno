"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/layout/Section";
import { motion as motionTokens } from "@/constants/design";

const projects = [
  {
    id: "hudson",
    name: "The Hudson Residence",
    location: "New York",
    description:
      "Warm travertine bathroom featuring brushed brass wall-mounted fixtures.",
    image:
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1600&q=90",
    imageAlt: "Luxury travertine bathroom in a New York residence",
    featured: true,
  },
  {
    id: "pacific",
    name: "Pacific House",
    location: "California",
    description:
      "Minimal architecture with matte black kitchen collection.",
    image:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1400&q=90",
    imageAlt: "Minimal California kitchen with refined black fixtures",
    featured: false,
  },
  {
    id: "aspen",
    name: "Aspen Retreat",
    location: "Colorado",
    description:
      "Mountain residence combining walnut, stone and polished chrome.",
    image:
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1400&q=90",
    imageAlt: "Mountain luxury interior with walnut and stone materials",
    featured: false,
  },
] as const;

function ProjectCard({
  project,
  index,
  large = false,
}: {
  project: (typeof projects)[number];
  index: number;
  large?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const ease = motionTokens.easeLuxury;

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: reduceMotion ? 0 : 0.7,
        delay: reduceMotion ? 0 : index * 0.1,
        ease,
      }}
      className="h-full"
    >
      <Link
        href="/projects"
        aria-label={`View project ${project.name} in ${project.location}`}
        className="group flex h-full flex-col outline-none"
      >
        <div
          className={`relative overflow-hidden rounded-2xl bg-surface shadow-sm transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1 group-hover:shadow-lg group-focus-visible:ring-2 group-focus-visible:ring-accent group-focus-visible:ring-offset-4 ${
            large ? "aspect-[4/5] md:aspect-[5/6] lg:aspect-auto lg:min-h-full" : "aspect-[16/11]"
          }`}
        >
          <Image
            src={project.image}
            alt={project.imageAlt}
            fill
            className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
            sizes={
              large
                ? "(max-width: 1024px) 100vw, 55vw"
                : "(max-width: 1024px) 100vw, 40vw"
            }
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-primary/55 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-90"
            aria-hidden="true"
          />
        </div>

        <div className="mt-5 flex items-start justify-between gap-4 md:mt-6">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.22em] text-accent">
              {project.location}
            </p>
            <h3 className="mt-2 font-display text-2xl text-primary transition-colors duration-300 group-hover:text-accent md:text-[1.75rem]">
              {project.name}
            </h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
              {project.description}
            </p>
          </div>
          <span
            className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-primary transition-all duration-500 group-hover:border-accent group-hover:bg-accent group-hover:text-primary"
            aria-hidden="true"
          >
            <ArrowUpRight size={16} strokeWidth={1.5} />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}

export function FeaturedProjects() {
  const reduceMotion = useReducedMotion();
  const ease = motionTokens.easeLuxury;
  const [featured, ...rest] = projects;

  return (
    <Section
      id="featured-projects"
      tone="surface"
      aria-labelledby="featured-projects-heading"
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
          Featured Projects
        </p>
        <h2
          id="featured-projects-heading"
          className="font-display text-3xl text-primary md:text-5xl"
        >
          Spaces Designed Around VARENO
        </h2>
        <div className="gold-line-center mt-7" aria-hidden="true" />
        <p className="mx-auto mt-7 max-w-xl text-pretty text-sm leading-relaxed text-muted md:text-base">
          Discover how architects and designers integrate VARENO fixtures into
          exceptional kitchens and bathrooms across luxury residences.
        </p>
      </motion.header>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8 lg:items-stretch">
        <ProjectCard project={featured} index={0} large />
        <div className="flex flex-col gap-10 lg:gap-8">
          {rest.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index + 1}
            />
          ))}
        </div>
      </div>

      <motion.div
        className="flex justify-center"
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: reduceMotion ? 0 : 0.6, delay: 0.15, ease }}
      >
        <Button href="/projects" variant="outline" size="lg">
          View All Projects
        </Button>
      </motion.div>
    </Section>
  );
}
