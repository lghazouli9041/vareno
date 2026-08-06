"use client";

import { Star } from "lucide-react";
import type { CatalogProduct } from "@/types/catalog";
import type { StorefrontReview } from "@/lib/reviews";

interface ProductReviewsProps {
  product: CatalogProduct;
  reviews?: StorefrontReview[];
}

export function ProductReviews({
  product,
  reviews = [],
}: ProductReviewsProps) {
  const average =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  return (
    <section
      className="border-t border-border py-16 md:py-20"
      aria-labelledby="reviews-heading"
    >
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 text-[11px] uppercase tracking-[0.24em] text-accent">
            Social Proof
          </p>
          <h2
            id="reviews-heading"
            className="font-display text-3xl text-primary md:text-4xl"
          >
            Customer Reviews
          </h2>
        </div>
        {reviews.length > 0 && (
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-1 text-accent"
              aria-label={`Rated ${average.toFixed(1)} out of 5`}
            >
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  size={16}
                  strokeWidth={0}
                  className="fill-accent"
                  aria-hidden="true"
                />
              ))}
            </div>
            <p className="text-sm text-muted">
              <span className="font-medium text-primary">
                {average.toFixed(1)}
              </span>{" "}
              · {reviews.length} verified purchases
            </p>
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <p className="text-sm text-muted">
          Reviews for {product.name} will appear here once approved.
        </p>
      ) : (
        <ul className="grid gap-6 md:grid-cols-3">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="rounded-2xl border border-border/80 bg-background p-6 shadow-sm"
            >
              <div
                className="mb-3 flex gap-1 text-accent"
                aria-label={`${review.rating} out of 5 stars`}
              >
                {Array.from({ length: review.rating }).map((_, index) => (
                  <Star
                    key={index}
                    size={12}
                    strokeWidth={0}
                    className="fill-accent"
                    aria-hidden="true"
                  />
                ))}
              </div>
              <h3 className="font-display text-xl text-primary">
                {review.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {review.body}
              </p>
              <p className="mt-5 text-[11px] uppercase tracking-[0.16em] text-primary">
                {review.author}
                {review.verified && (
                  <span className="text-accent"> · Verified purchase</span>
                )}
              </p>
              <p className="mt-1 text-xs text-muted">{review.date}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
