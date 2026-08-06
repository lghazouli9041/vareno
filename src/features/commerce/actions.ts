"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { assertAdminAction } from "@/lib/auth/admin";
import {
  getPrimaryEmail,
  requireUser,
  syncCustomerFromClerk,
  syncUserFromClerk,
} from "@/lib/auth/session";
import { uploadImageBuffer, deleteCloudinaryImage } from "@/lib/cloudinary";

export async function uploadProductImageAction(formData: FormData) {
  const gate = await assertAdminAction();
  if (!gate.ok) return { ok: false as const, error: gate.error };

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { ok: false as const, error: "No file provided" };
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  try {
    const uploaded = await uploadImageBuffer({
      buffer: bytes,
      folder: "vareno/products",
    });
    return { ok: true as const, ...uploaded };
  } catch (error) {
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

export async function deleteProductImageAction(publicId: string) {
  const gate = await assertAdminAction();
  if (!gate.ok) return { ok: false as const, error: gate.error };

  try {
    await deleteCloudinaryImage(publicId);
    return { ok: true as const };
  } catch (error) {
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : "Delete failed",
    };
  }
}

export async function syncWishlistToDatabaseAction(
  entries: Array<{ productId: string; slug: string }>,
) {
  const clerkUser = await requireUser();
  const user = await syncUserFromClerk(clerkUser);
  if (!user) return { ok: false as const, error: "User sync failed" };

  const productIds = (
    await prisma.product.findMany({
      where: {
        OR: [
          { id: { in: entries.map((e) => e.productId) } },
          { slug: { in: entries.map((e) => e.slug) } },
        ],
      },
      select: { id: true },
    })
  ).map((p) => p.id);

  await prisma.$transaction([
    prisma.wishlistItem.deleteMany({ where: { userId: user.id } }),
    ...(productIds.length
      ? [
          prisma.wishlistItem.createMany({
            data: productIds.map((productId) => ({
              userId: user.id,
              productId,
            })),
            skipDuplicates: true,
          }),
        ]
      : []),
  ]);

  return { ok: true as const, count: productIds.length };
}

export async function pullWishlistFromDatabaseAction() {
  const clerkUser = await requireUser();
  const user = await syncUserFromClerk(clerkUser);
  if (!user) return { ok: false as const, items: [] as Array<{ productId: string; slug: string }> };

  const items = await prisma.wishlistItem.findMany({
    where: { userId: user.id },
    include: { product: { select: { id: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  });

  return {
    ok: true as const,
    items: items.map((item) => ({
      productId: item.product.id,
      slug: item.product.slug,
    })),
  };
}

export async function toggleWishlistDatabaseAction(input: {
  productId: string;
  slug: string;
}) {
  const clerkUser = await requireUser();
  const user = await syncUserFromClerk(clerkUser);
  if (!user) return { ok: false as const, error: "User sync failed" };

  const product =
    (await prisma.product.findUnique({ where: { id: input.productId } })) ??
    (await prisma.product.findUnique({ where: { slug: input.slug } }));

  if (!product) {
    return { ok: false as const, error: "Product not in database yet" };
  }

  const existing = await prisma.wishlistItem.findUnique({
    where: {
      userId_productId: { userId: user.id, productId: product.id },
    },
  });

  if (existing) {
    await prisma.wishlistItem.delete({ where: { id: existing.id } });
    return { ok: true as const, wishlisted: false };
  }

  await prisma.wishlistItem.create({
    data: { userId: user.id, productId: product.id },
  });
  return { ok: true as const, wishlisted: true };
}

export async function trackRecentlyViewedAction(productIdOrSlug: string) {
  const session = await auth();
  if (!session.userId) return { ok: false as const, skipped: true };

  const clerkUser = await currentUser();
  if (!clerkUser) return { ok: false as const, skipped: true };

  const customer = await syncCustomerFromClerk(clerkUser);
  if (!customer) return { ok: false as const, skipped: true };

  const product =
    (await prisma.product.findUnique({ where: { slug: productIdOrSlug } })) ??
    (await prisma.product.findUnique({ where: { id: productIdOrSlug } }));

  if (!product) return { ok: false as const, error: "Product not found" };

  await prisma.recentlyViewedItem.upsert({
    where: {
      customerId_productId: {
        customerId: customer.id,
        productId: product.id,
      },
    },
    create: {
      customerId: customer.id,
      productId: product.id,
    },
    update: { viewedAt: new Date() },
  });

  // Keep last 12
  const extras = await prisma.recentlyViewedItem.findMany({
    where: { customerId: customer.id },
    orderBy: { viewedAt: "desc" },
    skip: 12,
    select: { id: true },
  });
  if (extras.length) {
    await prisma.recentlyViewedItem.deleteMany({
      where: { id: { in: extras.map((item) => item.id) } },
    });
  }

  return { ok: true as const };
}

export async function getRecentlyViewedFromDatabaseAction() {
  const session = await auth();
  if (!session.userId) return { ok: false as const, slugs: [] as string[] };

  const clerkUser = await currentUser();
  if (!clerkUser) return { ok: false as const, slugs: [] as string[] };

  const email = getPrimaryEmail(clerkUser);
  if (!email) return { ok: false as const, slugs: [] as string[] };

  const customer = await prisma.customer.findUnique({ where: { email } });
  if (!customer) return { ok: false as const, slugs: [] as string[] };

  const items = await prisma.recentlyViewedItem.findMany({
    where: { customerId: customer.id },
    include: { product: { select: { slug: true } } },
    orderBy: { viewedAt: "desc" },
    take: 12,
  });

  return { ok: true as const, slugs: items.map((item) => item.product.slug) };
}

export async function upsertAdminProductAction(input: {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  marketingDescription: string;
  category: "kitchen" | "bathroom";
  collection: string;
  price: number;
  material: string;
  warranty: string;
  featuredImage: string;
  status: "active" | "draft" | "archived";
  stock: number;
  sku: string;
  seoTitle: string;
  seoDescription: string;
  finishOptions: Array<{
    id: string;
    name: string;
    slug: string;
    sku: string;
    price: number;
    available: boolean;
  }>;
  dimensions: {
    height: string;
    spoutReach: string;
    spoutHeight?: string;
    maxDeckThickness?: string;
  };
}) {
  const gate = await assertAdminAction();
  if (!gate.ok) return { ok: false as const, error: gate.error };

  const category = await prisma.category.upsert({
    where: { slug: input.category },
    create: {
      slug: input.category,
      name: input.category === "kitchen" ? "Kitchen" : "Bathroom",
    },
    update: {},
  });

  const collection = await prisma.collection.upsert({
    where: { slug: input.collection },
    create: {
      slug: input.collection,
      name: `${input.collection} Collection`,
      tagline: "",
      description: "",
    },
    update: {},
  });

  const statusMap = {
    active: "ACTIVE",
    draft: "DRAFT",
    archived: "ARCHIVED",
  } as const;

  await prisma.product.upsert({
    where: { id: input.id },
    create: {
      id: input.id,
      slug: input.slug,
      name: input.name,
      tagline: input.shortDescription,
      description: input.marketingDescription,
      status: statusMap[input.status],
      material: input.material,
      basePrice: input.price,
      categoryId: category.id,
      collectionId: collection.id,
      specifications: {
        ...input.dimensions,
        warranty: input.warranty,
        seoTitle: input.seoTitle,
        seoDescription: input.seoDescription,
      },
      images: {
        create: [
          {
            url: input.featuredImage,
            alt: input.name,
            isPrimary: true,
            sortOrder: 0,
          },
        ],
      },
      variants: {
        create: input.finishOptions.map((finish) => ({
          id: finish.id,
          sku: finish.sku,
          finishSlug: finish.slug,
          finishName: finish.name,
          price: finish.price,
          inventory: input.stock,
          inStock: finish.available && input.stock > 0,
        })),
      },
    },
    update: {
      slug: input.slug,
      name: input.name,
      tagline: input.shortDescription,
      description: input.marketingDescription,
      status: statusMap[input.status],
      material: input.material,
      basePrice: input.price,
      categoryId: category.id,
      collectionId: collection.id,
      specifications: {
        ...input.dimensions,
        warranty: input.warranty,
        seoTitle: input.seoTitle,
        seoDescription: input.seoDescription,
      },
    },
  });

  for (const finish of input.finishOptions) {
    await prisma.variant.upsert({
      where: { sku: finish.sku },
      create: {
        id: finish.id,
        productId: input.id,
        sku: finish.sku,
        finishSlug: finish.slug,
        finishName: finish.name,
        price: finish.price,
        inventory: input.stock,
        inStock: finish.available && input.stock > 0,
      },
      update: {
        finishName: finish.name,
        price: finish.price,
        inventory: input.stock,
        inStock: finish.available && input.stock > 0,
      },
    });
  }

  // Update primary image URL if product exists
  const primary = await prisma.productImage.findFirst({
    where: { productId: input.id, isPrimary: true },
  });
  if (primary) {
    await prisma.productImage.update({
      where: { id: primary.id },
      data: { url: input.featuredImage, alt: input.name },
    });
  } else {
    await prisma.productImage.create({
      data: {
        productId: input.id,
        url: input.featuredImage,
        alt: input.name,
        isPrimary: true,
        sortOrder: 0,
      },
    });
  }

  revalidatePath("/shop");
  revalidatePath("/admin/products");
  revalidatePath(`/products/${input.slug}`);
  revalidatePath("/");
  return { ok: true as const };
}

export async function deleteAdminProductAction(productId: string) {
  const gate = await assertAdminAction();
  if (!gate.ok) return { ok: false as const, error: gate.error };

  const existing = await prisma.product
    .findUnique({ where: { id: productId }, select: { slug: true } })
    .catch(() => null);

  await prisma.product.delete({ where: { id: productId } }).catch(() => null);
  revalidatePath("/shop");
  revalidatePath("/admin/products");
  revalidatePath("/");
  if (existing?.slug) {
    revalidatePath(`/products/${existing.slug}`);
  }
  return { ok: true as const };
}

export async function upsertAddressAction(input: {
  id?: string;
  firstName: string;
  lastName: string;
  company?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}) {
  const clerkUser = await requireUser();
  const customer = await syncCustomerFromClerk(clerkUser);
  if (!customer) return { ok: false as const, error: "Customer sync failed" };

  if (input.isDefault) {
    await prisma.address.updateMany({
      where: { customerId: customer.id },
      data: { isDefault: false },
    });
  }

  if (input.id) {
    const updated = await prisma.address.updateMany({
      where: { id: input.id, customerId: customer.id },
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        company: input.company,
        line1: input.line1,
        line2: input.line2,
        city: input.city,
        state: input.state,
        postalCode: input.postalCode,
        country: input.country,
        phone: input.phone,
        isDefault: Boolean(input.isDefault),
      },
    });
    if (!updated.count) {
      return { ok: false as const, error: "Address not found" };
    }
    revalidatePath("/account/addresses");
    return { ok: true as const, id: input.id };
  }

  const created = await prisma.address.create({
    data: {
      customerId: customer.id,
      firstName: input.firstName,
      lastName: input.lastName,
      company: input.company,
      line1: input.line1,
      line2: input.line2,
      city: input.city,
      state: input.state,
      postalCode: input.postalCode,
      country: input.country,
      phone: input.phone,
      isDefault: Boolean(input.isDefault),
    },
  });

  revalidatePath("/account/addresses");
  return { ok: true as const, id: created.id };
}

export async function deleteAddressAction(addressId: string) {
  const clerkUser = await requireUser();
  const customer = await syncCustomerFromClerk(clerkUser);
  if (!customer) return { ok: false as const };

  await prisma.address.deleteMany({
    where: { id: addressId, customerId: customer.id },
  });
  revalidatePath("/account/addresses");
  return { ok: true as const };
}
