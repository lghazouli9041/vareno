import { create } from "zustand";
import { persist } from "zustand/middleware";

export const COMPARE_LIMIT = 4;

interface CompareStore {
  productIds: string[];
  has: (productId: string) => boolean;
  toggle: (productId: string) => { ok: boolean; reason?: "limit" };
  remove: (productId: string) => void;
  clear: () => void;
  count: () => number;
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      productIds: [],

      has: (productId) => get().productIds.includes(productId),

      toggle: (productId) => {
        const { productIds } = get();
        if (productIds.includes(productId)) {
          set({ productIds: productIds.filter((id) => id !== productId) });
          return { ok: true };
        }
        if (productIds.length >= COMPARE_LIMIT) {
          return { ok: false, reason: "limit" as const };
        }
        set({ productIds: [...productIds, productId] });
        return { ok: true };
      },

      remove: (productId) =>
        set((state) => ({
          productIds: state.productIds.filter((id) => id !== productId),
        })),

      clear: () => set({ productIds: [] }),

      count: () => get().productIds.length,
    }),
    { name: "hajamed-compare" },
  ),
);
