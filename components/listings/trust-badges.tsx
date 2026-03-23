import type { OwnerProfile } from "@/types/database";

type TrustBadgesProps = {
  verifiedListing: boolean;
  ownerProfile?: OwnerProfile | null;
  compact?: boolean;
};

function Badge({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
      {text}
    </span>
  );
}

export function TrustBadges({ verifiedListing, ownerProfile, compact = false }: TrustBadgesProps) {
  const gap = compact ? "gap-1.5" : "gap-2";
  return (
    <div className={`flex flex-wrap items-center ${gap}`}>
      {verifiedListing && <Badge text="Verified listing" />}
      {ownerProfile?.owner_verified && <Badge text="Verified owner" />}
      {ownerProfile?.email_verified && <Badge text="Email verified" />}
      {ownerProfile?.phone_verified && <Badge text="Phone verified" />}
      {ownerProfile?.document_verified && <Badge text="Document verified" />}
    </div>
  );
}
