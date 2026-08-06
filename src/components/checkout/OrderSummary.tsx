"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { motion as motionTokens } from "@/constants/design";
import { getShippingMethod } from "@/features/checkout/shipping";
import type { ShippingMethodId } from "@/features/checkout/types";
import { formatPrice } from "@/lib/utils";
import type { CartItem } from "@/types";

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  shippingMethod: ShippingMethodId;
}

export function OrderSummary({
  items,
  subtotal,
  shipping,
  tax,
  shippingMethod,
}: OrderSummaryProps) {
  const reduceMotion = useReducedMotion();
  const ease = motionTokens.easeLuxury;
  const total = subtotal + shipping + tax;
  const method = getShippingMethod(shippingMethod);

  return (
    <motion.aside
      aria-labelledby="order-summary-title"
      className="rounded-2xl border border-border bg-background p-6 shadow-md lg:sticky lg:top-28 lg:p-7"
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.55, ease, delay: 0.08 }}
    >
      <p className="text-[10px] uppercase tracking-[0.24em] text-accent">
        Review
      </p>
      <h2
        id="order-summary-title"
        className="mt-2 font-display text-2xl text-primary"
      >
        Order Summary
      </h2>

      <ul className="mt-7 space-y-5 border-b border-border pb-6">
        {items.map((item) => (
          <li key={item.product.id} className="flex gap-4">
            <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-surface">
              <Image
                src={item.product.images[0]}
                alt={item.product.name}
                fill
                className="object-cover"
                sizes="64px"
              />
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] text-inverse-text">
                {item.quantity}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-lg leading-tight text-primary">
                {item.product.name}
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-muted">
                {item.product.finish}
              </p>
              <p className="mt-2 text-sm text-muted">Qty {item.quantity}</p>
            </div>
            <p className="shrink-0 font-display text-base text-primary">
              {formatPrice(item.product.price * item.quantity)}
            </p>
          </li>
        ))}
      </ul>

      <dl className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Subtotal</dt>
          <dd className="text-primary">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted">
            Shipping
            <span className="mt-0.5 block text-[11px] text-muted/80">
              {method.label}
            </span>
          </dt>
          <dd className="text-primary">
            {shipping === 0 ? "Complimentary" : formatPrice(shipping)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Tax</dt>
          <dd className="text-primary">{formatPrice(tax)}</dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-border pt-4">
          <dt className="font-medium text-primary">Grand Total</dt>
          <dd className="font-display text-2xl text-primary">
            {formatPrice(total)}
          </dd>
        </div>
      </dl>
    </motion.aside>
  );
}
