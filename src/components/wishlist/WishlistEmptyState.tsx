"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCatalogSnapshot } from "@/hooks/useCatalogSnapshot";

export function WishlistEmptyState() {
  const { collections } = useCatalogSnapshot();
  const suggested = collections.slice(0, 4);

  return (
    <div className="flex flex-col items-center px-6 py-20 text-center md:py-28">
      <span
        className="mb-7 flex h-20 w-20 items-center justify-center border border-border text-accent"
        aria-hidden="true"
      >
        <Heart size={30} strokeWidth={1.4} />
      </span>
      <p className="text-[10px] uppercase tracking-[0.24em] text-accent">
        Wishlist
      </p>
      <h1 className="mt-3 font-display text-3xl text-primary md:text-5xl">
        Nothing saved yet
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
        Collect the finishes and silhouettes that define your space. Your
        wishlist is saved on this device and ready for future account sync.
      </p>
      <Button href="/shop" variant="gold" className="mt-8">
        Explore Collection
      </Button>

      {suggested.length > 0 && (
        <div className="mt-14 w-full max-w-2xl">
          <p className="mb-5 text-[10px] uppercase tracking-[0.2em] text-muted">
            Suggested Collections
          </p>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {suggested.map((collection) => (
              <li key={collection.id}>
                <Link
                  href={`/shop?collection=${collection.slug}`}
                  className="block border border-border px-3 py-4 text-[11px] uppercase tracking-[0.14em] text-primary transition-colors hover:border-accent hover:text-accent"
                >
                  {collection.name.replace(" Collection", "")}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
