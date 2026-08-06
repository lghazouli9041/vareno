"use client";

import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";
import { CartEmptyState } from "@/components/cart/CartEmptyState";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { useCartStore } from "@/store/cart";

const CartCrossSell = dynamic(
  () =>
    import("@/components/cart/CartCrossSell").then((mod) => mod.CartCrossSell),
  {
    loading: () => (
      <div
        className="border-t border-border py-16"
        aria-hidden="true"
        aria-busy="true"
      >
        <div className="h-4 w-40 animate-pulse bg-surface" />
        <div className="mt-4 h-8 w-64 animate-pulse bg-surface" />
        <div className="mt-8 flex gap-5 overflow-hidden">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-72 w-[220px] shrink-0 animate-pulse bg-surface"
            />
          ))}
        </div>
      </div>
    ),
    ssr: false,
  },
);

export function CartView() {
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) =>
    s.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background px-6 pt-28 pb-20 md:pt-36">
        <div className="mx-auto max-w-5xl">
          <CartEmptyState />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-6 pt-28 pb-36 md:pt-36 md:pb-24">
        <header className="mb-10 md:mb-14">
          <p className="text-[10px] uppercase tracking-[0.24em] text-accent">
            Bag
          </p>
          <h1 className="mt-3 font-display text-4xl text-primary md:text-5xl">
            Shopping Cart
          </h1>
          <p className="mt-3 text-sm text-muted">
            {itemCount} {itemCount === 1 ? "item" : "items"} reserved for your
            interior.
          </p>
        </header>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start xl:grid-cols-[minmax(0,1fr)_380px]">
          <section aria-labelledby="cart-items-heading">
            <h2 id="cart-items-heading" className="sr-only">
              Cart items
            </h2>
            <ul>
              <AnimatePresence initial={false} mode="popLayout">
                {items.map((item) => (
                  <CartLineItem
                    key={item.product.id}
                    item={item}
                    showSaveForLater
                  />
                ))}
              </AnimatePresence>
            </ul>
          </section>

          <aside className="hidden lg:sticky lg:top-28 lg:block">
            <CartSummary subtotal={subtotal} />
          </aside>
        </div>

        <CartCrossSell />
      </div>

      {/* Mobile sticky summary */}
      <div className="fixed inset-x-0 bottom-0 z-40 lg:hidden">
        <CartSummary subtotal={subtotal} stickyMobile showPromo={false} />
      </div>
    </div>
  );
}
