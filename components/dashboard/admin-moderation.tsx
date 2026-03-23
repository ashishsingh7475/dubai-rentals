"use client";

import { useTransition } from "react";
import {
  moderateReport,
  moderateReview,
  setOwnerBlocked,
  verifyListing,
} from "@/app/actions/trust";

type AdminModerationProps = {
  data: {
    reports: Array<{
      id: string;
      reason: string;
      details?: string | null;
      status: string;
      listing_id: string;
      listings?: { id: string; title: string; user_id: string; status: string };
    }>;
    pendingReviews: Array<{
      id: string;
      rating: number;
      review_text: string;
      owner_user_id: string;
      listing_id: string;
      listings?: { id: string; title: string };
    }>;
    flaggedListings: Array<{
      id: string;
      title: string;
      user_id: string;
      status: string;
      reported_count: number;
      verified_listing: boolean;
    }>;
    blockedUsers: Array<{ user_id: string; reason?: string | null }>;
  };
};

export function AdminModeration({ data }: AdminModerationProps) {
  const [isPending, startTransition] = useTransition();
  const blocked = new Set(data.blockedUsers.map((u) => u.user_id));

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-semibold">Flagged listings</h2>
        <div className="mt-4 space-y-3">
          {data.flaggedListings.map((listing) => (
            <div key={listing.id} className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
              <p className="font-medium">{listing.title}</p>
              <p className="text-xs text-zinc-500">
                reports: {listing.reported_count} · status: {listing.status}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  disabled={isPending}
                  onClick={() =>
                    startTransition(() => void verifyListing({ listingId: listing.id, verified: !listing.verified_listing }))
                  }
                  className="rounded-lg border px-3 py-1.5 text-xs"
                >
                  {listing.verified_listing ? "Remove verification" : "Verify listing"}
                </button>
                <button
                  disabled={isPending}
                  onClick={() =>
                    startTransition(() =>
                      void setOwnerBlocked({
                        userId: listing.user_id,
                        blocked: !blocked.has(listing.user_id),
                        reason: "Fraud prevention action",
                      })
                    )
                  }
                  className="rounded-lg border px-3 py-1.5 text-xs"
                >
                  {blocked.has(listing.user_id) ? "Unblock owner" : "Block owner"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-semibold">Listing reports</h2>
        <div className="mt-4 space-y-3">
          {data.reports.map((report) => (
            <div key={report.id} className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
              <p className="font-medium">{report.listings?.title ?? "Unknown listing"}</p>
              <p className="text-sm">{report.reason}</p>
              {report.details && <p className="text-xs text-zinc-500">{report.details}</p>}
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  className="rounded-lg border px-3 py-1.5 text-xs"
                  onClick={() =>
                    startTransition(() =>
                      void moderateReport({
                        reportId: report.id,
                        status: "investigating",
                        listingStatus: "flagged",
                      })
                    )
                  }
                >
                  Investigate
                </button>
                <button
                  className="rounded-lg border px-3 py-1.5 text-xs"
                  onClick={() =>
                    startTransition(() =>
                      void moderateReport({
                        reportId: report.id,
                        status: "resolved",
                        listingStatus: "active",
                      })
                    )
                  }
                >
                  Resolve
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-semibold">Pending reviews</h2>
        <div className="mt-4 space-y-3">
          {data.pendingReviews.map((review) => (
            <div key={review.id} className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
              <p className="font-medium">
                {review.listings?.title ?? "Listing"} · {review.rating}★
              </p>
              <p className="text-sm">{review.review_text}</p>
              <div className="mt-2 flex gap-2">
                <button
                  className="rounded-lg border px-3 py-1.5 text-xs"
                  onClick={() => startTransition(() => void moderateReview({ reviewId: review.id, status: "approved" }))}
                >
                  Approve
                </button>
                <button
                  className="rounded-lg border px-3 py-1.5 text-xs"
                  onClick={() => startTransition(() => void moderateReview({ reviewId: review.id, status: "rejected" }))}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
