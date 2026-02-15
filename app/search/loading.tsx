import { ListingCardSkeleton } from "@/components/listings/listing-card-skeleton";
import { SearchHeader } from "@/components/search/search-header";

export default function SearchLoading() {
  return (
    <>
      <SearchHeader />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="h-8 w-48 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
          <div className="mt-2 h-4 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
        </div>
      </div>
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="hidden lg:block">
          <div className="sticky top-24 w-72 space-y-4 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="h-4 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-12 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-700"
                />
              ))}
            </div>
          </div>
        </div>
        <main className="min-w-0 flex-1">
          <div className="mb-4 h-10 w-48 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ListingCardSkeleton key={i} />
            ))}
          </div>
        </main>
      </div>
    </div>
    </>
  );
}
