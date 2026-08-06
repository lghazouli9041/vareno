"use client";

import { useEffect, useMemo, useState } from "react";
import { getCatalogSnapshotAction } from "@/features/catalog/actions";
import type { CatalogCollection, CatalogProduct } from "@/types/catalog";

type Snapshot = {
  products: CatalogProduct[];
  collections: CatalogCollection[];
  collectionNames: Record<string, string>;
};

let cachedSnapshot: Snapshot | null = null;
let inflight: Promise<Snapshot> | null = null;

async function loadSnapshot(): Promise<Snapshot> {
  if (cachedSnapshot) return cachedSnapshot;
  if (!inflight) {
    inflight = getCatalogSnapshotAction()
      .then((data) => {
        cachedSnapshot = data;
        return data;
      })
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

/** Client-side Prisma catalog snapshot with module cache (static fallback inside server action). */
export function useCatalogSnapshot() {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(cachedSnapshot);
  const [loading, setLoading] = useState(!cachedSnapshot);

  useEffect(() => {
    let active = true;
    void loadSnapshot().then((data) => {
      if (!active) return;
      setSnapshot(data);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  return {
    products: snapshot?.products ?? [],
    collections: snapshot?.collections ?? [],
    collectionNames: snapshot?.collectionNames ?? {},
    loading,
    ready: Boolean(snapshot),
  };
}

export function useCatalogProductsByIds(ids: string[]) {
  const { products, collectionNames, loading, ready } = useCatalogSnapshot();
  const key = ids.join("|");

  const resolved = useMemo(() => {
    if (!ids.length) return [];
    const byId = new Map(products.map((product) => [product.id, product]));
    return ids
      .map((id) => byId.get(id))
      .filter((product): product is CatalogProduct => Boolean(product));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- key encodes ids
  }, [products, key]);

  return { products: resolved, collectionNames, loading, ready };
}

export function useCatalogProductsBySlugs(slugs: string[]) {
  const { products, collectionNames, loading, ready } = useCatalogSnapshot();
  const key = slugs.join("|");

  const resolved = useMemo(() => {
    if (!slugs.length) return [];
    const bySlug = new Map(products.map((product) => [product.slug, product]));
    return slugs
      .map((slug) => bySlug.get(slug))
      .filter((product): product is CatalogProduct => Boolean(product));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- key encodes slugs
  }, [products, key]);

  return { products: resolved, collectionNames, loading, ready };
}
