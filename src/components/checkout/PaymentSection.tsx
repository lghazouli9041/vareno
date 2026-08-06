"use client";

import { CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PaymentMethodId } from "@/features/checkout/types";

const paymentOptions: {
  id: PaymentMethodId;
  label: string;
  description: string;
}[] = [
  {
    id: "card",
    label: "Credit Card",
    description: "Secure card payment — coming soon via Stripe.",
  },
  {
    id: "apple-pay",
    label: "Apple Pay",
    description: "Placeholder for Apple Pay checkout.",
  },
  {
    id: "google-pay",
    label: "Google Pay",
    description: "Placeholder for Google Pay checkout.",
  },
];

interface PaymentSectionProps {
  value: PaymentMethodId;
  onChange: (method: PaymentMethodId) => void;
}

export function PaymentSection({ value, onChange }: PaymentSectionProps) {
  return (
    <section
      aria-labelledby="payment-title"
      className="rounded-2xl border border-border bg-background p-6 shadow-sm md:p-8"
    >
      <p className="text-[10px] uppercase tracking-[0.22em] text-accent">
        Payment
      </p>
      <h2
        id="payment-title"
        className="mt-2 font-display text-2xl text-primary md:text-3xl"
      >
        Payment Method
      </h2>
      <p className="mt-2 max-w-xl text-sm text-muted">
        Payment processing is not connected yet. Choose a method to preview the
        experience.
      </p>

      <div className="mt-7 space-y-3" role="radiogroup" aria-label="Payment method">
        {paymentOptions.map((option) => {
          const selected = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option.id)}
              className={cn(
                "flex w-full items-start gap-4 rounded-xl border px-4 py-4 text-left transition-all duration-300",
                selected
                  ? "border-accent bg-secondary/60 shadow-sm"
                  : "border-border bg-background hover:border-primary/20",
              )}
            >
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
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2 font-medium text-primary">
                  {option.id === "card" && (
                    <CreditCard size={16} strokeWidth={1.5} aria-hidden="true" />
                  )}
                  {option.label}
                  <span className="rounded-md border border-border px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-muted">
                    Placeholder
                  </span>
                </span>
                <span className="mt-1 block text-sm text-muted">
                  {option.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {value === "card" && (
        <div className="mt-5 rounded-xl border border-dashed border-border bg-secondary/40 px-4 py-5">
          <p className="text-[11px] uppercase tracking-[0.16em] text-muted">
            Card details
          </p>
          <p className="mt-2 text-sm text-muted">
            Card number, expiry, and CVC fields will appear here once Stripe is
            connected.
          </p>
        </div>
      )}
    </section>
  );
}
