import { prisma } from "@/lib/prisma";

export async function readValidCoupon(code: string, subtotal: number) {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return { ok: false as const, error: "Enter a code" };

  const coupon = await prisma.coupon.findUnique({
    where: { code: normalized },
  });
  if (!coupon || !coupon.active) {
    return { ok: false as const, error: "Invalid coupon" };
  }

  const now = new Date();
  if (coupon.startsAt && coupon.startsAt > now) {
    return { ok: false as const, error: "Coupon not active yet" };
  }
  if (coupon.endsAt && coupon.endsAt < now) {
    return { ok: false as const, error: "Coupon expired" };
  }
  if (coupon.minSubtotal && subtotal < Number(coupon.minSubtotal)) {
    return { ok: false as const, error: "Order does not meet minimum" };
  }
  if (coupon.usageLimit != null && coupon.usedCount >= coupon.usageLimit) {
    return { ok: false as const, error: "Coupon usage limit reached" };
  }

  return {
    ok: true as const,
    coupon,
    type: coupon.type,
    value: Number(coupon.value),
    code: coupon.code,
  };
}

/** Atomically consume one coupon use after successful payment. */
export async function redeemCoupon(code: string, subtotal: number) {
  const result = await readValidCoupon(code, subtotal);
  if (!result.ok) return result;

  const updated = await prisma.coupon.updateMany({
    where: {
      id: result.coupon.id,
      active: true,
      ...(result.coupon.usageLimit != null
        ? { usedCount: { lt: result.coupon.usageLimit } }
        : {}),
    },
    data: { usedCount: { increment: 1 } },
  });

  if (!updated.count) {
    return { ok: false as const, error: "Coupon usage limit reached" };
  }

  return {
    ok: true as const,
    type: result.type,
    value: result.value,
    code: result.code,
  };
}
