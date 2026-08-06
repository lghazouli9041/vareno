"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AdminProduct, AdminProductStatus } from "@/types/admin";

interface AdminProductsStore {
  products: AdminProduct[];
  hydrated: boolean;
  /** No-op kept for callers; prefer hydrateFromServer with Prisma data. */
  ensureSeeded: () => void;
  hydrateFromServer: (products: AdminProduct[]) => void;
  upsert: (product: AdminProduct) => void;
  duplicate: (id: string) => AdminProduct | null;
  setStatus: (id: string, status: AdminProductStatus) => void;
  remove: (ids: string[]) => void;
  getById: (id: string) => AdminProduct | undefined;
}

export const useAdminProductsStore = create<AdminProductsStore>()(
  persist(
    (set, get) => ({
      products: [],
      hydrated: false,

      ensureSeeded: () => {
        set({ hydrated: true });
      },

      hydrateFromServer: (products) => {
        set({ products, hydrated: true });
      },

      upsert: (product) => {
        set((state) => {
          const exists = state.products.some((item) => item.id === product.id);
          const next = {
            ...product,
            updatedAt: new Date().toISOString(),
          };
          return {
            products: exists
              ? state.products.map((item) =>
                  item.id === product.id ? next : item,
                )
              : [next, ...state.products],
          };
        });
      },

      duplicate: (id) => {
        const source = get().products.find((item) => item.id === id);
        if (!source) return null;
        const stamp = Date.now().toString(36);
        const copy: AdminProduct = {
          ...source,
          id: `${source.id}-copy-${stamp}`,
          slug: `${source.slug}-copy-${stamp}`,
          name: `${source.name} Copy`,
          sku: `${source.sku}-COPY`,
          status: "draft",
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ products: [copy, ...state.products] }));
        return copy;
      },

      setStatus: (id, status) => {
        set((state) => ({
          products: state.products.map((item) =>
            item.id === id
              ? { ...item, status, updatedAt: new Date().toISOString() }
              : item,
          ),
        }));
      },

      remove: (ids) => {
        const idSet = new Set(ids);
        set((state) => ({
          products: state.products.filter((item) => !idSet.has(item.id)),
        }));
      },

      getById: (id) => get().products.find((item) => item.id === id),
    }),
    {
      name: "hajamed-admin-products",
      partialize: (state) => ({
        products: state.products,
        hydrated: state.hydrated,
      }),
    },
  ),
);
