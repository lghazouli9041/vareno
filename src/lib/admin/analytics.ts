import { countCatalogProductsAsync } from "@/lib/catalog/repository";
import { computeOrderMetrics } from "@/lib/admin/metrics";
import { getAdminCounts, getAdminCustomers, getAdminOrders } from "@/lib/admin/data";

export async function getProductionAnalytics() {
  const [orders, customers, counts, productCount, productsWithCollection] =
    await Promise.all([
      getAdminOrders(),
      getAdminCustomers(),
      getAdminCounts(),
      countCatalogProductsAsync(),
      (async () => {
        const { prisma } = await import("@/lib/prisma");
        return prisma.product
          .findMany({
            select: {
              id: true,
              name: true,
              collection: { select: { name: true, slug: true } },
            },
          })
          .catch(
            () =>
              [] as Array<{
                id: string;
                name: string;
                collection: { name: string; slug: string } | null;
              }>,
          );
      })(),
    ]);

  const { kpis, revenueSeries, ordersSeries, topProducts } = computeOrderMetrics(
    orders,
    counts.customerCount || customers.length,
    productCount,
  );

  const returningCustomers = customers.filter(
    (customer) => customer.orders.length > 1,
  ).length;

  const collectionRevenue = new Map<string, { name: string; count: number; revenue: number }>();
  const productCollection = new Map(
    productsWithCollection.map((product) => [
      product.name.toLowerCase(),
      product.collection?.name ?? "Uncategorized",
    ]),
  );

  for (const order of orders) {
    for (const item of order.items) {
      const collectionName =
        productCollection.get(item.productName.toLowerCase()) ?? "Uncategorized";
      const current = collectionRevenue.get(collectionName) ?? {
        name: collectionName,
        count: 0,
        revenue: 0,
      };
      current.count += item.quantity;
      current.revenue += Number(item.unitPrice) * item.quantity;
      collectionRevenue.set(collectionName, current);
    }
  }

  const topCollections = [...collectionRevenue.values()]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8)
    .map((item) => ({ name: item.name, count: item.count }));

  // Fallback when no order-derived collection sales yet
  if (topCollections.length === 0 && productsWithCollection.length) {
    const countsByCollection = new Map<string, number>();
    for (const product of productsWithCollection) {
      const name = product.collection?.name ?? "Uncategorized";
      countsByCollection.set(name, (countsByCollection.get(name) ?? 0) + 1);
    }
    for (const [name, count] of countsByCollection) {
      topCollections.push({ name, count });
    }
    topCollections.sort((a, b) => b.count - a.count);
  }

  const conversion =
    customers.length > 0
      ? Number(((orders.length / customers.length) * 100).toFixed(1))
      : null;

  return {
    kpis: {
      ...kpis,
      conversion,
    },
    revenueSeries,
    ordersSeries,
    topProducts,
    topCollections,
    returningCustomers,
  };
}
