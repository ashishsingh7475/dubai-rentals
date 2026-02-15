export default function ListingDetailLoading() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 h-5 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
        <div className="aspect-[16/10] w-full animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-700" />
        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:gap-12">
          <div className="min-w-0 flex-1 space-y-4">
            <div className="h-6 w-48 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-10 w-3/4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-8 w-1/3 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
            <div className="grid grid-cols-2 gap-4 pt-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-12 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-700"
                />
              ))}
            </div>
            <div className="h-4 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-700 pt-8" />
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-4 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-700"
                />
              ))}
            </div>
          </div>
          <aside className="lg:w-96 lg:shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="h-10 w-40 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
                <div className="mt-4 h-12 w-full animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-700" />
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-700" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
                    <div className="h-3 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-12 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-700"
                    />
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
