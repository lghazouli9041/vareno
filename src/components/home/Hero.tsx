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
    reduceMotion ? [0, 0] : [0, 120],
  );
  const contentY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [0, 60],
  );
  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.65],
    reduceMotion ? [1, 1] : [1, 0.35],
  );

  const fadeUp = (delay: number) =>
    reduceMotion
      ? { initial: false as const, animate: { opacity: 1, y: 0 } }
      : {
          initial: { opacity: 0, y: 32 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1.15, delay, ease },
        };

  return (
    <section
      ref={ref}
      className="relative flex h-dvh min-h-[760px] items-center justify-center overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <motion.div className="absolute inset-0" style={{ y: imageY }}>
        <Image
          src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=2400&q=90"
          alt="Luxury European bathroom interior with solid brass fixtures"
          fill
          priority
          className="scale-110 object-cover object-[center_40%]"
          sizes="100vw"
        />
      </motion.div>

      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/30 to-primary/85" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_10%,rgba(17,17,17,0.55)_100%)]" />
      </div>

      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-6 text-center lg:px-8"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <motion.p
          className="mb-7 font-display text-4xl font-medium tracking-[0.34em] text-inverse-text sm:text-5xl md:mb-9 md:text-6xl md:tracking-[0.38em] lg:text-7xl"
          {...fadeUp(0.05)}
        >
          {siteConfig.name}
        </motion.p>

        <motion.h1
          id="hero-heading"
          className="max-w-[16ch] text-balance font-display text-[1.85rem] font-medium leading-[1.12] text-inverse-text sm:text-4xl md:text-5xl md:leading-[1.08] lg:text-[3.25rem]"
          {...fadeUp(0.2)}
        >
          Timeless Brass.
          <br />
          Designed for Extraordinary Homes.
        </motion.h1>

        <motion.p
          className="mt-7 max-w-xl text-pretty text-[0.95rem] leading-[1.9] text-inverse-text/78 md:mt-8 md:text-lg"
          {...fadeUp(0.36)}
        >
          Luxury handcrafted faucets and accessories created from solid brass
          using traditional craftsmanship.
        </motion.p>

        <motion.div
          className="mt-11 flex w-full flex-col items-stretch justify-center gap-3.5 sm:mt-12 sm:w-auto sm:flex-row sm:gap-5"
          {...fadeUp(0.5)}
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
            Explore Craftsmanship
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
