"use client";

import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";
import { motion as motionTokens } from "@/constants/design";

const ease = motionTokens.easeLuxury;

export function Hero() {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [0, 140],
  );
  const contentY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [0, 70],
  );
  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.7],
    reduceMotion ? [1, 1] : [1, 0.25],
  );

  const fadeUp = (delay: number) =>
    reduceMotion
      ? { initial: false as const, animate: { opacity: 1, y: 0 } }
      : {
          initial: { opacity: 0, y: 36 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1.2, delay, ease },
        };

  return (
    <section
      ref={ref}
      className="relative flex h-dvh min-h-[780px] items-center justify-center overflow-hidden bg-primary"
      aria-labelledby="hero-heading"
    >
      <motion.div className="absolute inset-0" style={{ y: imageY }}>
        <Image
          src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=2400&q=90"
          alt="Dark luxury European interior with solid brass fixtures"
          fill
          priority
          className="scale-110 object-cover object-[center_38%] brightness-[0.72]"
          sizes="100vw"
        />
      </motion.div>

      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/40 to-primary/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_5%,rgba(17,17,17,0.65)_100%)]" />
      </div>

      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-6 text-center lg:px-8"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <motion.p
          className="mb-8 font-display text-4xl font-medium tracking-[0.36em] text-inverse-text sm:text-5xl md:mb-10 md:text-6xl md:tracking-[0.4em] lg:text-7xl"
          {...fadeUp(0.05)}
        >
          {siteConfig.name}
        </motion.p>

        <motion.h1
          id="hero-heading"
          className="max-w-[18ch] text-balance font-display text-[1.9rem] font-medium leading-[1.12] text-inverse-text sm:text-4xl md:text-5xl md:leading-[1.08] lg:text-[3.35rem]"
          {...fadeUp(0.2)}
        >
          Timeless Brass.
          <br />
          Designed for Extraordinary Homes.
        </motion.h1>

        <motion.p
          className="mt-8 max-w-xl text-pretty text-[0.95rem] leading-[1.95] text-inverse-text/75 md:mt-9 md:text-lg"
          {...fadeUp(0.38)}
        >
          Handcrafted brass faucets and accessories created from solid brass
          using traditional craftsmanship.
        </motion.p>

        <motion.div
          className="mt-12 flex w-full flex-col items-stretch justify-center gap-3.5 sm:w-auto sm:flex-row sm:gap-5"
          {...fadeUp(0.52)}
        >
          <Button href="/shop" size="lg" variant="gold">
            Shop Collection
          </Button>
          <Button
            href="/craftsmanship"
            size="lg"
            variant="outline"
            className="border-inverse-text/45 bg-transparent text-inverse-text hover:border-inverse-text hover:bg-inverse-text hover:text-primary"
          >
            Discover Craftsmanship
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
