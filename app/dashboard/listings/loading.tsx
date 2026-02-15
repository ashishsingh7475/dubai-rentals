import { ListingCardSkeleton } from "@/components/listings/listing-card-skeleton";

export default function ListingsLoading() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-8 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-12 w-36 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-700" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <ListingCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
