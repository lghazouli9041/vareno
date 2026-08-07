"use client";

import { useEffect, useMemo } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { CartEmptyState } from "@/components/cart/CartEmptyState";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { CartDrawerUpsell } from "@/components/cart/CartDrawerUpsell";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";
import { motion as motionTokens } from "@/constants/design";
import {
  amountToFreeShipping,
  estimateCartShipping,
  estimateCartTax,
} from "@/lib/cart-totals";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";

export function CartDrawer() {
  const reduceMotion = useReducedMotion();
  const ease = motionTokens.easeLuxury;
  const isOpen = useCartStore((s) => s.isOpen);
  const items = useCartStore((s) => s.items);
  const closeCart = useCartStore((s) => s.closeCart);
  const subtotal = useCartStore((s) =>
    s.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
  );

  const shipping = estimateCartShipping(subtotal);
  const tax = estimateCartTax(subtotal);
  const total = subtotal + shipping + tax;
  const remaining = amountToFreeShipping(subtotal);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const threshold = siteConfig.shipping.freeThreshold;
  const progress = useMemo(
    () => Math.min(100, (subtotal / threshold) * 100),
    [subtotal, threshold],
  );

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, closeCart]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[90]" role="presentation">
          <motion.button
            type="button"
            aria-label="Close cart"
            className="absolute inset-0 bg-primary/45 backdrop-blur-[3px]"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.35, ease }}
            onClick={closeCart}
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-drawer-title"
            className="absolute inset-y-0 right-0 flex w-full max-w-full flex-col border-l border-border/60 bg-background shadow-xl sm:max-w-md md:max-w-lg"
            initial={reduceMotion ? false : { x: "100%" }}
            animate={{ x: 0 }}
            exit={reduceMotion ? undefined : { x: "100%" }}
            transition={{ duration: reduceMotion ? 0 : 0.55, ease }}
          >
            <header className="flex items-center justify-between border-b border-border px-5 py-5 md:px-7">
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-accent">
                  Atelier Bag
                </p>
                <h2
                  id="cart-drawer-title"
                  className="mt-1 font-display text-2xl text-primary md:text-[1.75rem]"
                >
                  Your Selection
                  {itemCount > 0 && (
                    <span className="ml-2 font-body text-sm tracking-normal text-muted">
                      ({itemCount})
                    </span>
                  )}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeCart}
                className="border border-border p-2.5 text-primary transition-all duration-300 hover:border-accent hover:text-accent"
                aria-label="Close cart"
              >
                <X size={18} strokeWidth={1.4} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-5 py-6 md:px-7">
              {items.length === 0 ? (
                <CartEmptyState compact onContinue={closeCart} />
              ) : (
                <>
                  <div className="mb-8 border border-border/80 bg-secondary/40 px-4 py-4">
                    <div className="flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.2em]">
                      <span className="text-muted">Complimentary shipping</span>
                      <span className="text-accent">
                        {remaining > 0
                          ? `${formatPrice(remaining)} to go`
                          : "Unlocked"}
                      </span>
                    </div>
                    <div
                      className="mt-3 h-px overflow-hidden bg-border"
                      role="progressbar"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={Math.round(progress)}
                      aria-label="Progress toward free shipping"
                    >
                      <motion.div
                        className="h-full bg-accent"
                        initial={false}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: reduceMotion ? 0 : 0.6, ease }}
                      />
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-muted">
                      {remaining > 0
                        ? `Add ${formatPrice(remaining)} for complimentary shipping over ${formatPrice(threshold)}.`
                        : "Your order qualifies for complimentary white-glove shipping."}
                    </p>
                  </div>

                  <ul className="space-y-6">
                    <AnimatePresence initial={false} mode="popLayout">
                      {items.map((item) => (
                        <CartLineItem
                          key={item.product.id}
                          item={item}
                          compact
                          showWishlistShortcut
                        />
                      ))}
                    </AnimatePresence>
                  </ul>

                  <CartDrawerUpsell excludeIds={items.map((i) => i.product.id)} />
                </>
              )}
            </div>

            {items.length > 0 && (
              <footer className="border-t border-border bg-background px-5 py-6 md:px-7">
                <dl className="space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted">Estimated subtotal</dt>
                    <dd className="text-primary">{formatPrice(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted">Shipping estimate</dt>
                    <dd className="text-primary">
                      {shipping === 0
                        ? "Complimentary"
                        : formatPrice(shipping)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted">Estimated tax</dt>
                    <dd className="text-primary">{formatPrice(tax)}</dd>
                  </div>
                  <div className="flex justify-between border-t border-border pt-3">
                    <dt className="font-medium text-primary">Estimated total</dt>
                    <dd className="font-display text-xl text-primary">
                      {formatPrice(total)}
                    </dd>
                  </div>
                </dl>

                <div className="mt-6 space-y-3">
                  <Button
                    href="/checkout"
                    variant="gold"
                    size="lg"
                    className="w-full"
                    onClick={closeCart}
                  >
                    Checkout
                  </Button>
                  <Button
                    href="/cart"
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={closeCart}
                  >
                    View Full Cart
                  </Button>
                </div>
              </footer>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
