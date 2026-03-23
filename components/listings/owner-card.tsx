"use client";

import { ContactForm } from "./contact-form";
import type { OwnerProfile } from "@/types/database";
import Link from "next/link";
import { TrustBadges } from "./trust-badges";

type OwnerCardProps = {
  listingId: string;
  listingTitle: string;
  showContactForm?: boolean;
  ownerId?: string;
  ownerName?: string;
  ownerProfile?: OwnerProfile | null;
};

export function OwnerCard({
  listingId,
  listingTitle,
  showContactForm = true,
  ownerId,
  ownerName,
  ownerProfile,
}: OwnerCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
          <svg
            className="h-7 w-7 text-zinc-500 dark:text-zinc-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
            {ownerName || "Property owner"}
          </h3>
          <p className="mt-0.5 text-sm text-zinc-600 dark:text-zinc-400">
            Listed on Dubai Rentals
          </p>
          {ownerId && (
            <Link href={`/owners/${ownerId}`} className="mt-1 inline-block text-xs text-foreground hover:underline">
              View public profile
            </Link>
          )}
        </div>
      </div>
      <div className="mt-3">
        <TrustBadges verifiedListing={false} ownerProfile={ownerProfile} compact />
      </div>
      {showContactForm && (
        <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <ContactForm listingId={listingId} listingTitle={listingTitle} />
        </div>
      )}
    </div>
  );
}
