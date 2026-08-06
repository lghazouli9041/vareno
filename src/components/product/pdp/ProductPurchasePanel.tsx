"use client";

import { useMemo, useState } from "react";
import {
  Heart,
  Share2,
  ShieldCheck,
  Truck,
  Lock,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";
import { catalogToCartProduct } from "@/lib/catalog-to-cart";
import { formatPrice, cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import type { CatalogFinishOption, CatalogProduct } from "@/types/catalog";

interface ProductPurchasePanelProps {
  product: CatalogProduct;
  selectedFinish: CatalogFinishOption;
  onFinishChange: (finish: CatalogFinishOption) => void;
  collectionName: string;
}

export function ProductPurchasePanel({
  product,
  selectedFinish,
  onFinishChange,
  collectionName,
}: ProductPurchasePanelProps) {
  const addItem = useCartStore((s) => s.addItem);
  const wishlisted = useWishlistStore((s) =>
    s.has(product.id, selectedFinish.id),
  );
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const canPurchase =
    selectedFinish.available && product.availability !== "out_of_stock";

  const deliveryLabel = useMemo(() => {
    if (product.availability === "made_to_order") return "Ships in 3–4 weeks";
    if (product.availability === "out_of_stock") return "Currently unavailable";
    return `Arrives in ${siteConfig.shipping.standardDays} business days`;
  }, [product.availability]);

  const stockLabel =
    product.availability === "in_stock"
      ? "In stock — ready to ship"
      : product.availability === "made_to_order"
        ? "Made to order"
        : "Out of stock";

  const handleAdd = () => {
    if (!canPurchase) return;
    addItem(catalogToCartProduct(product, selectedFinish, collectionName), quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: product.name, url });
      return;
    }
    await navigator.clipboard.writeText(url);
  };

  return (
    <div className="space-y-8">
      <header>
        <p className="text-[10px] uppercase tracking-[0.28em] text-accent">
          {collectionName}
        </p>
        <h1 className="mt-3 font-display text-3xl leading-[1.1] text-primary md:text-4xl lg:text-[2.75rem]">
          {product.name}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          {product.shortDescription}
        </p>
      </header>

      <div className="flex flex-wrap items-end justify-between gap-3 border-y border-border py-5">
        <div>
          <p className="font-display text-3xl text-primary md:text-4xl">
            {formatPrice(selectedFinish.price)}
          </p>
          <p className="mt-1.5 text-xs uppercase tracking-[0.14em] text-muted">
            SKU {selectedFinish.sku}
          </p>
        </div>
        <p
          className={cn(
            "inline-flex items-center gap-1.5 text-sm",
            canPurchase ? "text-primary" : "text-error",
          )}
        >
          {canPurchase && (
            <Check size={14} strokeWidth={1.5} className="text-accent" aria-hidden="true" />
          )}
          {stockLabel}
        </p>
      </div>

      <fieldset>
        <legend className="mb-3.5 text-[11px] uppercase tracking-[0.2em] text-primary">
          Finish
          <span className="ml-2 font-normal normal-case tracking-normal text-muted">
            — {selectedFinish.name}
          </span>
        </legend>
        <ul className="flex flex-wrap gap-2.5" role="list">
          {product.finishOptions.map((finish) => {
            const selected = finish.id === selectedFinish.id;
            return (
              <li key={finish.id}>
                <button
                  type="button"
                  disabled={!finish.available}
                  onClick={() => onFinishChange(finish)}
                  className={cn(
                    "flex items-center gap-2.5 border px-3 py-2.5 transition-all duration-300",
                    selected
                      ? "border-primary bg-secondary"
                      : "border-border hover:border-primary/40",
                    !finish.available && "cursor-not-allowed opacity-35",
                  )}
                  aria-pressed={selected}
                  aria-label={`${finish.name}${finish.available ? "" : " (unavailable)"}`}
                >
                  <span
                    className="h-4 w-4 rounded-full border border-border/80"
                    style={{ backgroundColor: finish.hex }}
                    aria-hidden="true"
                  />
                  <span className="text-xs text-primary">{finish.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </fieldset>

      <div>
        <label
          htmlFor="pdp-quantity"
          className="mb-3.5 block text-[11px] uppercase tracking-[0.2em] text-primary"
        >
          Quantity
        </label>
        <div className="inline-flex items-stretch border border-border">
          <button
            type="button"
            className="px-4 text-lg text-primary transition-colors hover:text-accent"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <input
            id="pdp-quantity"
            type="number"
            min={1}
            max={99}
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.min(99, Math.max(1, Number(e.target.value) || 1)))
            }
            className="w-14 border-x border-border bg-transparent py-2.5 text-center text-sm outline-none"
            aria-live="polite"
          />
          <button
            type="button"
            className="px-4 text-lg text-primary transition-colors hover:text-accent"
            onClick={() => setQuantity((q) => Math.min(99, q + 1))}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <Button
          type="button"
          variant="gold"
          size="lg"
          className="w-full"
          onClick={handleAdd}
          disabled={!canPurchase}
        >
          {added ? "Added to Cart" : "Add to Cart"}
        </Button>
        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            onClick={() =>
              toggleWishlist({
                productId: product.id,
                slug: product.slug,
                finishId: selectedFinish.id,
              })
            }
            aria-pressed={wishlisted}
          >
            <Heart
              size={16}
              strokeWidth={1.5}
              className={cn(wishlisted && "fill-current text-accent")}
              aria-hidden="true"
            />
            {wishlisted ? "Saved" : "Wishlist"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="gap-2"
            onClick={handleShare}
          >
            <Share2 size={16} strokeWidth={1.5} aria-hidden="true" />
            Share
          </Button>
        </div>
      </div>

      <div className="space-y-3 border-t border-border pt-6">
        <p className="text-sm text-muted">
          Estimated delivery{" "}
          <span className="text-primary">{deliveryLabel}</span>
        </p>
        <ul className="space-y-2.5 text-sm text-muted">
          <li className="flex items-start gap-2.5">
            <Truck
              size={16}
              strokeWidth={1.5}
              className="mt-0.5 shrink-0 text-accent"
              aria-hidden="true"
            />
            <span>
              Complimentary shipping on orders over $
              {siteConfig.shipping.freeThreshold}
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <ShieldCheck
              size={16}
              strokeWidth={1.5}
              className="mt-0.5 shrink-0 text-accent"
              aria-hidden="true"
            />
            <span>{product.warranty}</span>
          </li>
          <li className="flex items-start gap-2.5">
            <Lock
              size={16}
              strokeWidth={1.5}
              className="mt-0.5 shrink-0 text-accent"
              aria-hidden="true"
            />
            <span>Secure checkout · White-glove packaging</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
