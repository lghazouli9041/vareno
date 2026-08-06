"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  FloatingField,
  FloatingSelect,
} from "@/components/checkout/FloatingField";
import { PaymentSection } from "@/components/checkout/PaymentSection";
import { Button } from "@/components/ui/Button";
import { motion as motionTokens } from "@/constants/design";
import {
  countries,
  shippingMethods,
  usStates,
} from "@/features/checkout/shipping";
import type {
  AddressFields,
  CheckoutErrors,
  CheckoutFieldPath,
  CheckoutFormValues,
  PaymentMethodId,
  ShippingMethodId,
} from "@/features/checkout/types";
import { cn, formatPrice } from "@/lib/utils";

interface CheckoutFormProps {
  values: CheckoutFormValues;
  errors: CheckoutErrors;
  shippingCost: number;
  onFieldChange: (path: CheckoutFieldPath, value: string) => void;
  onBillingSameChange: (same: boolean) => void;
  onShippingMethodChange: (method: ShippingMethodId) => void;
  onPaymentMethodChange: (method: PaymentMethodId) => void;
  onBlurField: (path: CheckoutFieldPath) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  submitting?: boolean;
}

function SectionCard({
  eyebrow,
  title,
  description,
  children,
  delay = 0,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();
  const ease = motionTokens.easeLuxury;

  return (
    <motion.section
      className="rounded-2xl border border-border bg-background p-6 shadow-sm md:p-8"
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.5, ease, delay }}
    >
      <p className="text-[10px] uppercase tracking-[0.22em] text-accent">
        {eyebrow}
      </p>
      <h2 className="mt-2 font-display text-2xl text-primary md:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
          {description}
        </p>
      )}
      <div className="mt-7">{children}</div>
    </motion.section>
  );
}

function AddressFieldsGrid({
  prefix,
  values,
  errors,
  onFieldChange,
  onBlurField,
}: {
  prefix: "shipping" | "billing";
  values: AddressFields;
  errors: CheckoutErrors;
  onFieldChange: (path: CheckoutFieldPath, value: string) => void;
  onBlurField: (path: CheckoutFieldPath) => void;
}) {
  const path = (key: keyof AddressFields): CheckoutFieldPath =>
    `${prefix}.${key}`;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FloatingField
        id={`${prefix}-first-name`}
        label="First Name"
        autoComplete="given-name"
        value={values.firstName}
        error={errors[path("firstName")]}
        onChange={(e) => onFieldChange(path("firstName"), e.target.value)}
        onBlur={() => onBlurField(path("firstName"))}
      />
      <FloatingField
        id={`${prefix}-last-name`}
        label="Last Name"
        autoComplete="family-name"
        value={values.lastName}
        error={errors[path("lastName")]}
        onChange={(e) => onFieldChange(path("lastName"), e.target.value)}
        onBlur={() => onBlurField(path("lastName"))}
      />
      <div className="sm:col-span-2">
        <FloatingField
          id={`${prefix}-phone`}
          label="Phone"
          type="tel"
          autoComplete="tel"
          value={values.phone}
          error={errors[path("phone")]}
          onChange={(e) => onFieldChange(path("phone"), e.target.value)}
          onBlur={() => onBlurField(path("phone"))}
        />
      </div>
      <div className="sm:col-span-2">
        <FloatingSelect
          id={`${prefix}-country`}
          label="Country"
          autoComplete="country-name"
          value={values.country}
          options={countries}
          error={errors[path("country")]}
          onChange={(e) => onFieldChange(path("country"), e.target.value)}
          onBlur={() => onBlurField(path("country"))}
        />
      </div>
      <div className="sm:col-span-2">
        <FloatingField
          id={`${prefix}-address`}
          label="Address"
          autoComplete={`${prefix === "shipping" ? "shipping" : "billing"} street-address`}
          value={values.address}
          error={errors[path("address")]}
          onChange={(e) => onFieldChange(path("address"), e.target.value)}
          onBlur={() => onBlurField(path("address"))}
        />
      </div>
      <FloatingField
        id={`${prefix}-city`}
        label="City"
        autoComplete={`${prefix === "shipping" ? "shipping" : "billing"} address-level2`}
        value={values.city}
        error={errors[path("city")]}
        onChange={(e) => onFieldChange(path("city"), e.target.value)}
        onBlur={() => onBlurField(path("city"))}
      />
      <FloatingSelect
        id={`${prefix}-state`}
        label="State"
        autoComplete={`${prefix === "shipping" ? "shipping" : "billing"} address-level1`}
        value={values.state}
        options={usStates}
        error={errors[path("state")]}
        onChange={(e) => onFieldChange(path("state"), e.target.value)}
        onBlur={() => onBlurField(path("state"))}
      />
      <div className="sm:col-span-2">
        <FloatingField
          id={`${prefix}-zip`}
          label="ZIP Code"
          autoComplete={`${prefix === "shipping" ? "shipping" : "billing"} postal-code`}
          value={values.zip}
          error={errors[path("zip")]}
          onChange={(e) => onFieldChange(path("zip"), e.target.value)}
          onBlur={() => onBlurField(path("zip"))}
        />
      </div>
    </div>
  );
}

export function CheckoutForm({
  values,
  errors,
  shippingCost,
  onFieldChange,
  onBillingSameChange,
  onShippingMethodChange,
  onPaymentMethodChange,
  onBlurField,
  onSubmit,
  submitting = false,
}: CheckoutFormProps) {
  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6 md:space-y-8">
      <SectionCard
        eyebrow="Account"
        title="Customer Information"
        description="We’ll send order confirmation and delivery updates to this email."
        delay={0}
      >
        <FloatingField
          id="checkout-email"
          label="Email"
          type="email"
          autoComplete="email"
          value={values.email}
          error={errors.email}
          onChange={(e) => onFieldChange("email", e.target.value)}
          onBlur={() => onBlurField("email")}
        />
      </SectionCard>

      <SectionCard
        eyebrow="Delivery"
        title="Shipping Address"
        description="Where should we send your fixtures?"
        delay={0.05}
      >
        <AddressFieldsGrid
          prefix="shipping"
          values={values.shipping}
          errors={errors}
          onFieldChange={onFieldChange}
          onBlurField={onBlurField}
        />
      </SectionCard>

      <SectionCard
        eyebrow="Billing"
        title="Billing Address"
        description="Used for payment verification during secure Stripe Checkout."
        delay={0.1}
      >
        <label className="mb-6 flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={values.billingSameAsShipping}
            onChange={(e) => onBillingSameChange(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-border text-accent focus:ring-accent"
          />
          <span>
            <span className="block text-sm font-medium text-primary">
              Same as shipping address
            </span>
            <span className="mt-0.5 block text-sm text-muted">
              Uncheck to enter a separate billing address.
            </span>
          </span>
        </label>

        {!values.billingSameAsShipping && (
          <AddressFieldsGrid
            prefix="billing"
            values={values.billing}
            errors={errors}
            onFieldChange={onFieldChange}
            onBlurField={onBlurField}
          />
        )}
      </SectionCard>

      <SectionCard
        eyebrow="Logistics"
        title="Shipping Method"
        delay={0.15}
      >
        <div
          className="space-y-3"
          role="radiogroup"
          aria-label="Shipping method"
        >
          {shippingMethods.map((method) => {
            const selected = values.shippingMethod === method.id;
            const priceLabel =
              method.id === "standard" && shippingCost === 0
                ? "Complimentary"
                : method.id === "standard"
                  ? formatPrice(shippingCost || 45)
                  : formatPrice(method.price);

            return (
              <button
                key={method.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onShippingMethodChange(method.id)}
                className={cn(
                  "flex w-full items-start justify-between gap-4 rounded-xl border px-4 py-4 text-left transition-all duration-300",
                  selected
                    ? "border-accent bg-secondary/60 shadow-sm"
                    : "border-border hover:border-primary/20",
                )}
              >
                <span className="flex items-start gap-3">
                  <span
                    className={cn(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                      selected
                        ? "border-accent bg-accent"
                        : "border-border bg-background",
                    )}
                    aria-hidden="true"
                  >
                    {selected && (
                      <span className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </span>
                  <span>
                    <span className="block font-medium text-primary">
                      {method.label}
                    </span>
                    <span className="mt-1 block text-sm text-muted">
                      {method.description}
                    </span>
                    <span className="mt-1 block text-xs uppercase tracking-[0.14em] text-muted">
                      {method.eta}
                    </span>
                  </span>
                </span>
                <span className="shrink-0 font-display text-base text-primary">
                  {priceLabel}
                </span>
              </button>
            );
          })}
        </div>
      </SectionCard>

      <PaymentSection
        value={values.paymentMethod}
        onChange={onPaymentMethodChange}
      />

      <motion.div
        initial={false}
        className="rounded-2xl border border-border bg-secondary/30 p-6 shadow-sm md:p-7"
      >
        <p className="text-sm leading-relaxed text-muted">
          By placing your order, you agree to our shipping timeline estimates and
          warranty terms. You will complete payment securely on Stripe Checkout.
        </p>
        <Button
          type="submit"
          variant="gold"
          size="lg"
          className="mt-5 w-full"
          disabled={submitting}
        >
          {submitting ? "Redirecting to Stripe…" : "Secure Checkout"}
        </Button>
      </motion.div>
    </form>
  );
}
