"use client";

import { LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import type { ShopSort, ShopViewMode } from "@/features/shop/filter-products";
import { cn } from "@/lib/utils";

interface ShopToolbarProps {
  count: number;
  totalCount: number;
  sort: ShopSort;
  viewMode: ShopViewMode;
  activeFilterCount: number;
  onSortChange: (sort: ShopSort) => void;
  onViewModeChange: (mode: ShopViewMode) => void;
  onOpenFilters?: () => void;
}

const SORT_OPTIONS: { value: ShopSort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most Popular" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "name-asc", label: "Alphabetical" },
];

export function ShopToolbar({
  count,
  totalCount,
  sort,
  viewMode,
  activeFilterCount,
  onSortChange,
  onViewModeChange,
  onOpenFilters,
}: ShopToolbarProps) {
  return (
    <div className="sticky top-[5.25rem] z-30 -mx-6 border-y border-border/80 bg-background/85 px-6 py-4 backdrop-blur-xl md:top-24 lg:mx-0 lg:px-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p
          className="text-[11px] uppercase tracking-[0.18em] text-muted"
          aria-live="polite"
        >
          Showing{" "}
          <span className="text-primary">{count}</span>
          {count !== totalCount && (
            <>
              {" "}
              of <span className="text-primary">{totalCount}</span>
            </>
          )}{" "}
          {totalCount === 1 ? "piece" : "pieces"}
        </p>

        <div className="flex flex-wrap items-center gap-2.5">
          {onOpenFilters && (
            <button
              type="button"
              onClick={onOpenFilters}
              className="inline-flex items-center gap-2 border border-border px-3.5 py-2 text-[11px] uppercase tracking-[0.16em] text-primary transition-colors hover:border-accent hover:text-accent lg:hidden"
            >
              <SlidersHorizontal size={14} strokeWidth={1.5} />
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-accent px-1.5 py-0.5 text-[10px] text-primary">
                  {activeFilterCount}
                </span>
              )}
            </button>
          )}

          <label className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-muted">
            <span className="hidden sm:inline">Sort</span>
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value as ShopSort)}
              className="border border-border bg-background px-3 py-2 text-[11px] uppercase tracking-[0.12em] text-primary outline-none focus:border-primary"
              aria-label="Sort products"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <div
            className="inline-flex border border-border p-0.5"
            role="group"
            aria-label="View mode"
          >
            <button
              type="button"
              onClick={() => onViewModeChange("grid")}
              className={cn(
                "p-2 transition-colors",
                viewMode === "grid"
                  ? "bg-primary text-inverse-text"
                  : "text-muted hover:text-primary",
              )}
              aria-pressed={viewMode === "grid"}
              aria-label="Grid view"
            >
              <LayoutGrid size={16} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("list")}
              className={cn(
                "p-2 transition-colors",
                viewMode === "list"
                  ? "bg-primary text-inverse-text"
                  : "text-muted hover:text-primary",
              )}
              aria-pressed={viewMode === "list"}
              aria-label="List view"
            >
              <List size={16} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
