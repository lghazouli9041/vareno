"use client";

import { useState } from "react";
import { Lock, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";
import { validateCouponAction } from "@/features/admin/actions";
import {
  amountToFreeShipping,
  estimateCartShipping,
  estimateCartTax,
} from "@/lib/cart-totals";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";

interface CartSummaryProps {
  subtotal: number;
  onCheckout?: () => void;
  onContinue?: () => void;
  stickyMobile?: boolean;
  showPromo?: boolean;
  continueHref?: string;
}

export function CartSummary({
  subtotal,
  onCheckout,
  onContinue,
  stickyMobile = false,
  showPromo = true,
  continueHref = "/shop",
}: CartSummaryProps) {
  const setCouponCode = useCartStore((state) => state.setCouponCode);
  const savedCoupon = useCartStore((state) => state.couponCode);
  const [promo, setPromo] = useState(savedCoupon ?? "");
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  const shipping = estimateCartShipping(subtotal);
  const tax = estimateCartTax(subtotal);
  const total = subtotal + shipping + tax;
  const remaining = amountToFreeShipping(subtotal);

  return (
    <div
      className={
        stickyMobile
          ? "border-t border-border bg-background/95 p-5 backdrop-blur-md md:border md:border-border md:bg-background md:p-7 md:backdrop-blur-none"
          : "border border-border bg-background p-6 md:p-7"
      }
    >
      <p className="text-[10px] uppercase tracking-[0.22em] text-accent">
        Summary
      </p>
      <h2 className="mt-2 font-display text-2xl text-primary">Order Total</h2>

      {remaining > 0 && subtotal > 0 && (
        <p className="mt-4 text-sm text-muted">
          Add{" "}
          <span className="text-primary">{formatPrice(remaining)}</span> for
          complimentary shipping.
        </p>
      )}

      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Subtotal</dt>
          <dd className="text-primary">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Estimated shipping</dt>
          <dd className="text-primary">
            {shipping === 0 ? "Complimentary" : formatPrice(shipping)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Estimated tax</dt>
          <dd className="text-primary">{formatPrice(tax)}</dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-border pt-4">
          <dt className="font-medium text-primary">Total</dt>
          <dd className="font-display text-2xl text-primary">
            {formatPrice(total)}
          </dd>
        </div>
      </dl>

      {showPromo && (
        <div className="mt-6 border-t border-border pt-5">
          <label
            htmlFor="cart-promo"
            className="mb-2 block text-[11px] uppercase tracking-[0.16em] text-primary"
          >
            Promo code
          </label>
          <div className="flex gap-2">
            <input
              id="cart-promo"
              value={promo}
              onChange={(e) => {
                setPromo(e.target.value);
                setPromoMessage(null);
              }}
              placeholder="Enter code"
              className="min-w-0 flex-1 border border-border bg-secondary/40 px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                void (async () => {
                  if (!promo.trim()) {
                    setPromoMessage("Enter a promo code.");
                    return;
                  }
                  const result = await validateCouponAction(promo, subtotal);
                  if (!result.ok) {
                    setCouponCode(null);
                    setPromoMessage(result.error);
                    return;
                  }
                  setCouponCode(result.code);
                  setPromoMessage(
                    result.type === "PERCENT"
                      ? `Code ${result.code} · ${result.value}% off validated.`
                      : `Code ${result.code} · ${formatPrice(result.value)} off validated.`,
                  );
                })();
              }}
            >
              Apply
            </Button>
          </div>
          {promoMessage && (
            <p className="mt-2 text-xs text-muted" role="status">
              {promoMessage}
            </p>
          )}
        </div>
      )}

      <div className="mt-6 space-y-3">
        <Button
          href="/checkout"
          variant="gold"
          size="lg"
          className="w-full"
          onClick={onCheckout}
        >
          Secure Checkout
        </Button>
        <Button
          href={continueHref}
          variant="outline"
          size="lg"
          className="w-full"
          onClick={onContinue}
        >
          Continue Shopping
        </Button>
      </div>

      <ul className="mt-6 space-y-2.5 text-xs text-muted">
        <li className="flex items-center gap-2">
          <Lock size={14} strokeWidth={1.5} className="text-accent" />
          Secure encrypted checkout
        </li>
        <li className="flex items-center gap-2">
          <ShieldCheck size={14} strokeWidth={1.5} className="text-accent" />
          Lifetime limited warranty
        </li>
        <li className="flex items-center gap-2">
          <Truck size={14} strokeWidth={1.5} className="text-accent" />
          Free shipping over ${siteConfig.shipping.freeThreshold}
        </li>
      </ul>
    </div>
  );
}
