"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { motion as motionTokens } from "@/constants/design";
import { formatPriceExact } from "@/lib/utils";
import { useCartStore } from "@/store/cart";

export interface OrderSuccessDetails {
  orderNumber: string;
  email: string;
  total: number;
  currency: string;
  paymentStatus: string;
}

interface OrderSuccessViewProps {
  order?: OrderSuccessDetails | null;
  sessionId?: string;
}

export function OrderSuccessView({ order, sessionId }: OrderSuccessViewProps) {
  const reduceMotion = useReducedMotion();
  const ease = motionTokens.easeLuxury;
  const clearCart = useCartStore((s) => s.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/25 px-6 pt-28 pb-20">
      <Container narrow>
        <motion.div
          className="mx-auto max-w-lg rounded-2xl border border-border bg-background px-8 py-12 text-center shadow-md md:px-12 md:py-14"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.55, ease }}
        >
          <span
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-accent/40 bg-secondary text-accent shadow-sm"
            aria-hidden="true"
          >
            <Check size={36} strokeWidth={1.5} />
          </span>

          <p className="mt-8 text-[10px] uppercase tracking-[0.24em] text-accent">
            Confirmed
          </p>
          <h1 className="mt-3 font-display text-4xl text-primary md:text-5xl">
            Thank you for your order.
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-muted md:text-base">
            Your payment was received successfully. A confirmation email is on
            its way with your order details and estimated delivery timeline.
          </p>

          {order ? (
            <dl className="mt-8 space-y-3 rounded-xl border border-border bg-secondary/40 px-5 py-5 text-left text-sm">
              <div className="flex items-start justify-between gap-4">
                <dt className="text-muted">Order Number</dt>
                <dd className="font-medium text-primary">{order.orderNumber}</dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-muted">Email</dt>
                <dd className="break-all text-primary">{order.email}</dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-muted">Total</dt>
                <dd className="font-display text-lg text-primary">
                  {formatPriceExact(order.total, order.currency)}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4 border-t border-border pt-3">
                <dt className="text-muted">Payment Status</dt>
                <dd className="font-medium text-primary">{order.paymentStatus}</dd>
              </div>
            </dl>
          ) : (
            sessionId && (
              <p className="mt-6 text-[11px] uppercase tracking-[0.16em] text-muted">
                Reference {sessionId.slice(-8).toUpperCase()}
              </p>
            )
          )}

          <Button href="/shop" variant="gold" size="lg" className="mt-10">
            Continue Shopping
          </Button>
        </motion.div>
      </Container>
    </div>
  );
}
