import { z } from "zod";
import { siteConfig } from "@/config/site";
import {
  estimateShipping,
  getShippingMethod,
} from "@/features/checkout/shipping";
import type { ShippingMethodId } from "@/features/checkout/types";
import { resolveCheckoutCatalogProductAsync } from "@/lib/catalog/repository";
import { catalogToLegacyProduct } from "@/lib/catalog/to-legacy-product";
import { readValidCoupon } from "@/lib/coupons";
import { assertInventoryAvailable } from "@/lib/inventory";
import { getAppUrl, getStripe, toStripeAmount } from "@/lib/stripe";
import type { Product } from "@/types";

const checkoutItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive().max(99),
  finish: z.string().optional(),
});

export const createCheckoutSessionSchema = z.object({
  email: z.string().email(),
  shippingMethod: z.enum(["standard", "express", "white-glove"]),
  items: z.array(checkoutItemSchema).min(1),
  couponCode: z.string().trim().max(64).optional(),
});

export type CreateCheckoutSessionInput = z.infer<
  typeof createCheckoutSessionSchema
>;

async function resolveProduct(productId: string): Promise<Product | null> {
  const catalogProduct = await resolveCheckoutCatalogProductAsync(productId);
  if (!catalogProduct) return null;
  return catalogToLegacyProduct(catalogProduct);
}

function resolveUnitPrice(product: Product, finishName?: string): number {
  if (!finishName) return product.price;
  const variant = product.variants.find(
    (item) =>
      item.finishName === finishName ||
      item.finish === finishName ||
      item.finishName.toLowerCase() === finishName.toLowerCase(),
  );
  return variant?.price ?? product.price;
}

function absoluteImageUrl(src: string | undefined): string | undefined {
  if (!src) return undefined;
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  const appUrl = getAppUrl();
  return `${appUrl}${src.startsWith("/") ? src : `/${src}`}`;
}

export async function createStripeCheckoutSession(
  input: CreateCheckoutSessionInput,
): Promise<{ url: string; sessionId: string }> {
  const stripe = getStripe();
  const appUrl = getAppUrl();

  const lineItems: {
    product: Product;
    quantity: number;
    unitAmount: number;
    finish?: string;
  }[] = [];

  for (const item of input.items) {
    const product = await resolveProduct(item.productId);
    if (!product) {
      throw new Error(`Product not found: ${item.productId}`);
    }
    if (!product.inStock) {
      throw new Error(`${product.name} is currently unavailable`);
    }
    lineItems.push({
      product,
      quantity: item.quantity,
      unitAmount: resolveUnitPrice(product, item.finish),
      finish: item.finish,
    });
  }

  const subtotal = lineItems.reduce(
    (sum, item) => sum + item.unitAmount * item.quantity,
    0,
  );

  const stock = await assertInventoryAvailable(
    lineItems.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      finish: item.finish ?? item.product.finish,
      quantity: item.quantity,
    })),
  );
  if (!stock.ok) {
    throw new Error(stock.error);
  }

  const shippingMethodId = input.shippingMethod as ShippingMethodId;
  const shippingAmount = estimateShipping(subtotal, shippingMethodId);
  const method = getShippingMethod(shippingMethodId);

  let stripeCouponId: string | undefined;
  let appliedCouponCode: string | undefined;
  if (input.couponCode?.trim()) {
    const couponResult = await readValidCoupon(input.couponCode, subtotal);
    if (!couponResult.ok) {
      throw new Error(couponResult.error);
    }
    appliedCouponCode = couponResult.code;
    const stripeCoupon =
      couponResult.type === "PERCENT"
        ? await stripe.coupons.create({
            percent_off: couponResult.value,
            duration: "once",
            name: couponResult.code,
            max_redemptions: 1,
          })
        : await stripe.coupons.create({
            amount_off: toStripeAmount(couponResult.value),
            currency: siteConfig.currency.toLowerCase(),
            duration: "once",
            name: couponResult.code,
            max_redemptions: 1,
          });
    stripeCouponId = stripeCoupon.id;
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: input.email,
    billing_address_collection: "required",
    phone_number_collection: { enabled: true },
    success_url: `${appUrl}/order-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/checkout/cancel`,
    metadata: {
      shippingMethod: shippingMethodId,
      source: "vareno-checkout",
      ...(appliedCouponCode ? { couponCode: appliedCouponCode } : {}),
    },
    ...(stripeCouponId
      ? { discounts: [{ coupon: stripeCouponId }] }
      : {}),
    line_items: lineItems.map((item) => {
      const image = absoluteImageUrl(item.product.images[0]);
      return {
        quantity: item.quantity,
        price_data: {
          currency: siteConfig.currency.toLowerCase(),
          unit_amount: toStripeAmount(item.unitAmount),
          product_data: {
            name: item.product.name,
            description: item.finish
              ? `Finish: ${item.finish}`
              : item.product.tagline || undefined,
            images: image ? [image] : undefined,
            metadata: {
              productId: item.product.id,
              slug: item.product.slug,
              finish: item.finish ?? item.product.finish,
            },
          },
        },
      };
    }),
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: toStripeAmount(shippingAmount),
            currency: siteConfig.currency.toLowerCase(),
          },
          display_name:
            shippingAmount === 0 && method.id === "standard"
              ? "Complimentary Standard Delivery"
              : method.label,
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: method.id === "express" ? 2 : 5,
            },
            maximum: {
              unit: "business_day",
              value: method.id === "express" ? 3 : method.id === "white-glove" ? 8 : 7,
            },
          },
        },
      },
    ],
  });

  if (!session.url) {
    throw new Error("Stripe did not return a checkout URL");
  }

  return { url: session.url, sessionId: session.id };
}
