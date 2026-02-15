import Link from "next/link";
import { getSavedListings } from "@/app/actions/saved";
import { ListingCard } from "@/components/listings/listing-card";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Saved Listings | Dubai Rentals",
  description: "Your saved rental properties",
};

export default async function SavedListingsPage() {
  const listings = await getSavedListings();
  const savedListingIds = listings.map((l) => l.id);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Saved listings
      </h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        {listings.length}{" "}
        {listings.length === 1 ? "property" : "properties"} saved
      </p>

      {listings.length === 0 ? (
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
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <h2 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            No saved listings yet
          </h2>
          <p className="mt-2 max-w-sm text-sm text-zinc-600 dark:text-zinc-400">
            Save properties you like from search or listing pages. They’ll show
            up here.
          </p>
          <Link href="/search" className="mt-6">
            <Button>Browse rentals</Button>
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              savedListingIds={savedListingIds}
            />
          ))}
        </div>
      )}
    </div>
  );
}
