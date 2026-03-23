import Link from "next/link";
import type { Listing } from "@/types/database";
import { getPublicUrlFromFullPath } from "@/lib/listings/storage";
import { SaveButton } from "./save-button";
import { TrustBadges } from "./trust-badges";

type ListingCardProps = {
  listing: Listing;
  isOwner?: boolean;
  /** When provided, show save button (for logged-in users). Ids of listings the user has saved. */
  savedListingIds?: string[] | null;
};

export function ListingCard({ listing, isOwner, savedListingIds }: ListingCardProps) {
  const imageUrl =
    listing.image_urls?.[0] ?? null;
  const displayUrl = imageUrl?.startsWith("http")
    ? imageUrl
    : getPublicUrlFromFullPath(imageUrl ?? "");

  const showSave = savedListingIds != null && !isOwner;

  return (
    <Link
      href={isOwner ? `/dashboard/listings/${listing.id}/edit` : `/listings/${listing.id}`}
      className="group block overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        {displayUrl ? (
          <img
            src={displayUrl}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-zinc-400 dark:text-zinc-500">
            <svg
              className="h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6 6v.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
        <div className="absolute left-3 top-3 rounded-lg bg-white/90 px-2 py-1 text-xs font-medium text-zinc-800 shadow dark:bg-zinc-900/90 dark:text-zinc-200">
          {listing.property_type}
        </div>
        {showSave && (
          <SaveButton
            listingId={listing.id}
            initialSaved={savedListingIds.includes(listing.id)}
            variant="card"
          />
        )}
      </div>
      <div className="p-4">
        <p className="font-semibold text-zinc-900 dark:text-zinc-50 line-clamp-1">
          {listing.title}
        </p>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {listing.area}
        </p>
        <div className="mt-2">
          <TrustBadges verifiedListing={listing.verified_listing} compact />
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-500 dark:text-zinc-500">
          <span>{listing.bedrooms} bed</span>
          <span>{listing.bathrooms} bath</span>
          {listing.furnished && <span>Furnished</span>}
        </div>
        <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <span>{listing.views_count} views</span>
          <span>{listing.saved_count} saved</span>
          <span>{listing.contacted_count} contacted</span>
          {listing.views_count > 50 && <span>Trending</span>}
        </div>
        <p className="mt-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          AED {Number(listing.price).toLocaleString()}
          <span className="text-sm font-normal text-zinc-500">/mo</span>
        </p>
      </div>
    </Link>
  );
}
