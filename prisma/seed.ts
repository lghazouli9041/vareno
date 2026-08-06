import { PrismaClient, type ProductStatus } from "@prisma/client";
import { catalogCollections } from "../src/constants/catalog-collections";
import { catalogProducts } from "../src/constants/catalog-products";
import { collectionCoverBySlug } from "../src/lib/catalog/featured-collections-fallback";

const prisma = new PrismaClient();

async function main() {
  const kitchen = await prisma.category.upsert({
    where: { slug: "kitchen" },
    create: {
      id: "cat-kitchen",
      slug: "kitchen",
      name: "Kitchen",
      description: "Architectural kitchen faucets",
    },
    update: { name: "Kitchen" },
  });

  const bathroom = await prisma.category.upsert({
    where: { slug: "bathroom" },
    create: {
      id: "cat-bathroom",
      slug: "bathroom",
      name: "Bathroom",
      description: "Architectural bathroom faucets",
    },
    update: { name: "Bathroom" },
  });

  for (const collection of catalogCollections) {
    await prisma.collection.upsert({
      where: { slug: collection.slug },
      create: {
        id: collection.id,
        slug: collection.slug,
        name: collection.name,
        tagline: collection.tagline,
        description: collection.description,
        coverImage: collectionCoverBySlug[collection.slug] ?? null,
        featured: true,
      },
      update: {
        name: collection.name,
        tagline: collection.tagline,
        description: collection.description,
        coverImage: collectionCoverBySlug[collection.slug] ?? undefined,
        featured: true,
      },
    });
  }

  for (const product of catalogProducts) {
    const categoryId =
      product.category === "kitchen" ? kitchen.id : bathroom.id;
    const collection = await prisma.collection.findUnique({
      where: { slug: product.collection },
    });

    await prisma.product.upsert({
      where: { slug: product.slug },
      create: {
        id: product.id,
        slug: product.slug,
        name: product.name,
        tagline: product.shortDescription,
        description: product.marketingDescription,
        status: "ACTIVE" satisfies ProductStatus,
        featured: true,
        bestSeller: ["heritage", "signature", "imperial"].includes(
          product.collection,
        ),
        newArrival: product.collection === "element",
        material: product.material,
        basePrice: product.price,
        categoryId,
        collectionId: collection?.id,
        features: [],
        specifications: {
          height: product.dimensions.height,
          spoutReach: product.dimensions.spoutReach,
          spoutHeight: product.dimensions.spoutHeight,
          maxDeckThickness: product.dimensions.maxDeckThickness,
          warranty: product.warranty,
          seoTitle: product.seoTitle,
          seoDescription: product.seoDescription,
          availability: product.availability,
        },
        images: {
          create: [
            {
              url: product.featuredImage,
              alt: product.name,
              isPrimary: true,
              sortOrder: 0,
            },
            ...product.gallery.map((url, index) => ({
              url,
              alt: `${product.name} ${index + 1}`,
              isPrimary: false,
              sortOrder: index + 1,
            })),
          ],
        },
        variants: {
          create: product.finishOptions.map((finish) => ({
            id: finish.id,
            sku: finish.sku,
            finishSlug: finish.slug,
            finishName: finish.name,
            price: finish.price,
            inventory: finish.available
              ? product.availability === "out_of_stock"
                ? 0
                : product.availability === "made_to_order"
                  ? 8
                  : 24
              : 0,
            inStock: finish.available && product.availability !== "out_of_stock",
          })),
        },
      },
      update: {
        name: product.name,
        tagline: product.shortDescription,
        description: product.marketingDescription,
        status: "ACTIVE",
        featured: true,
        bestSeller: ["heritage", "signature", "imperial"].includes(
          product.collection,
        ),
        newArrival: product.collection === "element",
        material: product.material,
        basePrice: product.price,
        categoryId,
        collectionId: collection?.id,
        specifications: {
          height: product.dimensions.height,
          spoutReach: product.dimensions.spoutReach,
          spoutHeight: product.dimensions.spoutHeight,
          maxDeckThickness: product.dimensions.maxDeckThickness,
          warranty: product.warranty,
          seoTitle: product.seoTitle,
          seoDescription: product.seoDescription,
          availability: product.availability,
        },
      },
    });

    // Ensure variants exist (create missing)
    for (const finish of product.finishOptions) {
      await prisma.variant.upsert({
        where: { sku: finish.sku },
        create: {
          id: finish.id,
          productId: product.id,
          sku: finish.sku,
          finishSlug: finish.slug,
          finishName: finish.name,
          price: finish.price,
          inventory: finish.available ? 24 : 0,
          inStock: finish.available,
        },
        update: {
          finishName: finish.name,
          price: finish.price,
          inStock: finish.available,
        },
      });
    }
  }

  // Seed demo coupons if empty
  const couponCount = await prisma.coupon.count();
  if (couponCount === 0) {
    await prisma.coupon.createMany({
      data: [
        {
          code: "VARENO10",
          type: "PERCENT",
          value: 10,
          minSubtotal: 500,
          active: true,
          startsAt: new Date("2026-01-01"),
          endsAt: new Date("2026-12-31"),
          usageLimit: 1000,
          usedCount: 0,
        },
        {
          code: "ATELIER100",
          type: "FIXED",
          value: 100,
          active: false,
          startsAt: new Date("2026-03-01"),
          endsAt: new Date("2026-03-31"),
          usageLimit: 100,
          usedCount: 0,
        },
      ],
    });
  }

  // Seed demo reviews if empty
  const reviewCount = await prisma.review.count();
  if (reviewCount === 0) {
    const first = await prisma.product.findFirst({ orderBy: { createdAt: "asc" } });
    const second =
      (await prisma.product.findFirst({
        where: first ? { id: { not: first.id } } : undefined,
        orderBy: { createdAt: "asc" },
      })) ?? first;

    if (first) {
      await prisma.review.createMany({
        data: [
          {
            productId: first.id,
            author: "Elena M.",
            rating: 5,
            title: "Exceptional presence",
            body: "The finish quality and proportions elevate our primary bath.",
            verified: true,
            published: true,
            featured: true,
            status: "APPROVED",
          },
          {
            productId: (second ?? first).id,
            author: "James R.",
            rating: 4,
            title: "Quiet luxury",
            body: "Installation was precise. Looking forward to specifying again.",
            verified: true,
            published: false,
            featured: false,
            status: "PENDING",
          },
        ],
      });
    }
  }

  console.log(
    `Seeded ${catalogCollections.length} collections and ${catalogProducts.length} products.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
