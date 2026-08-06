"use client";

import { memo, useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { AdminPageHeader } from "@/components/admin/AdminUi";
import {
  deleteCouponAction,
  listAdminCouponsAction,
  toggleCouponAction,
  upsertCouponAction,
} from "@/features/admin/actions";
import { formatPrice } from "@/lib/utils";

type DiscountRow = {
  id: string;
  code: string;
  type: "PERCENT" | "FIXED";
  value: number;
  active: boolean;
  startsAt: string;
  endsAt: string;
  minSubtotal?: number;
  usageLimit?: number;
  usedCount: number;
};

function DiscountsBoardComponent() {
  const [discounts, setDiscounts] = useState<DiscountRow[]>([]);
  const [code, setCode] = useState("");
  const [value, setValue] = useState(10);
  const [type, setType] = useState<"PERCENT" | "FIXED">("PERCENT");
  const [startsAt, setStartsAt] = useState("2026-01-01");
  const [endsAt, setEndsAt] = useState("2026-12-31");
  const [usageLimit, setUsageLimit] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const reload = () => {
    startTransition(async () => {
      const result = await listAdminCouponsAction();
      if (!result.ok) {
        setError(result.error ?? "Unable to load coupons");
        setDiscounts([]);
        return;
      }
      setError(null);
      setDiscounts(result.discounts);
    });
  };

  useEffect(() => {
    reload();
  }, []);

  const create = () => {
    void upsertCouponAction({
      code,
      type,
      value,
      active: true,
      startsAt,
      endsAt,
      usageLimit: usageLimit === "" ? undefined : Number(usageLimit),
    }).then((result) => {
      if (!result.ok) {
        setError(result.error ?? "Unable to save");
        return;
      }
      setCode("");
      reload();
    });
  };

  return (
    <div>
      <AdminPageHeader
        title="Discounts"
        description="Coupon codes and scheduled promotions."
      />

      <div className="mb-8 border border-border p-5">
        <h2 className="font-display text-2xl">Create coupon</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-6">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Code"
            className="border border-border bg-secondary/30 px-3 py-2.5 text-sm"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value as typeof type)}
            className="border border-border bg-secondary/30 px-3 py-2.5 text-sm"
          >
            <option value="PERCENT">Percent</option>
            <option value="FIXED">Fixed</option>
          </select>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(Number(e.target.value) || 0)}
            className="border border-border bg-secondary/30 px-3 py-2.5 text-sm"
          />
          <input
            type="date"
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
            className="border border-border bg-secondary/30 px-3 py-2.5 text-sm"
          />
          <input
            type="date"
            value={endsAt}
            onChange={(e) => setEndsAt(e.target.value)}
            className="border border-border bg-secondary/30 px-3 py-2.5 text-sm"
          />
          <input
            type="number"
            value={usageLimit}
            onChange={(e) =>
              setUsageLimit(e.target.value === "" ? "" : Number(e.target.value))
            }
            placeholder="Usage limit"
            className="border border-border bg-secondary/30 px-3 py-2.5 text-sm"
          />
        </div>
        <Button
          type="button"
          variant="gold"
          size="sm"
          className="mt-4"
          onClick={create}
          disabled={pending}
        >
          Save coupon
        </Button>
      </div>

      {error && (
        <p className="mb-4 text-sm text-muted" role="status">
          {error}
        </p>
      )}

      <div className="overflow-x-auto border border-border">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-border bg-secondary/40 text-[11px] uppercase tracking-[0.14em] text-muted">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Value</th>
              <th className="px-4 py-3">Schedule</th>
              <th className="px-4 py-3">Usage</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((discount) => (
              <tr
                key={discount.id}
                className="border-b border-border/80 last:border-0"
              >
                <td className="px-4 py-3 font-medium">{discount.code}</td>
                <td className="px-4 py-3">
                  {discount.type === "PERCENT"
                    ? `${discount.value}%`
                    : formatPrice(discount.value)}
                </td>
                <td className="px-4 py-3 text-muted">
                  {discount.startsAt || "—"} → {discount.endsAt || "—"}
                </td>
                <td className="px-4 py-3 text-muted">
                  {discount.usedCount}
                  {discount.usageLimit != null ? ` / ${discount.usageLimit}` : ""}
                </td>
                <td className="px-4 py-3">
                  {discount.active ? "Active" : "Paused"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      className="text-[11px] uppercase tracking-[0.12em] text-muted hover:text-accent"
                      onClick={() => {
                        void toggleCouponAction(discount.id).then(reload);
                      }}
                    >
                      {discount.active ? "Pause" : "Activate"}
                    </button>
                    <button
                      type="button"
                      className="text-[11px] uppercase tracking-[0.12em] text-muted hover:text-error"
                      onClick={() => {
                        void deleteCouponAction(discount.id).then(reload);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {discounts.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted">
                  No coupons yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const DiscountsBoard = memo(DiscountsBoardComponent);
