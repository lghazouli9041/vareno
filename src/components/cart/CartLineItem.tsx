"use client";

import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Heart, Minus, Plus, Trash2 } from "lucide-react";
import { motion as motionTokens } from "@/constants/design";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import type { CartItem } from "@/types";

interface CartLineItemProps {
  item: CartItem;
  compact?: boolean;
  showSaveForLater?: boolean;
  showWishlistShortcut?: boolean;
}

function CartLineItemComponent({
  item,
  compact = false,
  showSaveForLater = false,
  showWishlistShortcut = false,
}: CartLineItemProps) {
  const reduceMotion = useReducedMotion();
  const ease = motionTokens.easeLuxury;
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const wishlisted = useWishlistStore((s) => s.has(item.product.id));

  const image = item.product.images[0] ?? "/brand/monogram.svg";
  const lineTotal = item.product.price * item.quantity;
  const inStock = item.product.inStock !== false;
  const variantLabel = item.product.finish;

  const saveForLater = () => {
    toggleWishlist({
      productId: item.product.id,
      slug: item.product.slug,
    });
    removeItem(item.product.id);
  };

  const addToWishlist = () => {
    toggleWishlist({
      productId: item.product.id,
      slug: item.product.slug,
    });
  };

  return (
    <motion.li
      layout={!reduceMotion}
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={
        reduceMotion
          ? undefined
          : { opacity: 0, height: 0, marginBottom: 0, y: -8, overflow: "hidden" }
      }
      transition={{ duration: reduceMotion ? 0 : 0.35, ease }}
      className={
        compact
          ? "flex gap-4 border-b border-border/70 pb-6 last:border-0"
          : "flex flex-col gap-5 border-b border-border py-8 sm:flex-row sm:gap-6"
      }
    >
      <Link
        href={`/products/${item.product.slug}`}
        className={
          compact
            ? "relative h-32 w-28 shrink-0 overflow-hidden bg-surface"
            : "relative aspect-[3/4] w-full shrink-0 overflow-hidden bg-surface sm:h-44 sm:w-36 sm:aspect-auto"
        }
      >
        <Image
          src={image}
          alt={item.product.name}
          fill
          className="object-cover"
          sizes={compact ? "112px" : "180px"}
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Link
              href={`/products/${item.product.slug}`}
              className={
                compact
                  ? "font-display text-lg leading-tight text-primary transition-colors hover:text-accent"
                  : "font-display text-xl leading-tight text-primary transition-colors hover:text-accent md:text-2xl"
              }
            >
              {item.product.name}
            </Link>
            <p className="mt-2 text-xs uppercase tracking-[0.16em] text-muted">
              Finish · {variantLabel}
            </p>
            {!compact && (
              <>
                {item.product.collectionName && (
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted">
                    {item.product.collectionName}
                  </p>
                )}
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted">
                  Variant · {variantLabel}
                </p>
              </>
            )}
            <p
              className={`mt-2 text-sm ${inStock ? "text-primary" : "text-error"}`}
            >
              {inStock ? "In stock" : "Currently unavailable"}
            </p>
            {!compact && (
              <p className="mt-1 text-sm text-muted">
                Est. delivery {inStock ? "5–7 business days" : "—"}
              </p>
            )}
          </div>
          <div className="shrink-0 text-right">
            <motion.p
              key={lineTotal}
              initial={reduceMotion ? false : { opacity: 0.4 }}
              animate={{ opacity: 1 }}
              className="font-display text-lg text-primary md:text-xl"
            >
              {formatPrice(lineTotal)}
            </motion.p>
            {!compact && item.quantity > 1 && (
              <p className="mt-1 text-xs text-muted">
                {formatPrice(item.product.price)} each
              </p>
            )}
          </div>
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
          <div className="inline-flex items-stretch border border-border">
            <button
              type="button"
              className="px-3.5 py-2.5 text-primary transition-colors hover:text-accent"
              onClick={() =>
                updateQuantity(item.product.id, item.quantity - 1)
              }
              aria-label={`Decrease quantity of ${item.product.name}`}
            >
              <Minus size={14} strokeWidth={1.5} />
            </button>
            <motion.span
              key={item.quantity}
              initial={reduceMotion ? false : { opacity: 0.35, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="min-w-10 border-x border-border px-2 py-2.5 text-center text-sm"
              aria-live="polite"
            >
              {item.quantity}
            </motion.span>
            <button
              type="button"
              className="px-3.5 py-2.5 text-primary transition-colors hover:text-accent"
              onClick={() =>
                updateQuantity(item.product.id, item.quantity + 1)
              }
              aria-label={`Increase quantity of ${item.product.name}`}
            >
              <Plus size={14} strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex items-center gap-4">
            {showWishlistShortcut && (
              <button
                type="button"
                onClick={addToWishlist}
                className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-accent"
                aria-label={
                  wishlisted
                    ? `Remove ${item.product.name} from wishlist`
                    : `Add ${item.product.name} to wishlist`
                }
              >
                <Heart
                  size={14}
                  strokeWidth={1.5}
                  className={wishlisted ? "fill-accent text-accent" : undefined}
                />
                Wishlist
              </button>
            )}
            {showSaveForLater && (
              <button
                type="button"
                onClick={saveForLater}
                className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-accent"
              >
                <Heart size={14} strokeWidth={1.5} />
                Save for later
              </button>
            )}
            <button
              type="button"
              onClick={() => removeItem(item.product.id)}
              className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-error"
              aria-label={`Remove ${item.product.name} from cart`}
            >
              <Trash2 size={14} strokeWidth={1.5} />
              Remove
            </button>
          </div>
        </div>
      </div>
    </motion.li>
  );
}

export const CartLineItem = memo(CartLineItemComponent);
