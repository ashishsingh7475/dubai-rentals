"use client";

import { useState, useTransition } from "react";
import type { ListingReview } from "@/types/database";
import { createListingReview } from "@/app/actions/trust";

type ReviewSectionProps = {
  listingId: string;
  ownerUserId: string;
  reviews: ListingReview[];
  canReview: boolean;
};

export function ReviewSection({
  listingId,
  ownerUserId,
  reviews,
  canReview,
}: ReviewSectionProps) {
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const approved = reviews.filter((r) => r.status === "approved");
  const avg =
    approved.length > 0
      ? approved.reduce((acc, r) => acc + r.rating, 0) / approved.length
      : 0;

  const handleSubmit = () => {
    setError(null);
    setMessage(null);
    startTransition(async () => {
      const result = await createListingReview({
        listingId,
        ownerUserId,
        rating,
        reviewText,
      });
      if (result.error) {
        setError(result.error);
        return;
      }
      setReviewText("");
      setMessage("Review submitted for moderation.");
    });
  };

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Reviews & ratings</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {approved.length > 0 ? `${avg.toFixed(1)} ★ (${approved.length})` : "No reviews yet"}
        </p>
      </div>

      {canReview && (
        <div className="mt-4 space-y-3 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <label className="text-sm text-zinc-600 dark:text-zinc-400">Your rating</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="rounded-lg border border-zinc-300 bg-white px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            >
              {[5, 4, 3, 2, 1].map((v) => (
                <option key={v} value={v}>
                  {v} star{v > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows={3}
            placeholder="Share your experience with this listing..."
            className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          {message && <p className="text-sm text-emerald-600">{message}</p>}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900"
          >
            {isPending ? "Submitting..." : "Submit review"}
          </button>
        </div>
      )}

      <div className="mt-5 space-y-3">
        {approved.length === 0 ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Be the first to leave a trusted review.
          </p>
        ) : (
          approved.map((review) => (
            <article
              key={review.id}
              className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(Math.max(0, 5 - review.rating))}
                </p>
                <p className="text-xs text-zinc-500">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
              <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">{review.review_text}</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
