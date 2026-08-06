import type { Prisma } from "@prisma/client";

type InventoryTx = Prisma.TransactionClient;

export type InventoryLine = {
  productId: string;
  productName: string;
  finish: string;
  quantity: number;
};

async function resolveVariant(tx: InventoryTx, line: InventoryLine) {
  const byId = await tx.variant.findFirst({
    where: {
      OR: [{ id: line.productId }, { sku: line.productId }],
    },
  });
  if (byId) return byId;

  const byProductFinish = await tx.variant.findFirst({
    where: {
      productId: line.productId,
      OR: [
        { finishName: { equals: line.finish, mode: "insensitive" } },
        { finishSlug: { equals: line.finish, mode: "insensitive" } },
      ],
    },
  });
  if (byProductFinish) return byProductFinish;

  return tx.variant.findFirst({
    where: {
      product: {
        OR: [{ id: line.productId }, { slug: line.productId }],
      },
      OR: [
        { finishName: { equals: line.finish, mode: "insensitive" } },
        { finishSlug: { equals: line.finish, mode: "insensitive" } },
      ],
    },
  });
}

/**
 * Transactionally decrement variant stock. Throws if a tracked SKU would oversell.
 * Lines with no matching Variant are skipped (legacy/static-only products).
 */
export async function decrementInventoryForLines(
  tx: InventoryTx,
  lines: InventoryLine[],
): Promise<{ decremented: number; skipped: number }> {
  let decremented = 0;
  let skipped = 0;

  for (const line of lines) {
    const variant = await resolveVariant(tx, line);
    if (!variant) {
      skipped += 1;
      continue;
    }

    const updated = await tx.variant.updateMany({
      where: {
        id: variant.id,
        inventory: { gte: line.quantity },
      },
      data: {
        inventory: { decrement: line.quantity },
      },
    });

    if (updated.count === 0) {
      throw new Error(
        `Insufficient inventory for ${line.productName} (${line.finish})`,
      );
    }

    const after = await tx.variant.findUnique({ where: { id: variant.id } });
    if (after && after.inventory <= 0) {
      await tx.variant.update({
        where: { id: variant.id },
        data: { inventory: 0, inStock: false },
      });
    }

    decremented += 1;
  }

  return { decremented, skipped };
}

/** Pre-checkout stock validation (non-transactional read). */
export async function assertInventoryAvailable(
  lines: InventoryLine[],
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { prisma } = await import("@/lib/prisma");

  for (const line of lines) {
    const variant = await resolveVariant(prisma, line);
    if (!variant) continue;
    if (!variant.inStock || variant.inventory < line.quantity) {
      return {
        ok: false,
        error: `${line.productName} is out of stock or has insufficient inventory.`,
      };
    }
  }

  return { ok: true };
}

export async function getLowStockVariants(threshold = 8) {
  const { prisma } = await import("@/lib/prisma");
  try {
    return await prisma.variant.findMany({
      where: {
        OR: [{ inventory: { lte: threshold, gt: 0 } }, { inventory: 0 }],
      },
      include: {
        product: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { inventory: "asc" },
      take: 200,
    });
  } catch {
    return [];
  }
}
