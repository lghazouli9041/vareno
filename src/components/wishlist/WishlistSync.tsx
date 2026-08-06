"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useRef } from "react";
import {
  pullWishlistFromDatabaseAction,
  syncWishlistToDatabaseAction,
} from "@/features/commerce/actions";
import { useWishlistStore } from "@/store/wishlist";

/** Syncs device wishlist with Prisma for signed-in users. */
export function WishlistSync() {
  const { isSignedIn, userId } = useAuth();
  const items = useWishlistStore((s) => s.items);
  const syncedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isSignedIn || !userId) return;
    if (syncedRef.current === userId) return;
    syncedRef.current = userId;

    void (async () => {
      const remote = await pullWishlistFromDatabaseAction();
      if (!remote.ok) return;

      const local = useWishlistStore.getState().items;
      if (remote.items.length === 0 && local.length > 0) {
        await syncWishlistToDatabaseAction(
          local.map((item) => ({
            productId: item.productId,
            slug: item.slug,
          })),
        );
        return;
      }

      if (remote.items.length > 0 && local.length === 0) {
        useWishlistStore.setState({
          items: remote.items.map((item) => ({
            productId: item.productId,
            slug: item.slug,
            addedAt: new Date().toISOString(),
            syncedAt: new Date().toISOString(),
          })),
        });
      }
    })();
  }, [isSignedIn, userId]);

  useEffect(() => {
    if (!isSignedIn || !userId) return;
    const handle = window.setTimeout(() => {
      void syncWishlistToDatabaseAction(
        items.map((item) => ({
          productId: item.productId,
          slug: item.slug,
        })),
      );
    }, 800);
    return () => window.clearTimeout(handle);
  }, [items, isSignedIn, userId]);

  return null;
}
