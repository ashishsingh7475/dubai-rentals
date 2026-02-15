import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { ListingCard } from "@/components/listings/listing-card";
import { ListingCardSkeleton } from "@/components/listings/listing-card-skeleton";

export default async function ListingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: listings, error } = await supabase
    .from("listings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-950/30">
        <p className="text-red-700 dark:text-red-300">Failed to load listings.</p>
      </div>
    );
  }

  const isEmpty = !listings?.length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Listings
        </h1>
        {user && (
          <Link href="/dashboard/listings/new">
            <Button size="lg">Create listing</Button>
          </Link>
        )}
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/50 py-16 dark:border-zinc-700 dark:bg-zinc-900/30">
          <svg
            className="h-12 w-12 text-zinc-400 dark:text-zinc-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 14V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <p className="mt-4 text-center text-zinc-600 dark:text-zinc-400">
            No listings yet.
          </p>
          {user && (
            <Link href="/dashboard/listings/new" className="mt-4">
              <Button>Create your first listing</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              isOwner={user?.id === listing.user_id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
