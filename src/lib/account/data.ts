import { prisma } from "@/lib/prisma";
import { formatOrderStatus } from "@/lib/orders/status";

export async function getOrdersForEmail(email: string) {
  return prisma.order.findMany({
    where: { customerEmail: email },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });
}

export async function getOrderForEmail(orderNumber: string, email: string) {
  return prisma.order.findFirst({
    where: { orderNumber, customerEmail: email },
    include: {
      items: true,
      shippingAddress: true,
      billingAddress: true,
    },
  });
}

export async function getAddressesForEmail(email: string) {
  const customer = await prisma.customer.findUnique({
    where: { email },
    include: {
      addresses: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
  return customer?.addresses ?? [];
}

export { formatOrderStatus };
