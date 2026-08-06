import {
  getCatalogProductByIdAsync,
  getCatalogProductsAsync,
  resolveCheckoutCatalogProductAsync,
} from "@/lib/catalog/repository";
import type { Order, OrderItem, OrderStatus } from "@prisma/client";
import type { CatalogProduct } from "@/types/catalog";

export type AccountOrderItem = {
  id: string;
  productId: string;
  productName: string;
  finish: string;
  quantity: number;
  unitPrice: number;
  image: string | null;
  slug: string | null;
};

export type AccountOrder = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  createdAt: string;
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  currency: string;
  items: AccountOrderItem[];
};

async function resolveCatalogMatch(
  item: OrderItem,
  catalogIndex?: CatalogProduct[],
): Promise<CatalogProduct | null> {
  const byCheckout = await resolveCheckoutCatalogProductAsync(item.productId);
  if (byCheckout) return byCheckout;

  const byId = await getCatalogProductByIdAsync(item.productId);
  if (byId) return byId;

  const products = catalogIndex ?? (await getCatalogProductsAsync());
  const normalized = item.productName.trim().toLowerCase();
  return (
    products.find(
      (product) => product.name.trim().toLowerCase() === normalized,
    ) ?? null
  );
}

export async function toAccountOrder(
  order: Order & { items: OrderItem[] },
  catalogIndex?: CatalogProduct[],
): Promise<AccountOrder> {
  const products = catalogIndex ?? (await getCatalogProductsAsync());
  const items: AccountOrderItem[] = [];

  for (const item of order.items) {
    const product = await resolveCatalogMatch(item, products);
    items.push({
      id: item.id,
      productId: item.productId,
      productName: item.productName,
      finish: item.finish,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
      image: product?.featuredImage ?? null,
      slug: product?.slug ?? null,
    });
  }

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    createdAt: order.createdAt.toISOString(),
    total: Number(order.total),
    subtotal: Number(order.subtotal),
    shipping: Number(order.shipping),
    tax: Number(order.tax),
    currency: order.currency,
    items,
  };
}

export async function toAccountOrders(
  orders: Array<Order & { items: OrderItem[] }>,
): Promise<AccountOrder[]> {
  const catalogIndex = await getCatalogProductsAsync();
  return Promise.all(
    orders.map((order) => toAccountOrder(order, catalogIndex)),
  );
}
