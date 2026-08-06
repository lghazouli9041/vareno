"use client";

import { memo, useEffect, useState, useTransition } from "react";
import { AdminPageHeader } from "@/components/admin/AdminUi";
import {
  listAdminReviewsAction,
  setReviewStatusAction,
  toggleReviewFeaturedAction,
} from "@/features/admin/actions";

type ReviewRow = {
  id: string;
  productId: string;
  productName: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  status: "pending" | "approved" | "rejected";
  featured: boolean;
  createdAt: string;
};

function ReviewsBoardComponent() {
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const reload = () => {
    startTransition(async () => {
      const result = await listAdminReviewsAction();
      if (!result.ok) {
        setError(result.error ?? "Unable to load reviews");
        setReviews([]);
        return;
      }
      setError(null);
      setReviews(result.reviews);
    });
  };

  useEffect(() => {
    reload();
  }, []);

  return (
    <div>
      <AdminPageHeader
        title="Reviews"
        description="Moderate customer feedback before it appears on product pages."
      />
      {error && (
        <p className="mb-4 text-sm text-muted" role="status">
          {error}
        </p>
      )}
      {pending && reviews.length === 0 && (
        <p className="text-sm text-muted">Loading reviews…</p>
      )}
      <ul className="space-y-4">
        {reviews.map((review) => (
          <li key={review.id} className="border border-border p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-accent">
                  {review.productName}
                </p>
                <h2 className="mt-1 font-display text-2xl">{review.title}</h2>
                <p className="mt-1 text-sm text-muted">
                  {review.author} · {review.rating}/5 · {review.status}
                  {review.featured ? " · Featured" : ""}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="border border-border px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] hover:border-accent"
                  onClick={() => {
                    void setReviewStatusAction(review.id, "approved").then(reload);
                  }}
                >
                  Approve
                </button>
                <button
                  type="button"
                  className="border border-border px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] hover:border-error"
                  onClick={() => {
                    void setReviewStatusAction(review.id, "rejected").then(reload);
                  }}
                >
                  Reject
                </button>
                <button
                  type="button"
                  className="border border-border px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] hover:border-accent"
                  onClick={() => {
                    void toggleReviewFeaturedAction(review.id).then(reload);
                  }}
                >
                  {review.featured ? "Unfeature" : "Feature"}
                </button>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {review.body}
            </p>
          </li>
        ))}
        {!pending && reviews.length === 0 && !error && (
          <li className="border border-border px-5 py-10 text-center text-sm text-muted">
            No reviews in the database yet.
          </li>
        )}
      </ul>
    </div>
  );
}

export const ReviewsBoard = memo(ReviewsBoardComponent);
