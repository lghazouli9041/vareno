"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { catalogProducts } from "@/constants/catalog-products";
import { formatPrice } from "@/lib/utils";
import type { CatalogProduct } from "@/types/catalog";

interface CartDrawerUpsellProps {
  excludeIds: string[];
}

export function CartDrawerUpsell({ excludeIds }: CartDrawerUpsellProps) {
  const [items, setItems] = useState<CatalogProduct[]>([]);

  useEffect(() => {
    const exclude = new Set(excludeIds);
    const picks = catalogProducts
      .filter(
        (product) =>
          !exclude.has(product.id) &&
          ![...exclude].some((id) => id.startsWith(`${product.id}-`)),
      )
      .slice(0, 3);
    setItems(picks);
  }, [excludeIds]);

  if (items.length === 0) return null;

  return (
    <div className="mt-10 border-t border-border pt-8">
      <p className="text-[10px] uppercase tracking-[0.28em] text-accent">
        Recommended
      </p>
      <h3 className="mt-2 font-display text-xl text-primary">
        Complete the room
      </h3>
      <ul className="mt-5 space-y-4">
        {items.map((product) => (
          <li key={product.id}>
            <Link
              href={`/products/${product.slug}`}
              className="group flex gap-3 transition-opacity hover:opacity-90"
            >
              <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-surface">
                <Image
                  src={product.featuredImage}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="64px"
                />
              </div>
              <div className="min-w-0 py-0.5">
                <p className="truncate font-display text-lg text-primary group-hover:text-accent">
                  {product.name}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {formatPrice(product.price)}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
