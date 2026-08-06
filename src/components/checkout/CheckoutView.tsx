"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { CheckoutCancelledBanner } from "@/components/checkout/CheckoutCancelledBanner";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { motion as motionTokens } from "@/constants/design";
import {
  estimateShipping,
  estimateTax,
} from "@/features/checkout/shipping";
import {
  initialCheckoutValues,
  type AddressFields,
  type CheckoutErrors,
  type CheckoutFieldPath,
  type CheckoutFormValues,
  type PaymentMethodId,
  type ShippingMethodId,
} from "@/features/checkout/types";
import { createCheckoutSessionAction } from "@/features/checkout/actions";
import { validateCheckout, validateField } from "@/features/checkout/validation";
import { useCartStore } from "@/store/cart";

function setAddressField(
  address: AddressFields,
  key: keyof AddressFields,
  value: string,
): AddressFields {
  return { ...address, [key]: value };
}

interface CheckoutViewProps {
  cancelled?: boolean;
}

export function CheckoutView({ cancelled = false }: CheckoutViewProps) {
  const reduceMotion = useReducedMotion();
  const ease = motionTokens.easeLuxury;
  const items = useCartStore((s) => s.items);
  const couponCode = useCartStore((s) => s.couponCode);
  const [hydrated, setHydrated] = useState(false);
  const [values, setValues] = useState<CheckoutFormValues>(initialCheckoutValues);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [touched, setTouched] = useState<Partial<Record<CheckoutFieldPath, boolean>>>(
    {},
  );
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const shipping = estimateShipping(subtotal, values.shippingMethod);
  const tax = estimateTax(subtotal);

  const onFieldChange = (path: CheckoutFieldPath, value: string) => {
    setValues((prev) => {
      const next: CheckoutFormValues =
        path === "email"
          ? { ...prev, email: value }
          : (() => {
              const [group, key] = path.split(".") as [
                "shipping" | "billing",
                keyof AddressFields,
              ];
              return {
                ...prev,
                [group]: setAddressField(prev[group], key, value),
              };
            })();

      if (touched[path] || attemptedSubmit) {
        const message = validateField(next, path);
        setErrors((prevErrors) => {
          const nextErrors = { ...prevErrors };
          if (message) nextErrors[path] = message;
          else delete nextErrors[path];
          return nextErrors;
        });
      }

      return next;
    });
  };

  const onBlurField = (path: CheckoutFieldPath) => {
    setTouched((prev) => ({ ...prev, [path]: true }));
    const message = validateField(values, path);
    setErrors((prev) => {
      const next = { ...prev };
      if (message) next[path] = message;
      else delete next[path];
      return next;
    });
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAttemptedSubmit(true);
    setCheckoutError(null);
    const nextErrors = validateCheckout(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      const result = await createCheckoutSessionAction({
        email: values.email.trim(),
        shippingMethod: values.shippingMethod,
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          finish: item.product.finish,
        })),
        ...(couponCode ? { couponCode } : {}),
      });

      if (!result.ok) {
        setCheckoutError(result.error);
        setSubmitting(false);
        return;
      }

      window.location.assign(result.url);
    } catch {
      setCheckoutError("Unable to start secure checkout. Please try again.");
      setSubmitting(false);
    }
  };

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-secondary/30 pt-28 pb-20">
        <Container>
          <div className="h-40 animate-pulse rounded-2xl bg-border/40" />
        </Container>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary/20 px-6 pt-28 pb-20">
        <motion.div
          className="max-w-md text-center"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.5, ease }}
        >
          <span
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-border bg-background text-accent shadow-sm"
            aria-hidden="true"
          >
            <ShoppingBag size={26} strokeWidth={1.5} />
          </span>
          <h1 className="font-display text-4xl text-primary">Your bag is empty</h1>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Add pieces from the collection before continuing to checkout.
          </p>
          <Button href="/shop" variant="gold" className="mt-8">
            Shop Collection
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/25 pt-28 pb-20 md:pt-32 md:pb-28">
      <Container>
        {cancelled && (
          <div className="mb-8 overflow-hidden rounded-xl border border-border">
            <CheckoutCancelledBanner />
          </div>
        )}
        <motion.header
          className="mb-10 max-w-2xl md:mb-14"
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.5, ease }}
        >
          <p className="text-[10px] uppercase tracking-[0.24em] text-accent">
            Secure Checkout
          </p>
          <h1 className="mt-3 font-display text-4xl text-primary md:text-5xl">
            Complete your order
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">
            A refined checkout experience—review your selection, confirm delivery
            details, and prepare payment.
          </p>
        </motion.header>

        {checkoutError && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-error/30 bg-error/5 px-4 py-3 text-sm text-error"
          >
            {checkoutError}
          </div>
        )}

        <div className="grid items-start gap-8 lg:grid-cols-[13fr_7fr] lg:gap-10 xl:gap-12">
          <div className="min-w-0">
            <CheckoutForm
              values={values}
              errors={errors}
              shippingCost={shipping}
              onFieldChange={onFieldChange}
              onBillingSameChange={(same) =>
                setValues((prev) => ({ ...prev, billingSameAsShipping: same }))
              }
              onShippingMethodChange={(method: ShippingMethodId) =>
                setValues((prev) => ({ ...prev, shippingMethod: method }))
              }
              onPaymentMethodChange={(method: PaymentMethodId) =>
                setValues((prev) => ({ ...prev, paymentMethod: method }))
              }
              onBlurField={onBlurField}
              onSubmit={onSubmit}
              submitting={submitting}
            />
          </div>

          <div className="min-w-0">
            <OrderSummary
              items={items}
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              shippingMethod={values.shippingMethod}
            />
          </div>
        </div>
      </Container>
    </div>
  );
}
