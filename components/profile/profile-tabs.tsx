"use client";

import * as React from "react";
import Link from "next/link";
import type { Listing, ListingReview, OwnerProfile } from "@/types/database";
import { ListingCard } from "@/components/listings/listing-card";
import { Button } from "@/components/ui/button";
import { MotionDiv } from "@/components/motion/motion";

type TabKey = "listings" | "saved" | "reviews";

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card/60 px-4 py-3 backdrop-blur">
      <div className="text-sm font-semibold text-card-foreground">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

export function ProfileTabs({
  profile,
  userId,
  listings,
  saved,
  reviews,
}: {
  profile: OwnerProfile | null;
  userId: string;
  listings: Listing[];
  saved: Listing[];
  reviews: ListingReview[];
}) {
  const [tab, setTab] = React.useState<TabKey>("listings");

  const ownerName =
    profile?.display_name?.trim() ||
    "Your profile";

  const avgRating = Number(profile?.average_owner_rating ?? 0);
  const reviewCount = Number(profile?.owner_review_count ?? 0);

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_10%_0%,rgba(99,102,241,0.18),transparent_60%),radial-gradient(80%_60%_at_80%_10%,rgba(236,72,153,0.14),transparent_60%)] dark:bg-[radial-gradient(80%_60%_at_10%_0%,rgba(129,140,248,0.16),transparent_60%),radial-gradient(80%_60%_at_80%_10%,rgba(244,114,182,0.12),transparent_60%)]" />

        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-border bg-muted sm:h-20 sm:w-20">
                {profile?.profile_picture_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.profile_picture_url}
                    alt={ownerName}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-muted-foreground">
                    {ownerName.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <h1 className="text-2xl font-semibold tracking-tight text-card-foreground sm:text-3xl">
                  {ownerName}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {reviewCount} reviews · {avgRating.toFixed(1)}★
                </p>
                {profile?.bio ? (
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-card-foreground/90">
                    {profile.bio}
                  </p>
                ) : (
                  <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
                    Add a bio and a profile photo to build trust (just like Instagram).
                  </p>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Link href={`/owners/${userId}`}>
                    <Button variant="outline" size="sm">
                      View public profile
                    </Button>
                  </Link>
                  <Link href="/dashboard/trust">
                    <Button size="sm">Edit profile</Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:w-[420px]">
              <Stat label="Listings" value={listings.length} />
              <Stat label="Saved" value={saved.length} />
              <Stat label="Reviews" value={reviews.length} />
            </div>
          </div>

          <div className="mt-7 flex flex-wrap gap-2">
            {([
              ["listings", "Listings"],
              ["saved", "Saved"],
              ["reviews", "Reviews"],
            ] as const).map(([key, label]) => {
              const active = tab === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTab(key)}
                  className={[
                    "relative rounded-full px-4 py-2 text-sm font-medium transition",
                    "border",
                    active
                      ? "border-transparent bg-foreground text-background"
                      : "border-border bg-card/50 text-card-foreground hover:bg-card",
                  ].join(" ")}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <MotionDiv
        key={tab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        {tab === "listings" && (
          <div className="space-y-4">
            {listings.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border bg-card p-10 text-center">
                <p className="text-sm text-muted-foreground">
                  No listings yet. Create your first listing to show up here.
                </p>
                <div className="mt-4">
                  <Link href="/dashboard/listings/new">
                    <Button>Create listing</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {listings.map((l) => (
                  <ListingCard key={l.id} listing={l} isOwner />
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "saved" && (
          <div className="space-y-4">
            {saved.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border bg-card p-10 text-center">
                <p className="text-sm text-muted-foreground">
                  No saved listings yet. Browse rentals and tap the heart to save.
                </p>
                <div className="mt-4">
                  <Link href="/search">
                    <Button variant="outline">Browse rentals</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {saved.map((l) => (
                  <ListingCard key={l.id} listing={l} savedListingIds={saved.map((x) => x.id)} />
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "reviews" && (
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border bg-card p-10 text-center">
                <p className="text-sm text-muted-foreground">
                  No approved reviews yet.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {reviews.map((r) => (
                  <div
                    key={r.id}
                    className="rounded-3xl border border-border bg-card p-6 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-card-foreground">
                        {r.rating}★
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(r.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-card-foreground/90">
                      {r.review_text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </MotionDiv>
    </div>
  );
}

