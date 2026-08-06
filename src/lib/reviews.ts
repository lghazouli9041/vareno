import { prisma } from "@/lib/prisma";

export type StorefrontReview = {
  id: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  verified: boolean;
  featured: boolean;
  date: string;
};

export async function getApprovedReviewsForProduct(
  productId: string,
): Promise<StorefrontReview[]> {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        productId,
        status: "APPROVED",
        published: true,
      },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      take: 24,
    });

    return reviews.map((review) => ({
      id: review.id,
      author: review.author,
      rating: review.rating,
      title: review.title,
      body: review.body,
      verified: review.verified,
      featured: review.featured,
      date: review.createdAt.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
    }));
  } catch {
    return [];
  }
}
