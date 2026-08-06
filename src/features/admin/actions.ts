"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { assertAdminAction } from "@/lib/auth/admin";
import { getLowStockVariants } from "@/lib/inventory";
import { prisma } from "@/lib/prisma";
import type { DiscountType, ReviewStatus } from "@prisma/client";

export async function listInventoryAction() {
  const gate = await assertAdminAction();
  if (!gate.ok) return { ok: false as const, error: gate.error, rows: [] };

  try {
    const variants = await prisma.variant.findMany({
      include: {
        product: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { inventory: "asc" },
      take: 300,
    });
    const low = await getLowStockVariants(8);
    return {
      ok: true as const,
      rows: variants.map((variant) => ({
        id: variant.id,
        productId: variant.productId,
        productName: variant.product.name,
        sku: variant.sku,
        finish: variant.finishName,
        stock: variant.inventory,
        inStock: variant.inStock,
        alert:
          variant.inventory <= 0
            ? ("Out of stock" as const)
            : variant.inventory <= 8
              ? ("Low stock" as const)
              : ("OK" as const),
      })),
      lowStockCount: low.filter((item) => item.inventory > 0).length,
      outOfStockCount: low.filter((item) => item.inventory <= 0).length,
    };
  } catch {
    return { ok: false as const, error: "Database unavailable", rows: [] };
  }
}

export async function listAdminReviewsAction() {
  const gate = await assertAdminAction();
  if (!gate.ok) return { ok: false as const, error: gate.error, reviews: [] };

  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      include: { product: { select: { name: true, slug: true } } },
      take: 200,
    });
    return {
      ok: true as const,
      reviews: reviews.map((review) => ({
        id: review.id,
        productId: review.productId,
        productName: review.product.name,
        author: review.author,
        rating: review.rating,
        title: review.title,
        body: review.body,
        status: review.status.toLowerCase() as
          | "pending"
          | "approved"
          | "rejected",
        featured: review.featured,
        createdAt: review.createdAt.toISOString(),
      })),
    };
  } catch {
    return { ok: false as const, error: "Database unavailable", reviews: [] };
  }
}

export async function setReviewStatusAction(
  id: string,
  status: "pending" | "approved" | "rejected",
) {
  const gate = await assertAdminAction();
  if (!gate.ok) return { ok: false as const, error: gate.error };

  const mapped = status.toUpperCase() as ReviewStatus;
  const review = await prisma.review.update({
    where: { id },
    data: {
      status: mapped,
      published: mapped === "APPROVED",
      verified: mapped === "APPROVED",
    },
    include: { product: { select: { slug: true } } },
  });
  revalidatePath("/admin/reviews");
  revalidatePath("/shop");
  if (review.product?.slug) {
    revalidatePath(`/products/${review.product.slug}`);
  }
  return { ok: true as const };
}

export async function toggleReviewFeaturedAction(id: string) {
  const gate = await assertAdminAction();
  if (!gate.ok) return { ok: false as const, error: gate.error };

  const current = await prisma.review.findUnique({ where: { id } });
  if (!current) return { ok: false as const, error: "Not found" };

  await prisma.review.update({
    where: { id },
    data: { featured: !current.featured },
  });
  revalidatePath("/admin/reviews");
  revalidatePath("/shop");
  const product = await prisma.product.findUnique({
    where: { id: current.productId },
    select: { slug: true },
  });
  if (product?.slug) {
    revalidatePath(`/products/${product.slug}`);
  }
  return { ok: true as const, featured: !current.featured };
}

export async function listAdminCouponsAction() {
  const gate = await assertAdminAction();
  if (!gate.ok) return { ok: false as const, error: gate.error, discounts: [] };

  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });
    return {
      ok: true as const,
      discounts: coupons.map((coupon) => ({
        id: coupon.id,
        code: coupon.code,
        type: coupon.type,
        value: Number(coupon.value),
        active: coupon.active,
        startsAt: coupon.startsAt?.toISOString().slice(0, 10) ?? "",
        endsAt: coupon.endsAt?.toISOString().slice(0, 10) ?? "",
        minSubtotal: coupon.minSubtotal
          ? Number(coupon.minSubtotal)
          : undefined,
        usageLimit: coupon.usageLimit ?? undefined,
        usedCount: coupon.usedCount,
      })),
    };
  } catch {
    return { ok: false as const, error: "Database unavailable", discounts: [] };
  }
}

const couponSchema = z.object({
  id: z.string().optional(),
  code: z.string().min(2).max(40),
  type: z.enum(["PERCENT", "FIXED"]),
  value: z.number().positive(),
  active: z.boolean(),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
  minSubtotal: z.number().nonnegative().optional(),
  usageLimit: z.number().int().positive().optional(),
});

export async function upsertCouponAction(
  input: z.infer<typeof couponSchema>,
) {
  const gate = await assertAdminAction();
  if (!gate.ok) return { ok: false as const, error: gate.error };

  const parsed = couponSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: "Invalid coupon" };
  }

  const data = parsed.data;
  const startsAt = data.startsAt ? new Date(data.startsAt) : null;
  const endsAt = data.endsAt ? new Date(data.endsAt) : null;

  if (data.id) {
    await prisma.coupon.update({
      where: { id: data.id },
      data: {
        code: data.code.toUpperCase(),
        type: data.type as DiscountType,
        value: data.value,
        active: data.active,
        startsAt,
        endsAt,
        minSubtotal: data.minSubtotal,
        usageLimit: data.usageLimit,
      },
    });
  } else {
    await prisma.coupon.create({
      data: {
        code: data.code.toUpperCase(),
        type: data.type as DiscountType,
        value: data.value,
        active: data.active,
        startsAt,
        endsAt,
        minSubtotal: data.minSubtotal,
        usageLimit: data.usageLimit,
      },
    });
  }

  revalidatePath("/admin/discounts");
  return { ok: true as const };
}

export async function toggleCouponAction(id: string) {
  const gate = await assertAdminAction();
  if (!gate.ok) return { ok: false as const, error: gate.error };

  const coupon = await prisma.coupon.findUnique({ where: { id } });
  if (!coupon) return { ok: false as const, error: "Not found" };

  await prisma.coupon.update({
    where: { id },
    data: { active: !coupon.active },
  });
  revalidatePath("/admin/discounts");
  return { ok: true as const };
}

export async function deleteCouponAction(id: string) {
  const gate = await assertAdminAction();
  if (!gate.ok) return { ok: false as const, error: gate.error };

  await prisma.coupon.delete({ where: { id } });
  revalidatePath("/admin/discounts");
  return { ok: true as const };
}

/** Validate a coupon without consuming usage. */
export async function validateCouponAction(code: string, subtotal: number) {
  try {
    const { readValidCoupon } = await import("@/lib/coupons");
    const result = await readValidCoupon(code, subtotal);
    if (!result.ok) return result;
    return {
      ok: true as const,
      type: result.type,
      value: result.value,
      code: result.code,
    };
  } catch {
    return { ok: false as const, error: "Unable to validate coupon" };
  }
}

/** Atomically consume one coupon use after payment authorization. */
export async function redeemCouponAction(code: string, subtotal: number) {
  try {
    const { redeemCoupon } = await import("@/lib/coupons");
    return await redeemCoupon(code, subtotal);
  } catch {
    return { ok: false as const, error: "Unable to apply coupon" };
  }
}
