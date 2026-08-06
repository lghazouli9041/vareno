"use client";

import { useCallback, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { WishlistCard } from "@/components/wishlist/WishlistCard";
import { WishlistEmptyState } from "@/components/wishlist/WishlistEmptyState";
import { shareWishlist } from "@/lib/share-wishlist";
import { useWishlistStore } from "@/store/wishlist";

export function WishlistView() {
  const items = useWishlistStore((s) => s.items);
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  const handleShare = useCallback(async () => {
    const result = await shareWishlist(items);
    if (result.method === "native") {
      setShareStatus(null);
      return;
    }
    if (result.method === "clipboard") {
      setShareStatus("Wishlist link copied.");
    } else {
      setShareStatus("Unable to share right now.");
    }
    window.setTimeout(() => setShareStatus(null), 2800);
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background px-6 pt-28 pb-20 md:pt-36">
        <div className="mx-auto max-w-5xl">
          <WishlistEmptyState />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-6 pt-28 pb-24 md:pt-36">
        <header className="mb-10 flex flex-col gap-6 border-b border-border pb-8 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-accent">
              Saved
            </p>
            <h1 className="mt-3 font-display text-4xl text-primary md:text-5xl">
              Wishlist
            </h1>
            <p className="mt-3 text-sm text-muted">
              {items.length} {items.length === 1 ? "piece" : "pieces"} saved on
              this device.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="inline-flex items-center gap-2"
            >
              <Share2 size={14} strokeWidth={1.5} />
              Share Wishlist
            </Button>
            <Button href="/shop" variant="ghost" size="sm">
              Continue Shopping
            </Button>
          </div>
        </header>

        {shareStatus && (
          <p className="mb-6 text-sm text-muted" role="status">
            {shareStatus}
          </p>
        )}

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
    </div>
  );
}
