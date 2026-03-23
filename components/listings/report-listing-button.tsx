"use client";

import { useState, useTransition } from "react";
import { reportListing } from "@/app/actions/trust";

export function ReportListingButton({ listingId }: { listingId: string }) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-sm font-medium text-red-600 hover:underline"
      >
        Report this listing
      </button>
      {open && (
        <div className="mt-3 space-y-3">
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason (e.g. fake photos)"
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
          />
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={3}
            placeholder="Additional details (optional)"
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          {message && <p className="text-xs text-emerald-600">{message}</p>}
          <button
            type="button"
            onClick={() =>
              startTransition(async () => {
                setError(null);
                setMessage(null);
                const result = await reportListing({ listingId, reason, details });
                if (result.error) {
                  setError(result.error);
                } else {
                  setReason("");
                  setDetails("");
                  setMessage("Thanks. The report has been sent to moderation.");
                }
              })
            }
            disabled={isPending}
            className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-70"
          >
            {isPending ? "Submitting..." : "Submit report"}
          </button>
        </div>
      )}
    </div>
  );
}
