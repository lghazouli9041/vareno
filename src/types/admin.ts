import type { CatalogProduct } from "@/types/catalog";

export type AdminProductStatus = "active" | "draft" | "archived";

export type AdminProduct = CatalogProduct & {
  status: AdminProductStatus;
  stock: number;
  updatedAt: string;
};

export function stockFromAvailability(
  availability: CatalogProduct["availability"],
): number {
  if (availability === "out_of_stock") return 0;
  if (availability === "made_to_order") return 8;
  return 24;
}

export function catalogToAdminProduct(product: CatalogProduct): AdminProduct {
  return {
    ...product,
    status: "active",
    stock: stockFromAvailability(product.availability),
    updatedAt: new Date().toISOString(),
  };
}
