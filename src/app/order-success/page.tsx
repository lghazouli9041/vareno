import type { Metadata } from "next";
import { OrderSuccessView } from "@/components/checkout/OrderSuccessView";
import { siteConfig } from "@/config/site";
import {
  ensureOrderForSession,
  formatOrderStatus,
} from "@/lib/orders/create-order-from-session";

export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "Thank you for your order. Your payment was received successfully.",
  alternates: { canonical: "/order-success" },
  robots: { index: false, follow: false },
  openGraph: {
    title: `Order Confirmed | ${siteConfig.name}`,
    description: "Thank you for your order.",
    url: `${siteConfig.url}/order-success`,
  },
};

type OrderSuccessPageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function OrderSuccessPage({
  searchParams,
}: OrderSuccessPageProps) {
  const params = await searchParams;
  const sessionId = params.session_id;

  const order = sessionId ? await ensureOrderForSession(sessionId) : null;

  return (
    <OrderSuccessView
      sessionId={sessionId}
      order={
        order
          ? {
              orderNumber: order.orderNumber,
              email: order.customerEmail,
              total: Number(order.total),
              currency: order.currency,
              paymentStatus: formatOrderStatus(order.status),
            }
          : null
      }
    />
  );
}
