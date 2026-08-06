import type { Order, OrderItem } from "@prisma/client";

type OrderWithItems = Order & { items: OrderItem[] };

export type AdminKpis = {
  revenue: number;
  orders: number;
  customers: number;
  products: number;
  averageOrderValue: number;
  conversion: number | null;
};

export type AdminSeriesPoint = {
  label: string;
  value: number;
};

export type AdminTopProduct = {
  name: string;
  units: number;
  revenue: number;
};

export function computeOrderMetrics(
  orders: OrderWithItems[],
  customerCount: number,
  productCount: number,
): {
  kpis: AdminKpis;
  revenueSeries: AdminSeriesPoint[];
  ordersSeries: AdminSeriesPoint[];
  topProducts: AdminTopProduct[];
} {
  const revenue = orders.reduce((sum, order) => sum + Number(order.total), 0);
  const orderCount = orders.length;
  const averageOrderValue = orderCount ? revenue / orderCount : 0;

  const byMonth = new Map<string, { revenue: number; orders: number }>();
  for (const order of orders) {
    const key = new Intl.DateTimeFormat("en-US", {
      month: "short",
      year: "2-digit",
    }).format(order.createdAt);
    const current = byMonth.get(key) ?? { revenue: 0, orders: 0 };
    current.revenue += Number(order.total);
    current.orders += 1;
    byMonth.set(key, current);
  }

  const revenueSeries = [...byMonth.entries()]
    .slice(-6)
    .map(([label, value]) => ({ label, value: value.revenue }));
  const ordersSeries = [...byMonth.entries()]
    .slice(-6)
    .map(([label, value]) => ({ label, value: value.orders }));

  const productMap = new Map<string, AdminTopProduct>();
  for (const order of orders) {
    for (const item of order.items) {
      const current = productMap.get(item.productName) ?? {
        name: item.productName,
        units: 0,
        revenue: 0,
      };
      current.units += item.quantity;
      current.revenue += Number(item.unitPrice) * item.quantity;
      productMap.set(item.productName, current);
    }
  }

  const topProducts = [...productMap.values()]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return {
    kpis: {
      revenue,
      orders: orderCount,
      customers: customerCount,
      products: productCount,
      averageOrderValue,
      conversion: null,
    },
    revenueSeries:
      revenueSeries.length > 0
        ? revenueSeries
        : [
            { label: "Jan", value: 0 },
            { label: "Feb", value: 0 },
            { label: "Mar", value: 0 },
          ],
    ordersSeries:
      ordersSeries.length > 0
        ? ordersSeries
        : [
            { label: "Jan", value: 0 },
            { label: "Feb", value: 0 },
            { label: "Mar", value: 0 },
          ],
    topProducts,
  };
}
