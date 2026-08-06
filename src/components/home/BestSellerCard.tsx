"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Eye, Heart, Star, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion as motionTokens } from "@/constants/design";
import { cn, formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import type { Product } from "@/types";

interface BestSellerCardProps {
  product: Product;
  index: number;
}

export function BestSellerCard({ product: productProp, index }: BestSellerCardProps) {
  const product = productProp;
  const imageSrc = product.images[0];
  const reduceMotion = useReducedMotion();
  const ease = motionTokens.easeLuxury;
  const addItem = useCartStore((s) => s.addItem);
  const [wishlisted, setWishlisted] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const titleId = useId();

  useEffect(() => {
    if (!quickViewOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setQuickViewOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [quickViewOpen]);

  const handleAdd = () => {
    addItem(product, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  if (!imageSrc) return null;

  return (
    <>
      <motion.article
        initial={reduceMotion ? false : { opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{
          duration: reduceMotion ? 0 : 0.7,
          delay: reduceMotion ? 0 : index * 0.1,
          ease,
        }}
        className="h-full"
      >
        <div
          className={cn(
            "group flex h-full flex-col overflow-hidden rounded-2xl bg-background",
            "shadow-[0_10px_36px_rgb(17_17_17_/_0.07)]",
            "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            "hover:-translate-y-2",
            "hover:shadow-[0_26px_60px_rgb(17_17_17_/_0.12),0_0_0_1px_rgb(201_161_74_/_0.32)]",
          )}
        >
          {/* 70–75% immersive photography */}
          <div className="relative aspect-[3/4] w-full shrink-0 overflow-hidden bg-surface">
            <Image
              src={imageSrc}
              alt={`${product.name} — ${product.tagline}`}
              fill
              loading="lazy"
              className="object-cover transition-transform duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.08]"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/50 via-primary/5 to-transparent"
              aria-hidden="true"
            />

            <span className="absolute left-4 top-4 z-10 rounded-full border border-white/35 bg-background/75 px-3.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.22em] text-primary shadow-xs backdrop-blur-md">
              {product.finish}
            </span>

            <div className="absolute right-4 top-4 z-10 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => setWishlisted((v) => !v)}
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-background/70 text-primary shadow-sm backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-accent hover:text-accent",
                  wishlisted && "border-accent bg-accent text-primary",
                )}
                aria-label={
                  wishlisted
                    ? `Remove ${product.name} from wishlist`
                    : `Add ${product.name} to wishlist`
                }
                aria-pressed={wishlisted}
              >
                <Heart
                  size={17}
                  strokeWidth={1.5}
                  className={cn(wishlisted && "fill-current")}
                />
              </button>
              <button
                type="button"
                onClick={() => setQuickViewOpen(true)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-background/70 text-primary shadow-sm backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-accent hover:text-accent"
                aria-label={`Quick view ${product.name}`}
              >
                <Eye size={17} strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* Compact editorial footer */}
          <div className="flex flex-1 flex-col px-5 pb-5 pt-5 md:px-6 md:pb-6 md:pt-6">
            <div
              className="mb-3 flex items-center gap-1 text-accent"
              aria-label="Rated 5 out of 5 stars"
            >
              {Array.from({ length: 5 }).map((_, star) => (
                <Star
                  key={star}
                  size={12}
                  strokeWidth={0}
                  className="fill-accent"
                  aria-hidden="true"
                />
              ))}
            </div>

            <h3 className="font-display text-[1.35rem] leading-[1.15] text-primary md:text-[1.55rem]">
              {product.name}
            </h3>
            <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted">
              {product.tagline}
            </p>
            <p className="mt-3 font-display text-xl tracking-normal text-primary">
              {formatPrice(product.price)}
            </p>

            <div className="mt-5">
              <Button
                type="button"
                variant="primary"
                size="md"
                className="w-full"
                onClick={handleAdd}
                aria-label={`Add ${product.name} to cart`}
              >
                {added ? "Added to Cart" : "Add to Cart"}
              </Button>
            </div>
          </div>
        </div>
      </motion.article>

      {quickViewOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-primary/55 backdrop-blur-sm"
            aria-label="Close quick view"
            onClick={() => setQuickViewOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative z-10 grid w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-background shadow-xl md:grid-cols-2"
          >
            <div className="relative aspect-[4/5] bg-surface md:min-h-[440px]">
              <Image
                src={imageSrc}
                alt={`${product.name} — ${product.tagline}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="relative flex flex-col p-6 md:p-9">
              <button
                type="button"
                onClick={() => setQuickViewOpen(false)}
                className="absolute right-4 top-4 rounded-full border border-border bg-background/90 p-2 text-primary transition-colors hover:text-accent md:right-6 md:top-6"
                aria-label="Close quick view"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
              <p className="text-[10px] uppercase tracking-[0.22em] text-accent">
                {product.finish}
              </p>
              <h3
                id={titleId}
                className="mt-3 font-display text-3xl text-primary"
              >
                {product.name}
              </h3>
              <p className="mt-2 text-sm text-muted">{product.tagline}</p>
              <p className="mt-5 font-display text-2xl text-primary">
                {formatPrice(product.price)}
              </p>
              <p className="mt-5 text-sm leading-relaxed text-text/80">
                {product.description}
              </p>
              <Button
                type="button"
                variant="primary"
                size="lg"
                className="mt-8 w-full"
                onClick={() => {
                  handleAdd();
                  setQuickViewOpen(false);
                }}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
