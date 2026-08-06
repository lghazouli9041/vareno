"use client";

import Image from "next/image";
import Link from "next/link";
import { memo, useEffect, useState } from "react";
import { useCatalogSnapshot } from "@/hooks/useCatalogSnapshot";
import { getRecentlyViewedFromDatabaseAction } from "@/features/commerce/actions";
import {
  getRecentlyViewedProductsAsync,
  mergeRecentlyViewedSlugs,
} from "@/lib/recently-viewed";
import { formatPrice } from "@/lib/utils";
import type { CatalogProduct } from "@/types/catalog";

function RecentlyViewedPanelComponent() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const { collectionNames } = useCatalogSnapshot();

  useEffect(() => {
    void (async () => {
      const remote = await getRecentlyViewedFromDatabaseAction();
      if (remote.ok && remote.slugs.length) {
        mergeRecentlyViewedSlugs(remote.slugs);
      }
      setProducts(await getRecentlyViewedProductsAsync());
    })();
  }, []);

  if (products.length === 0) {
    return (
      <div className="border border-border bg-background px-6 py-14 text-center">
        <p className="text-[10px] uppercase tracking-[0.2em] text-accent">
          History
        </p>
        <p className="mt-3 font-display text-3xl text-primary">
          No recently viewed pieces
        </p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
          As you explore the collection, products you view will appear here for
          quick return.
        </p>
        <Link
          href="/shop"
          className="mt-7 inline-block text-xs uppercase tracking-[0.18em] text-accent transition-colors hover:text-accent-hover"
        >
          Browse Shop
        </Link>
      </div>
    );
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => {
        const collection = (
          collectionNames[product.collection] ?? product.collection
        ).replace(" Collection", "");
        return (
          <li key={product.id}>
            <Link href={`/products/${product.slug}`} className="group block">
              <div className="relative aspect-[3/4] overflow-hidden bg-surface">
                <Image
                  src={product.featuredImage}
                  alt={product.name}
                  fill
                  loading="lazy"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              </div>
              <p className="mt-4 text-[10px] uppercase tracking-[0.18em] text-accent">
                {collection}
              </p>
              <h2 className="mt-1.5 font-display text-2xl text-primary transition-colors group-hover:text-accent">
                {product.name}
              </h2>
              <p className="mt-2 text-sm text-muted">
                {formatPrice(product.price)}
              </p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export const RecentlyViewedPanel = memo(RecentlyViewedPanelComponent);
