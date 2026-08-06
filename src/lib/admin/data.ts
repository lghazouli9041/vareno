import { prisma } from "@/lib/prisma";

async function safeQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.error("Admin data query failed:", error);
    return fallback;
  }
}

export async function getAdminOrders() {
  return safeQuery(
    () =>
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          items: true,
          customer: true,
          shippingAddress: true,
          billingAddress: true,
        },
        take: 200,
      }),
    [],
  );
}

export async function getAdminOrder(orderNumber: string) {
  return safeQuery(
    () =>
      prisma.order.findUnique({
        where: { orderNumber },
        include: {
          items: true,
          customer: true,
          shippingAddress: true,
          billingAddress: true,
        },
      }),
    null,
  );
}

export async function getAdminCustomers() {
  return safeQuery(
    () =>
      prisma.customer.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          addresses: true,
          orders: {
            orderBy: { createdAt: "desc" },
            include: { items: true },
          },
        },
        take: 200,
      }),
    [],
  );
}

export async function getAdminCustomer(id: string) {
  return safeQuery(
    () =>
      prisma.customer.findUnique({
        where: { id },
        include: {
          addresses: true,
          orders: {
            orderBy: { createdAt: "desc" },
            include: { items: true },
          },
        },
      }),
    null,
  );
}

export async function getAdminCounts() {
  return safeQuery(
    async () => {
      const [orderCount, customerCount] = await Promise.all([
        prisma.order.count(),
        prisma.customer.count(),
      ]);
      return { orderCount, customerCount };
    },
    { orderCount: 0, customerCount: 0 },
  );
}
