"use client";

import { motion, useReducedMotion } from "framer-motion";
import { luxuryFinishes } from "@/constants/luxury-finishes";
import { ShopSearch } from "@/components/shop/ShopSearch";
import {
  COLOR_FILTERS,
  type ColorFilterId,
} from "@/features/shop/product-flags";
import {
  DEFAULT_SHOP_FILTERS,
  type ShopFiltersState,
} from "@/features/shop/filter-products";
import { motion as motionTokens } from "@/constants/design";
import type {
  CatalogAvailability,
  CatalogCategory,
  CatalogCollection,
} from "@/types/catalog";
import { cn } from "@/lib/utils";

interface ShopFiltersProps {
  filters: ShopFiltersState;
  onChange: (next: ShopFiltersState) => void;
  collections: CatalogCollection[];
  className?: string;
  id?: string;
}

const CATEGORIES: { value: CatalogCategory; label: string }[] = [
  { value: "kitchen", label: "Kitchen" },
  { value: "bathroom", label: "Bathroom" },
];

const AVAILABILITY: { value: CatalogAvailability; label: string }[] = [
  { value: "in_stock", label: "In Stock" },
  { value: "made_to_order", label: "Made to Order" },
  { value: "out_of_stock", label: "Out of Stock" },
];

function toggleValue<T extends string>(list: T[], value: T): T[] {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

export function ShopFilters({
  filters,
  onChange,
  collections,
  className,
  id = "shop-filters",
}: ShopFiltersProps) {
  const reduceMotion = useReducedMotion();
  const ease = motionTokens.easeLuxury;

  return (
    <motion.aside
      id={id}
      initial={reduceMotion ? false : { opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.55, ease }}
      className={cn(
        "border border-border/80 bg-background px-5 py-6 md:px-6 md:py-7",
        className,
      )}
      aria-label="Product filters"
    >
      <div className="mb-9 flex items-center justify-between gap-3 border-b border-border pb-5">
        <h2 className="text-[10px] uppercase tracking-[0.28em] text-accent">
          Refine
        </h2>
        <button
          type="button"
          className="text-[10px] uppercase tracking-[0.2em] text-muted transition-colors hover:text-accent"
          onClick={() => onChange(DEFAULT_SHOP_FILTERS)}
        >
          Clear all
        </button>
      </div>

      <div className="space-y-10">
        <ShopSearch
          value={filters.query}
          onChange={(query) => onChange({ ...filters, query })}
        />

        <fieldset>
          <legend className="mb-3 text-[11px] uppercase tracking-[0.18em] text-primary">
            Highlights
          </legend>
          <ul className="space-y-2.5">
            <li>
              <label className="flex cursor-pointer items-center gap-3 text-sm text-muted transition-colors hover:text-primary">
                <input
                  type="checkbox"
                  checked={filters.newArrivals}
                  onChange={() =>
                    onChange({
                      ...filters,
                      newArrivals: !filters.newArrivals,
                    })
                  }
                  className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                />
                <span>New Arrivals</span>
              </label>
            </li>
            <li>
              <label className="flex cursor-pointer items-center gap-3 text-sm text-muted transition-colors hover:text-primary">
                <input
                  type="checkbox"
                  checked={filters.bestSellers}
                  onChange={() =>
                    onChange({
                      ...filters,
                      bestSellers: !filters.bestSellers,
                    })
                  }
                  className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                />
                <span>Best Sellers</span>
              </label>
            </li>
          </ul>
        </fieldset>

        <fieldset>
          <legend className="mb-3 text-[11px] uppercase tracking-[0.18em] text-primary">
            Category
          </legend>
          <ul className="space-y-2.5">
            {CATEGORIES.map((category) => (
              <li key={category.value}>
                <label className="flex cursor-pointer items-center gap-3 text-sm text-muted transition-colors hover:text-primary">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category.value)}
                    onChange={() =>
                      onChange({
                        ...filters,
                        categories: toggleValue(
                          filters.categories,
                          category.value,
                        ),
                      })
                    }
                    className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                  />
                  <span>{category.label}</span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>

        <fieldset>
          <legend className="mb-3 text-[11px] uppercase tracking-[0.18em] text-primary">
            Collection
          </legend>
          <ul className="space-y-2.5">
            {collections.map((collection) => (
              <li key={collection.id}>
                <label className="flex cursor-pointer items-center gap-3 text-sm text-muted transition-colors hover:text-primary">
                  <input
                    type="checkbox"
                    checked={filters.collections.includes(collection.slug)}
                    onChange={() =>
                      onChange({
                        ...filters,
                        collections: toggleValue(
                          filters.collections,
                          collection.slug,
                        ),
                      })
                    }
                    className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                  />
                  <span>{collection.name.replace(" Collection", "")}</span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>

        <fieldset>
          <legend className="mb-3 text-[11px] uppercase tracking-[0.18em] text-primary">
            Finish
          </legend>
          <ul className="space-y-2.5">
            {luxuryFinishes.map((finish) => (
              <li key={finish.id}>
                <label className="flex cursor-pointer items-center gap-3 text-sm text-muted transition-colors hover:text-primary">
                  <input
                    type="checkbox"
                    checked={filters.finishes.includes(finish.id)}
                    onChange={() =>
                      onChange({
                        ...filters,
                        finishes: toggleValue(filters.finishes, finish.id),
                      })
                    }
                    className="sr-only"
                  />
                  <span
                    className={cn(
                      "inline-flex h-5 w-5 rounded-full border transition-shadow",
                      filters.finishes.includes(finish.id)
                        ? "border-primary shadow-[0_0_0_2px_rgb(17_17_17_/_0.12)]"
                        : "border-border",
                    )}
                    style={{ backgroundColor: finish.hex }}
                    aria-hidden="true"
                  />
                  <span>{finish.name}</span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>

        <fieldset>
          <legend className="mb-3 text-[11px] uppercase tracking-[0.18em] text-primary">
            Color
          </legend>
          <ul className="space-y-2.5">
            {COLOR_FILTERS.map((color) => (
              <li key={color.id}>
                <label className="flex cursor-pointer items-center gap-3 text-sm text-muted transition-colors hover:text-primary">
                  <input
                    type="checkbox"
                    checked={filters.colors.includes(color.id)}
                    onChange={() =>
                      onChange({
                        ...filters,
                        colors: toggleValue(
                          filters.colors,
                          color.id as ColorFilterId,
                        ),
                      })
                    }
                    className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                  />
                  <span>{color.label}</span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>

        <fieldset>
          <legend className="mb-3 text-[11px] uppercase tracking-[0.18em] text-primary">
            Price
          </legend>
          <div className="space-y-3">
            <label className="block text-xs text-muted" htmlFor="price-max">
              Up to{" "}
              {filters.maxPrice.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
              })}
            </label>
            <input
              id="price-max"
              type="range"
              min={500}
              max={6000}
              step={50}
              value={filters.maxPrice}
              onChange={(e) =>
                onChange({
                  ...filters,
                  maxPrice: Number(e.target.value),
                })
              }
              className="w-full accent-accent"
              aria-valuemin={500}
              aria-valuemax={6000}
              aria-valuenow={filters.maxPrice}
            />
            <div className="flex justify-between text-[11px] uppercase tracking-[0.14em] text-muted">
              <span>$500</span>
              <span>$6,000</span>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-3 text-[11px] uppercase tracking-[0.18em] text-primary">
            Availability
          </legend>
          <ul className="space-y-2.5">
            {AVAILABILITY.map((item) => (
              <li key={item.value}>
                <label className="flex cursor-pointer items-center gap-3 text-sm text-muted transition-colors hover:text-primary">
                  <input
                    type="checkbox"
                    checked={filters.availability.includes(item.value)}
                    onChange={() =>
                      onChange({
                        ...filters,
                        availability: toggleValue(
                          filters.availability,
                          item.value,
                        ),
                      })
                    }
                    className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                  />
                  <span>{item.label}</span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
      </div>
    </motion.aside>
  );
}
