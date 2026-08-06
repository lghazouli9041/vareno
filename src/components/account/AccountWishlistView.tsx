"use client";

import Link from "next/link";
import { memo } from "react";
import { AnimatePresence } from "framer-motion";
import { WishlistCard } from "@/components/wishlist/WishlistCard";
import { useWishlistStore } from "@/store/wishlist";

function AccountWishlistViewComponent() {
  const items = useWishlistStore((s) => s.items);

  if (items.length === 0) {
    return (
      <div className="border border-border bg-background px-6 py-14 text-center">
        <p className="text-[10px] uppercase tracking-[0.2em] text-accent">
          Saved
        </p>
        <p className="mt-3 font-display text-3xl text-primary">
          Your wishlist is empty
        </p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
          Heart pieces from the shop to build a private shortlist. Saved items
          stay on this device and are ready for future account sync.
        </p>
        <Link
          href="/shop"
          className="mt-7 inline-block text-xs uppercase tracking-[0.18em] text-accent transition-colors hover:text-accent-hover"
        >
          Explore Collection
        </Link>
        <Link
          href="/wishlist"
          className="mt-4 block text-xs uppercase tracking-[0.14em] text-muted transition-colors hover:text-primary"
        >
          Open full wishlist
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          {items.length} saved {items.length === 1 ? "piece" : "pieces"}
        </p>
        <Link
          href="/wishlist"
          className="text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-accent"
        >
          Open full wishlist
        </Link>
      </div>
      <ul>
        <AnimatePresence initial={false} mode="popLayout">
          {items.map((entry, index) => (
            <WishlistCard
              key={`${entry.productId}-${entry.finishId ?? "default"}-${entry.addedAt}`}
              entry={entry}
              index={index}
            />
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

export const AccountWishlistView = memo(AccountWishlistViewComponent);
