"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { LeadWithListing } from "@/app/actions/leads";

type LeadsContentProps = {
  leads: LeadWithListing[];
  currentSort: "newest" | "oldest" | "listing";
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function LeadsContent({ leads, currentSort }: LeadsContentProps) {
  const router = useRouter();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value;
    router.push(`/dashboard/leads${v && v !== "newest" ? `?sort=${v}` : ""}`);
  };

  if (leads.length === 0) {
    return (
      <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-white px-6 py-16 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
          <svg
            className="h-8 w-8 text-zinc-500 dark:text-zinc-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h2 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          No leads yet
        </h2>
        <p className="mt-2 max-w-sm text-sm text-zinc-600 dark:text-zinc-400">
          When visitors contact you about your listings, their messages will
          appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <span className="text-sm text-zinc-600 dark:text-zinc-400">
          {leads.length} {leads.length === 1 ? "lead" : "leads"}
        </span>
        <div className="flex items-center gap-2">
          <label
            htmlFor="sort"
            className="text-sm font-medium text-zinc-600 dark:text-zinc-400"
          >
            Sort by
          </label>
          <select
            id="sort"
            value={currentSort}
            onChange={handleSortChange}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 focus:border-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="listing">By listing</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {leads.map((lead) => (
          <div
            key={lead.id}
            className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                    {lead.name}
                  </span>
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    {formatDate(lead.created_at)}
                  </span>
                </div>
                {lead.listing && (
                  <Link
                    href={`/dashboard/listings/${lead.listing_id}/edit`}
                    className="inline-block text-sm font-medium text-foreground hover:underline"
                  >
                    {lead.listing.title} · {lead.listing.area}
                  </Link>
                )}
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                  <a
                    href={`mailto:${lead.email}`}
                    className="hover:text-foreground hover:underline"
                  >
                    {lead.email}
                  </a>
                  <a
                    href={`tel:${lead.phone.replace(/\s/g, "")}`}
                    className="hover:text-foreground hover:underline"
                  >
                    {lead.phone}
                  </a>
                </div>
                <p className="whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300">
                  {lead.message}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
