"use client";

import Image from "next/image";
import Link from "next/link";
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type MouseEvent,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Eye, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { WishlistHeartButton } from "@/components/wishlist/WishlistHeartButton";
import { motion as motionTokens } from "@/constants/design";
import {
  isBestSeller,
  isNewArrival,
} from "@/features/shop/product-flags";
import { highlightMatch } from "@/features/shop/filter-products";
import { catalogToCartProduct } from "@/lib/catalog-to-cart";
import { cn, formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import type { CatalogCollection, CatalogProduct } from "@/types/catalog";
import type { ShopViewMode } from "@/features/shop/filter-products";

interface ProductCardV2Props {
  product: CatalogProduct;
  index?: number;
  viewMode?: ShopViewMode;
  searchQuery?: string;
  collections?: CatalogCollection[];
}

function HighlightedText({
  text,
  query,
}: {
  text: string;
  query?: string;
}) {
  const q = query?.trim() ?? "";
  const parts = useMemo(() => highlightMatch(text, q), [text, q]);
  if (!q) return <>{text}</>;

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === q.toLowerCase() ? (
          <mark key={`${part}-${index}`} className="bg-accent/25 text-inherit">
            {part}
          </mark>
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        ),
      )}
    </>
  );
}

function ProductCardV2Component({
  product,
  index = 0,
  viewMode = "grid",
  searchQuery = "",
  collections = [],
}: ProductCardV2Props) {
  const reduceMotion = useReducedMotion();
  const ease = motionTokens.easeLuxury;
  const addItem = useCartStore((s) => s.addItem);
  const wishlisted = useWishlistStore((s) => s.has(product.id));
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const [quickView, setQuickView] = useState(false);
  const [added, setAdded] = useState(false);

  const finish =
    product.finishOptions.find((f) => f.available) ?? product.finishOptions[0];
  const collectionName =
    collections
      .find((c) => c.slug === product.collection)
      ?.name.replace(" Collection", "") ?? product.collection;

  const categoryLabel =
    product.category === "kitchen" ? "Kitchen" : "Bathroom";
  const newArrival = isNewArrival(product);
  const bestSeller = isBestSeller(product);
  const image = product.featuredImage;
  const list = viewMode === "list";

  const handleAdd = useCallback(
    (event?: MouseEvent) => {
      event?.preventDefault();
      event?.stopPropagation();
      if (!finish) return;
      addItem(catalogToCartProduct(product, finish, collectionName), 1);
      setAdded(true);
      window.setTimeout(() => setAdded(false), 1600);
    },
    [addItem, finish, product, collectionName],
  );

  const handleWishlist = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      toggleWishlist({
        productId: product.id,
        slug: product.slug,
        finishId: finish?.id,
      });
    },
    [finish?.id, product.id, product.slug, toggleWishlist],
  );

  useEffect(() => {
    if (!quickView) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setQuickView(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [quickView]);

  if (!image || !finish) return null;

  return (
    <>
      <motion.article
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: reduceMotion ? 0 : 0.7,
          ease,
          delay: reduceMotion ? 0 : Math.min(index * 0.06, 0.3),
        }}
        className={cn(
          "group relative flex h-full",
          list ? "flex-col gap-0 sm:flex-row sm:items-stretch" : "flex-col",
        )}
      >
        <div
          className={cn(
            "relative overflow-hidden bg-surface shadow-sm transition-shadow duration-500 group-hover:shadow-md",
            list
              ? "aspect-[4/5] w-full sm:w-[42%] sm:shrink-0"
              : "aspect-[3/4] w-full",
          )}
        >
          <Link
            href={`/products/${product.slug}`}
            className="absolute inset-0 block"
          >
            <Image
              src={image}
              alt={product.name}
              fill
              loading="lazy"
              sizes={
                list
                  ? "(max-width: 640px) 100vw, 40vw"
                  : "(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
              }
              className={cn(
                "object-cover transition-transform duration-[1.1s] ease-[cubic-bezier(0.22,1,0.36,1)]",
                !reduceMotion && "group-hover:scale-[1.05]",
              )}
            />
          </Link>

          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-4">
            <div className="flex flex-col gap-1.5">
              {newArrival && (
                <span className="bg-primary px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] text-inverse-text">
                  New
                </span>
              )}
              {bestSeller && (
                <span className="bg-accent px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] text-primary">
                  Best Seller
                </span>
              )}
            </div>
            <div className="pointer-events-auto">
              <WishlistHeartButton
                active={wishlisted}
                onClick={handleWishlist}
              />
            </div>
          </div>

          <div
            className={cn(
              "absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 p-4 transition-all duration-500",
              reduceMotion
                ? "opacity-100"
                : "translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100",
            )}
          >
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setQuickView(true);
              }}
              className="pointer-events-auto inline-flex h-11 items-center gap-2 border border-border/70 bg-background/92 px-4 text-[10px] uppercase tracking-[0.18em] text-primary backdrop-blur-md transition-colors hover:border-accent hover:text-accent"
              aria-label={`Quick view ${product.name}`}
            >
              <Eye size={14} strokeWidth={1.4} />
              Quick View
            </button>
          </div>
        </div>

        <div
          className={cn(
            "flex flex-1 flex-col",
            list ? "justify-center px-0 py-6 sm:px-8 sm:py-8" : "pt-6",
          )}
        >
          <p className="text-[10px] uppercase tracking-[0.24em] text-muted">
            {categoryLabel}
            <span className="mx-2 text-border">·</span>
            {collectionName}
          </p>
          <h3 className="mt-2 font-display text-2xl leading-tight text-primary">
            <Link
              href={`/products/${product.slug}`}
              className="transition-colors duration-300 hover:text-accent"
            >
              <HighlightedText text={product.name} query={searchQuery} />
            </Link>
          </h3>
          <p className="mt-3 font-display text-xl text-primary">
            {formatPrice(finish.price)}
          </p>
          {list && (
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
              <HighlightedText
                text={product.shortDescription}
                query={searchQuery}
              />
            </p>
          )}
          <div className="mt-5">
            <Button
              type="button"
              variant="gold"
              size="sm"
              className="w-full"
              onClick={handleAdd}
              aria-label={`Add ${product.name} to cart`}
            >
              {added ? "Added to Cart" : "Add to Cart"}
            </Button>
          </div>
        </div>
      </motion.article>

      <AnimatePresence>
        {quickView && (
          <motion.div
            className="fixed inset-0 z-[85] flex items-end justify-center p-0 sm:items-center sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-label={`Quick view ${product.name}`}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.3, ease }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-primary/50 backdrop-blur-sm"
              aria-label="Close quick view"
              onClick={() => setQuickView(false)}
            />
            <motion.div
              className="relative z-10 grid w-full max-w-3xl grid-cols-1 overflow-hidden border border-border/60 bg-background shadow-xl sm:grid-cols-2"
              initial={reduceMotion ? false : { y: 28, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={reduceMotion ? undefined : { y: 16, opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.4, ease }}
            >
              <div className="relative aspect-[3/4] bg-surface sm:aspect-auto sm:min-h-[440px]">
                <Image
                  src={image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 420px"
                />
              </div>
              <div className="flex flex-col justify-center p-7 md:p-10">
                <button
                  type="button"
                  onClick={() => setQuickView(false)}
                  className="absolute right-3 top-3 border border-border p-2 text-primary transition-colors hover:border-accent hover:text-accent"
                  aria-label="Close quick view"
                >
                  <X size={16} strokeWidth={1.4} />
                </button>
                <p className="text-[10px] uppercase tracking-[0.24em] text-muted">
                  {categoryLabel}
                </p>
                <h2 className="mt-2 font-display text-3xl text-primary">
                  {product.name}
                </h2>
                <p className="mt-3 text-sm text-muted">{finish.name}</p>
                <p className="mt-4 font-display text-2xl text-primary">
                  {formatPrice(finish.price)}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  {product.shortDescription}
                </p>
                <div className="mt-8 flex flex-col gap-3">
                  <Button
                    type="button"
                    variant="gold"
                    onClick={() => handleAdd()}
                  >
                    {added ? "Added to Cart" : "Add to Cart"}
                  </Button>
                  <Button href={`/products/${product.slug}`} variant="outline">
                    View Details
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export const ProductCardV2 = memo(ProductCardV2Component);
