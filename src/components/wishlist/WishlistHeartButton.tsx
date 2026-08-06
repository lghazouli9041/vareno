"use client";

import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Heart } from "lucide-react";
import { motion as motionTokens } from "@/constants/design";
import { cn } from "@/lib/utils";

interface WishlistHeartButtonProps {
  active: boolean;
  onClick: (event: React.MouseEvent) => void;
  className?: string;
  size?: number;
  label?: string;
}

function WishlistHeartButtonComponent({
  active,
  onClick,
  className,
  size = 16,
  label,
}: WishlistHeartButtonProps) {
  const reduceMotion = useReducedMotion();
  const ease = motionTokens.easeLuxury;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "pointer-events-auto inline-flex h-10 w-10 items-center justify-center border border-border/70 bg-background/90 text-primary backdrop-blur-md transition-colors hover:border-accent hover:text-accent",
        className,
      )}
      aria-label={
        label ?? (active ? "Remove from wishlist" : "Add to wishlist")
      }
      aria-pressed={active}
    >
      <motion.span
        key={active ? "on" : "off"}
        initial={reduceMotion ? false : { scale: 0.7, opacity: 0.6 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.28, ease }}
        className="inline-flex"
      >
        <Heart
          size={size}
          strokeWidth={1.5}
          className={cn(active && "fill-current text-accent")}
        />
      </motion.span>
    </button>
  );
}

export const WishlistHeartButton = memo(WishlistHeartButtonComponent);
