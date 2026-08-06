import { Prisma, type Order, type OrderItem } from "@prisma/client";
import type Stripe from "stripe";
import {
  sendAdminOrderNotification,
  sendOrderConfirmationEmail,
} from "@/lib/email";
import { decrementInventoryForLines } from "@/lib/inventory";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { formatPriceExact } from "@/lib/utils";

export type OrderWithItems = Order & { items: OrderItem[] };

function fromStripeAmount(cents: number | null | undefined): Prisma.Decimal {
  return new Prisma.Decimal(((cents ?? 0) / 100).toFixed(2));
}

function generateOrderNumber(): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `VR-${stamp}-${suffix}`;
}

function paymentIntentId(
  paymentIntent: string | Stripe.PaymentIntent | null | undefined,
): string | null {
  if (!paymentIntent) return null;
  return typeof paymentIntent === "string" ? paymentIntent : paymentIntent.id;
}

function addressFromStripe(
  address: Stripe.Address | null | undefined,
  name: string | null | undefined,
  phone: string | null | undefined,
) {
  if (!address?.line1 || !address.city || !address.country) return null;

  const parts = (name ?? "").trim().split(/\s+/);
  const firstName = parts[0] || "Customer";
  const lastName = parts.slice(1).join(" ") || "—";

  return {
    firstName,
    lastName,
    line1: address.line1,
    line2: address.line2 ?? undefined,
    city: address.city,
    state: address.state ?? "",
    postalCode: address.postal_code ?? "",
    country: address.country,
    phone: phone ?? undefined,
  };
}

function extractLineItems(
  lineItems: Stripe.LineItem[] | undefined,
): Array<{
  productId: string;
  productName: string;
  finish: string;
  quantity: number;
  unitPrice: Prisma.Decimal;
}> {
  if (!lineItems?.length) return [];

  return lineItems
    .filter((item) => {
      // Skip synthetic shipping rows if present as line items.
      const name = item.description?.toLowerCase() ?? "";
      return !name.includes("shipping") && !name.includes("delivery");
    })
    .map((item) => {
      const product = item.price?.product;
      const metadata =
        product && typeof product !== "string" && !("deleted" in product && product.deleted)
          ? product.metadata
          : undefined;

      const stripeProductId =
        typeof product === "string"
          ? product
          : product && !("deleted" in product && product.deleted)
            ? product.id
            : undefined;

      const unitAmount =
        item.price?.unit_amount ??
        (item.quantity ? Math.round((item.amount_total ?? 0) / item.quantity) : 0);

      return {
        productId: metadata?.productId || stripeProductId || "unknown",
        productName: item.description || metadata?.slug || "Product",
        finish: metadata?.finish || "Standard",
        quantity: item.quantity ?? 1,
        unitPrice: fromStripeAmount(unitAmount),
      };
    });
}

async function retrieveCheckoutSession(
  sessionId: string,
): Promise<Stripe.Checkout.Session> {
  const stripe = getStripe();
  return stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items.data.price.product", "payment_intent", "customer_details"],
  });
}

/**
 * Persist a paid Checkout Session as Order + OrderItems + Customer + Address.
 * Idempotent on `stripeSessionId`.
 */
export async function createOrderFromCheckoutSession(
  sessionInput: Stripe.Checkout.Session | string,
): Promise<OrderWithItems> {
  const session =
    typeof sessionInput === "string"
      ? await retrieveCheckoutSession(sessionInput)
      : sessionInput.id
        ? await retrieveCheckoutSession(sessionInput.id)
        : sessionInput;

  const existing = await prisma.order.findUnique({
    where: { stripeSessionId: session.id },
    include: { items: true },
  });
  if (existing) return existing;

  const email =
    session.customer_details?.email ||
    session.customer_email ||
    undefined;

  if (!email) {
    throw new Error(`Checkout session ${session.id} is missing customer email`);
  }

  let lineItems = extractLineItems(session.line_items?.data);
  if (!lineItems.length && session.id) {
    const stripe = getStripe();
    const listed = await stripe.checkout.sessions.listLineItems(session.id, {
      limit: 100,
      expand: ["data.price.product"],
    });
    lineItems = extractLineItems(listed.data);
  }

  if (!lineItems.length) {
    throw new Error(`Checkout session ${session.id} has no line items`);
  }

  const shippingAmount = fromStripeAmount(session.shipping_cost?.amount_total);
  const taxAmount = fromStripeAmount(session.total_details?.amount_tax);
  const totalAmount = fromStripeAmount(session.amount_total);
  const subtotalAmount = fromStripeAmount(
    session.amount_subtotal ??
      Math.max(
        (session.amount_total ?? 0) -
          (session.shipping_cost?.amount_total ?? 0) -
          (session.total_details?.amount_tax ?? 0),
        0,
      ),
  );

  const details = session.customer_details;
  const collectedShipping = session.collected_information?.shipping_details;

  const shippingData = addressFromStripe(
    collectedShipping?.address ?? details?.address,
    collectedShipping?.name ?? details?.name,
    details?.phone ?? undefined,
  );

  try {
    let isNewOrder = false;
    const order = await prisma.$transaction(async (tx) => {
      const again = await tx.order.findUnique({
        where: { stripeSessionId: session.id },
        include: { items: true },
      });
      if (again) return again;
      isNewOrder = true;

      const customer = await tx.customer.upsert({
        where: { email },
        create: {
          email,
          firstName: shippingData?.firstName,
          lastName: shippingData?.lastName,
          phone: details?.phone ?? shippingData?.phone,
        },
        update: {
          firstName: shippingData?.firstName ?? undefined,
          lastName: shippingData?.lastName ?? undefined,
          phone: details?.phone ?? shippingData?.phone ?? undefined,
        },
      });

      let shippingAddressId: string | undefined;
      if (shippingData) {
        const address = await tx.address.create({
          data: {
            customerId: customer.id,
            ...shippingData,
          },
        });
        shippingAddressId = address.id;
      }

      let billingAddressId: string | undefined;
      const billingData = addressFromStripe(
        details?.address,
        details?.name,
        details?.phone ?? undefined,
      );
      if (billingData) {
        const address = await tx.address.create({
          data: {
            customerId: customer.id,
            ...billingData,
          },
        });
        billingAddressId = address.id;
      }

      await decrementInventoryForLines(
        tx,
        lineItems.map((item) => ({
          productId: String(item.productId),
          productName: item.productName,
          finish: item.finish,
          quantity: item.quantity,
        })),
      );

      return tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          stripeSessionId: session.id,
          stripePaymentIntentId: paymentIntentId(session.payment_intent),
          status: session.payment_status === "paid" ? "PAID" : "PENDING",
          currency: (session.currency ?? "usd").toUpperCase(),
          subtotal: subtotalAmount,
          tax: taxAmount,
          shipping: shippingAmount,
          total: totalAmount,
          customerEmail: email,
          customerId: customer.id,
          shippingAddressId,
          billingAddressId,
          items: {
            create: lineItems.map((item) => ({
              productId: String(item.productId),
              productName: item.productName,
              finish: item.finish,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            })),
          },
        },
        include: { items: true },
      });
    });

    if (isNewOrder) {
      const couponCode = session.metadata?.couponCode;
      if (couponCode) {
        try {
          const { redeemCoupon } = await import("@/lib/coupons");
          await redeemCoupon(couponCode, Number(subtotalAmount));
        } catch (error) {
          console.error("Coupon redeem after payment failed:", error);
        }
      }

      // Fire-and-forget transactional email (skipped when RESEND_API_KEY unset).
      void Promise.all([
        sendOrderConfirmationEmail({
          orderNumber: order.orderNumber,
          email: order.customerEmail,
          total: formatPriceExact(Number(order.total), order.currency),
          currency: order.currency,
          items: order.items.map((item) => ({
            name: item.productName,
            quantity: item.quantity,
            finish: item.finish,
          })),
        }),
        sendAdminOrderNotification({
          orderNumber: order.orderNumber,
          email: order.customerEmail,
          total: formatPriceExact(Number(order.total), order.currency),
        }),
      ]);
    }

    return order;
  } catch (error) {
    if (
      typeof error === "object" &&
      error &&
      "code" in error &&
      (error as { code?: string }).code === "P2002"
    ) {
      const duplicate = await getOrderByStripeSessionId(session.id);
      if (duplicate) return duplicate;
    }
    throw error;
  }
}

export async function getOrderByStripeSessionId(
  sessionId: string,
): Promise<OrderWithItems | null> {
  return prisma.order.findUnique({
    where: { stripeSessionId: sessionId },
    include: { items: true },
  });
}

export async function ensureOrderForSession(
  sessionId: string,
): Promise<OrderWithItems | null> {
  const existing = await getOrderByStripeSessionId(sessionId);
  if (existing) return existing;

  try {
    return await createOrderFromCheckoutSession(sessionId);
  } catch (error) {
    console.error("ensureOrderForSession failed:", error);
    return null;
  }
}

export { formatOrderStatus } from "@/lib/orders/status";
