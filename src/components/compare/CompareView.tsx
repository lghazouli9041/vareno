"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { GitCompareArrows } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCatalogProductsByIds } from "@/hooks/useCatalogSnapshot";
import { COMPARE_LIMIT, useCompareStore } from "@/store/compare";

const CompareTable = dynamic(
  () =>
    import("@/components/compare/CompareTable").then((mod) => mod.CompareTable),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-4 py-10" aria-busy="true" aria-hidden="true">
        <div className="h-48 animate-pulse bg-surface" />
        <div className="h-10 animate-pulse bg-surface" />
        <div className="h-10 animate-pulse bg-surface" />
        <div className="h-10 animate-pulse bg-surface" />
      </div>
    ),
  },
);

export function CompareView() {
  const productIds = useCompareStore((s) => s.productIds);
  const clear = useCompareStore((s) => s.clear);
  const { products, collectionNames, ready } =
    useCatalogProductsByIds(productIds);

  if (productIds.length === 0 || (ready && products.length === 0)) {
    return (
      <div className="min-h-screen bg-background px-6 pt-28 pb-20 md:pt-36">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <span
            className="mb-7 flex h-20 w-20 items-center justify-center border border-border text-accent"
            aria-hidden="true"
          >
            <GitCompareArrows size={28} strokeWidth={1.4} />
          </span>
          <p className="text-[10px] uppercase tracking-[0.24em] text-accent">
            Compare
          </p>
          <h1 className="mt-3 font-display text-4xl text-primary md:text-5xl">
            Select pieces to compare
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
            Choose up to {COMPARE_LIMIT} faucets from the shop to compare
            finishes, dimensions, and specifications side by side.
          </p>
          <Button href="/shop" variant="gold" className="mt-8">
            Browse Shop
          </Button>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-6xl px-6 pt-28 pb-28 md:pt-36 md:pb-24">
          <div className="space-y-4 py-10" aria-busy="true" aria-hidden="true">
            <div className="h-48 animate-pulse bg-surface" />
            <div className="h-10 animate-pulse bg-surface" />
            <div className="h-10 animate-pulse bg-surface" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-6 pt-28 pb-28 md:pt-36 md:pb-24">
        <header className="mb-10 flex flex-col gap-5 border-b border-border pb-8 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-accent">
              Side by Side
            </p>
            <h1 className="mt-3 font-display text-4xl text-primary md:text-5xl">
              Compare
            </h1>
            <p className="mt-3 text-sm text-muted">
              {products.length} of {COMPARE_LIMIT} pieces selected.
              {products.length < 2
                ? " Add at least one more to compare."
                : ""}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={clear}
              className="text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-primary"
            >
              Clear all
            </button>
            <Link
              href="/shop"
              className="text-[11px] uppercase tracking-[0.14em] text-primary transition-colors hover:text-accent"
            >
              Add more
            </Link>
          </div>
        </header>

        <CompareTable
          products={products}
          collectionNames={collectionNames}
        />
      </div>
    </div>
  );
}
