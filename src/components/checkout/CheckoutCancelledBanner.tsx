"use client";

import { motion, useReducedMotion } from "framer-motion";
import { motion as motionTokens } from "@/constants/design";

export function CheckoutCancelledBanner() {
  const reduceMotion = useReducedMotion();
  const ease = motionTokens.easeLuxury;

  return (
    <motion.div
      role="status"
      aria-live="polite"
      className="border-b border-border bg-secondary/80"
      initial={reduceMotion ? false : { opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.4, ease }}
    >
      <div className="mx-auto max-w-7xl px-6 py-3.5 text-center text-sm text-muted lg:px-8">
        Payment was cancelled. Your bag is still saved — you can review details
        and try again when ready.
      </div>
    </motion.div>
  );
}
