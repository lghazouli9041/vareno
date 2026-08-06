import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WishlistEntry = {
  productId: string;
  slug: string;
  finishId?: string;
  addedAt: string;
  /** Reserved for future account sync */
  syncedAt?: string | null;
};

interface WishlistStore {
  items: WishlistEntry[];
  has: (productId: string, finishId?: string) => boolean;
  toggle: (entry: Omit<WishlistEntry, "addedAt" | "syncedAt">) => void;
  remove: (productId: string, finishId?: string) => void;
  clear: () => void;
  count: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      has: (productId, finishId) =>
        get().items.some(
          (item) =>
            item.productId === productId &&
            (finishId ? item.finishId === finishId : true),
        ),

      toggle: (entry) => {
        set((state) => {
          const exists = state.items.some(
            (item) =>
              item.productId === entry.productId &&
              item.finishId === entry.finishId,
          );
          if (exists) {
            return {
              items: state.items.filter(
                (item) =>
                  !(
                    item.productId === entry.productId &&
                    item.finishId === entry.finishId
                  ),
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                ...entry,
                addedAt: new Date().toISOString(),
                syncedAt: null,
              },
            ],
          };
        });
      },

      remove: (productId, finishId) => {
        set((state) => ({
          items: state.items.filter((item) => {
            if (item.productId !== productId) return true;
            if (finishId !== undefined) return item.finishId !== finishId;
            return false;
          }),
        }));
      },

      clear: () => set({ items: [] }),

      count: () => get().items.length,
    }),
    { name: "hajamed-wishlist" },
  ),
);
