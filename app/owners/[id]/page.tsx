import Link from "next/link";
import Image from "next/image";
import { getOwnerProfileWithListings } from "@/app/actions/trust";
import { ListingCard } from "@/components/listings/listing-card";
import { TrustBadges } from "@/components/listings/trust-badges";

export default async function OwnerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { profile, listings, reviews } = await getOwnerProfileWithListings(id);

  const ownerName = profile?.display_name || "Property owner";

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/search" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400">
          ← Back to search
        </Link>

        <section className="mt-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                {profile?.profile_picture_url ? (
                  <Image
                    src={profile.profile_picture_url}
                    alt={ownerName}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{ownerName}</h1>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {profile?.owner_review_count ?? 0} reviews · {(profile?.average_owner_rating ?? 0).toFixed(1)}★
                </p>
              </div>
            </div>
            <TrustBadges verifiedListing={false} ownerProfile={profile} />
          </div>
          {profile?.bio && <p className="mt-4 max-w-3xl text-zinc-700 dark:text-zinc-300">{profile.bio}</p>}
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-zinc-600 dark:text-zinc-300">
            {profile?.contact_email && <a href={`mailto:${profile.contact_email}`}>{profile.contact_email}</a>}
            {profile?.contact_phone && <a href={`tel:${profile.contact_phone}`}>{profile.contact_phone}</a>}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Listings by owner</h2>
          {listings.length === 0 ? (
            <p className="mt-3 text-zinc-600 dark:text-zinc-400">No active listings.</p>
          ) : (
            <div className="mt-4 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </section>

        <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Recent reviews</h2>
          <div className="mt-4 space-y-3">
            {reviews.length === 0 ? (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">No approved reviews yet.</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{review.rating}★</p>
                  <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{review.review_text}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
