"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";
import { motion as motionTokens } from "@/constants/design";

const ease = motionTokens.easeLuxury;

export function Hero() {
  const reduceMotion = useReducedMotion();

  const fadeUp = (delay: number) =>
    reduceMotion
      ? { initial: false as const, animate: { opacity: 1, y: 0 } }
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1, delay, ease },
        };

  return (
    <section
      className="relative flex h-dvh min-h-[680px] items-center justify-center overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <Image
        src="https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=2400&q=90"
        alt="Ultra-premium marble bathroom with a sculptural high-end faucet"
        fill
        priority
        className="scale-105 object-cover object-[center_40%] transition-transform duration-[12s] ease-out motion-safe:hover:scale-110"
        sizes="100vw"
      />

      {/* Cinematic multi-layer overlay */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/30 to-primary/82" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/75 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(17,17,17,0.12)_0%,rgba(17,17,17,0.48)_55%,rgba(17,17,17,0.82)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-primary/55 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-4xl -translate-y-[100px] flex-col items-center px-6 text-center lg:px-8">
        <motion.p
          className="mb-5 font-display text-xs uppercase tracking-[0.45em] text-accent drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)] md:mb-8 md:text-sm"
          {...fadeUp(0.1)}
        >
          {siteConfig.name}
        </motion.p>

        <motion.h1
          id="hero-heading"
          className="max-w-[17ch] text-balance font-display text-[2.4rem] font-medium leading-[1.1] tracking-[-0.02em] text-inverse-text drop-shadow-[0_8px_32px_rgba(0,0,0,0.35)] sm:text-5xl sm:leading-[1.08] md:text-6xl md:leading-[1.06] lg:text-[4.35rem] lg:leading-[1.04]"
          {...fadeUp(0.22)}
        >
          Luxury Faucets Designed to Last a Lifetime
        </motion.h1>

        <motion.div
          className="gold-line-center my-8 md:my-10"
          aria-hidden="true"
          {...(reduceMotion
            ? { initial: false, animate: { opacity: 1 } }
            : {
                initial: { opacity: 0, scaleX: 0.35 },
                animate: { opacity: 1, scaleX: 1 },
                transition: { duration: 0.9, delay: 0.38, ease },
              })}
        />

        <motion.p
          className="mb-10 max-w-lg text-pretty text-[0.98rem] leading-[1.8] text-inverse-text/82 md:mb-12 md:text-lg md:leading-[1.85]"
          {...fadeUp(0.42)}
        >
          Premium kitchen and bathroom fixtures crafted with architectural
          precision and timeless elegance.
        </motion.p>

        <motion.div
          className="flex w-full flex-col items-stretch justify-center gap-3.5 sm:w-auto sm:flex-row sm:items-center sm:gap-5"
          {...fadeUp(0.55)}
        >
          <Button
            href="/shop"
            size="lg"
            variant="gold"
            className="shadow-[0_14px_42px_rgb(201_161_74_/_0.32)]"
          >
            Shop Collection
          </Button>
          <Button
            href="/about"
            size="lg"
            variant="outline"
            className="border-inverse-text/45 bg-primary/15 text-inverse-text shadow-[0_10px_32px_rgb(0_0_0_/_0.28)] backdrop-blur-md hover:border-inverse-text hover:bg-inverse-text hover:text-primary hover:shadow-[0_14px_40px_rgb(0_0_0_/_0.35)]"
          >
            Discover Craftsmanship
          </Button>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2.5"
        aria-hidden="true"
        {...(reduceMotion
          ? { initial: false, animate: { opacity: 0.7 } }
          : {
              initial: { opacity: 0 },
              animate: { opacity: 0.7 },
              transition: { duration: 1.2, delay: 1, ease },
            })}
      >
        <span className="text-[9px] uppercase tracking-[0.38em] text-inverse-text/50">
          Scroll
        </span>
        <span className="relative flex h-12 w-px justify-center overflow-hidden bg-inverse-text/15">
          <motion.span
            className="absolute inset-x-0 top-0 h-5 bg-gradient-to-b from-accent/90 to-transparent"
            animate={
              reduceMotion
                ? undefined
                : {
                    y: ["-100%", "140%"],
                    opacity: [0, 0.9, 0],
                  }
            }
            transition={
              reduceMotion
                ? undefined
                : {
                    duration: 2.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    repeatDelay: 0.4,
                  }
            }
          />
        </span>
      </motion.div>
    </section>
  );
}
