export function ListingCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="aspect-[4/3] w-full animate-pulse bg-zinc-200 dark:bg-zinc-800" />
      <div className="p-4">
        <div className="h-5 w-3/4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
        <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
        <div className="mt-3 flex gap-3">
          <div className="h-4 w-12 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
          <div className="h-4 w-12 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
        </div>
        <div className="mt-3 h-6 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
      </div>
    </div>
  );
}
