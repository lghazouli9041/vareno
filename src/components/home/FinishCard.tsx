"use client";

import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import type { LuxuryFinish } from "@/constants/luxury-finishes";
import { motion as motionTokens } from "@/constants/design";

interface FinishCardProps {
  finish: LuxuryFinish;
  index: number;
}

export function FinishCard({ finish, index }: FinishCardProps) {
  const reduceMotion = useReducedMotion();
  const ease = motionTokens.easeLuxury;
  const cardRef = useRef<HTMLElement>(null);

  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const shiftX = useMotionValue(0);
  const shiftY = useMotionValue(0);

  const springGlareX = useSpring(glareX, { stiffness: 100, damping: 20 });
  const springGlareY = useSpring(glareY, { stiffness: 100, damping: 20 });
  const springShiftX = useSpring(shiftX, { stiffness: 140, damping: 22 });
  const springShiftY = useSpring(shiftY, { stiffness: 140, damping: 22 });

  const glare = useMotionTemplate`radial-gradient(380px circle at ${springGlareX}% ${springGlareY}%, rgb(255 255 255 / 0.2), transparent 55%)`;

  const onMove = (event: React.MouseEvent<HTMLElement>) => {
    if (reduceMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    glareX.set(px * 100);
    glareY.set(py * 100);
    shiftX.set((px - 0.5) * 10);
    shiftY.set((py - 0.5) * 8);
  };

  const onLeave = () => {
    glareX.set(50);
    glareY.set(40);
    shiftX.set(0);
    shiftY.set(0);
  };

  return (
    <motion.article
      ref={cardRef}
      onMouseMove={onMove}
      onMouseEnter={onMove}
      onMouseLeave={onLeave}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: reduceMotion ? 0 : 0.65,
        delay: reduceMotion ? 0 : index * 0.08,
        ease,
      }}
      whileHover={
        reduceMotion
          ? undefined
          : { y: -8, scale: 1.015, transition: { duration: 0.45, ease } }
      }
      className="group relative overflow-hidden rounded-2xl border border-border/80 bg-background/70 p-7 shadow-sm backdrop-blur-md transition-[border-color,box-shadow] duration-500 hover:border-accent/40 hover:shadow-[0_18px_50px_rgb(17_17_17_/_0.1),0_0_40px_rgb(201_161_74_/_0.12)] md:p-8"
    >
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: glare }}
        aria-hidden="true"
      />

      <div className="relative flex flex-col items-center text-center">
        <div
          className="relative mb-7 flex h-28 w-28 items-center justify-center md:h-32 md:w-32"
          aria-hidden="true"
        >
          <span
            className="absolute inset-2 rounded-full blur-2xl transition-opacity duration-500 group-hover:opacity-90"
            style={{
              background: `radial-gradient(circle, ${finish.highlight}88 0%, transparent 70%)`,
              opacity: 0.55,
            }}
          />
          <motion.span
            className="relative h-24 w-24 rounded-full border border-white/30 shadow-[inset_0_2px_10px_rgb(255_255_255_/_0.35),inset_0_-8px_16px_rgb(0_0_0_/_0.28),0_12px_28px_rgb(17_17_17_/_0.18)] transition-transform duration-500 group-hover:scale-105 md:h-28 md:w-28"
            style={{
              background: `radial-gradient(circle at 32% 28%, ${finish.highlight} 0%, ${finish.hex} 42%, ${finish.shadow} 100%)`,
              x: reduceMotion ? 0 : springShiftX,
              y: reduceMotion ? 0 : springShiftY,
            }}
          />
        </div>

        <h3 className="font-display text-xl text-primary md:text-2xl">
          {finish.name}
        </h3>
        <p className="mt-2 max-w-[16rem] text-sm leading-relaxed text-muted">
          {finish.description}
        </p>
      </div>
    </motion.article>
  );
}
