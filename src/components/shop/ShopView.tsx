"use client";

import { useDeferredValue, useEffect, useMemo, useState, useTransition } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ShopBanner } from "@/components/shop/ShopBanner";
import { ShopEmptyState } from "@/components/shop/ShopEmptyState";
import { ShopFilters } from "@/components/shop/ShopFilters";
import {
  ShopPagination,
  ShopSkeletonGrid,
} from "@/components/shop/ShopPagination";
import { ProductCardV2 } from "@/components/shop/ProductCardV2";
import { ShopToolbar } from "@/components/shop/ShopToolbar";
import { Container } from "@/components/layout/Container";
import { motion as motionTokens } from "@/constants/design";
import {
  DEFAULT_SHOP_FILTERS,
  PAGE_SIZE,
  countActiveFilters,
  filterAndSortProducts,
  type ShopFiltersState,
  type ShopSort,
  type ShopViewMode,
} from "@/features/shop/filter-products";
import { cn } from "@/lib/utils";
import type { CatalogCollection, CatalogProduct } from "@/types/catalog";

interface ShopViewProps {
  /** Prisma-backed catalog when available; falls back to static constants. */
  initialProducts: CatalogProduct[];
  collections: CatalogCollection[];
  initialCollection?: string;
  initialCategory?: "kitchen" | "bathroom";
  initialQuery?: string;
}

export function ShopView({
  initialProducts,
  collections,
  initialCollection,
  initialCategory,
  initialQuery,
}: ShopViewProps) {
  const reduceMotion = useReducedMotion();
  const ease = motionTokens.easeLuxury;
  const [filters, setFilters] = useState<ShopFiltersState>(() => ({
    ...DEFAULT_SHOP_FILTERS,
    ...(initialCollection ? { collections: [initialCollection] } : {}),
    ...(initialCategory ? { categories: [initialCategory] } : {}),
    ...(initialQuery ? { query: initialQuery } : {}),
  }));
  const [sort, setSort] = useState<ShopSort>("featured");
  const [viewMode, setViewMode] = useState<ShopViewMode>("grid");
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [booting, setBooting] = useState(true);
  const [isPending, startTransition] = useTransition();
  const deferredFilters = useDeferredValue(filters);
  const deferredSort = useDeferredValue(sort);

  useEffect(() => {
    const timer = window.setTimeout(() => setBooting(false), 280);
    return () => window.clearTimeout(timer);
  }, []);

  const products = useMemo(
    () =>
      filterAndSortProducts(initialProducts, deferredFilters, deferredSort),
    [initialProducts, deferredFilters, deferredSort],
  );

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return products.slice(start, start + PAGE_SIZE);
  }, [products, safePage]);

  const activeFilterCount = countActiveFilters(filters);

  const updateFilters = (next: ShopFiltersState) => {
    startTransition(() => {
      setFilters(next);
      setPage(1);
    });
  };

  const updateSort = (next: ShopSort) => {
    startTransition(() => {
      setSort(next);
      setPage(1);
    });
  };

  useEffect(() => {
    if (!mobileFiltersOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileFiltersOpen]);

  return (
    <>
      <ShopBanner
        category={initialCategory}
        query={initialQuery}
        collection={initialCollection}
      />

      <section
        className="bg-background py-12 md:py-16"
        aria-label="Shop catalog"
      >
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-16">
            <div className="hidden lg:block">
              <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pb-8 pr-1">
                <ShopFilters
                  filters={filters}
                  onChange={updateFilters}
                  collections={collections}
                />
              </div>
            </div>

            <div className="min-w-0">
              <ShopToolbar
                count={pageItems.length}
                totalCount={products.length}
                sort={sort}
                viewMode={viewMode}
                activeFilterCount={activeFilterCount}
                onSortChange={updateSort}
                onViewModeChange={setViewMode}
                onOpenFilters={() => setMobileFiltersOpen(true)}
              />

              {booting ? (
                <ShopSkeletonGrid />
              ) : products.length === 0 ? (
                <ShopEmptyState
                  hasQuery={Boolean(filters.query.trim())}
                  onReset={() => updateFilters(DEFAULT_SHOP_FILTERS)}
                />
              ) : (
                <AnimatePresence mode="wait">
                  <motion.ul
                    key={`${safePage}-${viewMode}-${deferredSort}-${deferredFilters.query}`}
                    initial={reduceMotion || isPending ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.45, ease }}
                    className={cn(
                      "mt-10 grid gap-x-8 gap-y-14 md:gap-y-16",
                      viewMode === "grid"
                        ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                        : "grid-cols-1",
                      isPending && "opacity-70",
                    )}
                  >
                    {pageItems.map((product, index) => (
                      <li key={product.id}>
                        <ProductCardV2
                          product={product}
                          index={index}
                          viewMode={viewMode}
                          searchQuery={filters.query}
                          collections={collections}
                        />
                      </li>
                    ))}
                  </motion.ul>
                </AnimatePresence>
              )}

              {!booting && products.length > 0 && (
                <ShopPagination
                  page={safePage}
                  totalPages={totalPages}
                  onPageChange={(next) => {
                    setPage(next);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              )}
            </div>
          </div>
        </Container>
      </section>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-primary/45 backdrop-blur-sm"
            aria-label="Close filters"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div
            className="absolute inset-y-0 left-0 flex w-full max-w-md flex-col bg-background shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-label="Product filters"
          >
            <div className="flex-1 overflow-y-auto p-5">
              <ShopFilters
                filters={filters}
                onChange={updateFilters}
                collections={collections}
                className="border-0"
              />
            </div>
            <div className="border-t border-border p-4">
              <button
                type="button"
                className="w-full bg-primary py-3.5 text-[11px] uppercase tracking-[0.18em] text-inverse-text transition-colors hover:bg-accent hover:text-primary"
                onClick={() => setMobileFiltersOpen(false)}
              >
                View {products.length} results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
