"use client";

import Image from "next/image";
import Link from "next/link";
import { memo, useCallback, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion as motionTokens } from "@/constants/design";
import { useCatalogSnapshot } from "@/hooks/useCatalogSnapshot";
import { catalogToCartProduct } from "@/lib/catalog-to-cart";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { useWishlistStore, type WishlistEntry } from "@/store/wishlist";

interface WishlistCardProps {
  entry: WishlistEntry;
  index?: number;
}

function WishlistCardComponent({ entry, index = 0 }: WishlistCardProps) {
  const reduceMotion = useReducedMotion();
  const ease = motionTokens.easeLuxury;
  const remove = useWishlistStore((s) => s.remove);
  const addItem = useCartStore((s) => s.addItem);
  const [moving, setMoving] = useState(false);
  const { products, collectionNames, ready } = useCatalogSnapshot();

  const product = useMemo(
    () =>
      products.find((item) => item.id === entry.productId) ??
      products.find((item) => item.slug === entry.slug),
    [products, entry.productId, entry.slug],
  );

  const finish =
    product?.finishOptions.find((option) => option.id === entry.finishId) ??
    product?.finishOptions.find((option) => option.available) ??
    product?.finishOptions[0];

  const collection = product
    ? (
        collectionNames[product.collection] ?? product.collection
      ).replace(" Collection", "")
    : null;

  const moveToCart = useCallback(() => {
    if (!product || !finish) return;
    setMoving(true);
    addItem(catalogToCartProduct(product, finish), 1);
    remove(entry.productId, entry.finishId);
    window.setTimeout(() => setMoving(false), 400);
  }, [addItem, entry.finishId, entry.productId, finish, product, remove]);

  if (!ready) {
    return (
      <motion.li
        layout={!reduceMotion}
        className="animate-pulse border-b border-border py-8"
        aria-busy="true"
        aria-hidden="true"
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:gap-7">
          <div className="aspect-[3/4] w-full bg-surface sm:h-52 sm:w-40" />
          <div className="flex-1 space-y-3 py-2">
            <div className="h-3 w-24 bg-surface" />
            <div className="h-8 w-48 bg-surface" />
            <div className="h-4 w-32 bg-surface" />
          </div>
        </div>
      </motion.li>
    );
  }

  if (!product || !finish) {
    return (
      <motion.li
        layout={!reduceMotion}
        exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
        className="border border-border p-6"
      >
        <p className="text-sm text-muted">This piece is no longer available.</p>
        <button
          type="button"
          onClick={() => remove(entry.productId, entry.finishId)}
          className="mt-4 text-[11px] uppercase tracking-[0.14em] text-muted hover:text-error"
        >
          Remove
        </button>
      </motion.li>
    );
  }

  return (
    <motion.li
      layout={!reduceMotion}
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={
        reduceMotion
          ? undefined
          : { opacity: 0, height: 0, y: -10, overflow: "hidden" }
      }
      transition={{
        duration: reduceMotion ? 0 : 0.4,
        ease,
        delay: reduceMotion ? 0 : Math.min(index * 0.04, 0.2),
      }}
      className="flex flex-col gap-5 border-b border-border py-8 sm:flex-row sm:gap-7"
    >
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-[3/4] w-full shrink-0 overflow-hidden bg-surface sm:h-52 sm:w-40 sm:aspect-auto"
      >
        <Image
          src={product.featuredImage}
          alt={product.name}
          fill
          className="object-cover"
          sizes="180px"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div>
            {collection && (
              <p className="text-[10px] uppercase tracking-[0.2em] text-accent">
                {collection}
              </p>
            )}
            <Link
              href={`/products/${product.slug}`}
              className="mt-2 block font-display text-2xl text-primary transition-colors hover:text-accent md:text-3xl"
            >
              {product.name}
            </Link>
            <p className="mt-2 text-xs uppercase tracking-[0.16em] text-muted">
              Finish · {finish.name}
            </p>
            <p className="mt-3 font-display text-xl text-primary">
              {formatPrice(finish.price)}
            </p>
          </div>
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-3 pt-6">
          <Button
            type="button"
            variant="gold"
            size="sm"
            onClick={moveToCart}
            disabled={moving}
            className="inline-flex items-center gap-2"
          >
            <ShoppingBag size={14} strokeWidth={1.5} />
            {moving ? "Moving…" : "Move to Cart"}
          </Button>
          <button
            type="button"
            onClick={() => remove(entry.productId, entry.finishId)}
            className="inline-flex items-center gap-1.5 px-2 py-2 text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-error"
          >
            <Trash2 size={14} strokeWidth={1.5} />
            Remove
          </button>
        </div>
      </div>
    </motion.li>
  );
}

export const WishlistCard = memo(WishlistCardComponent);
