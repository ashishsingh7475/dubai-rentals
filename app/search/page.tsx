import Link from "next/link";
import { Suspense } from "react";
import { searchListings } from "@/lib/search/query";
import { getSavedListingIds } from "@/app/actions/saved";
import { SearchHeader } from "@/components/search/search-header";
import { parseSearchParams, buildSearchUrl } from "@/lib/search/url-params";
import { ListingCard } from "@/components/listings/listing-card";
import { ListingCardSkeleton } from "@/components/listings/listing-card-skeleton";
import { FilterSidebar } from "@/components/search/filter-sidebar";
import { FilterDrawer } from "@/components/search/filter-drawer";
import { SortSelect } from "@/components/search/sort-select";
import { SearchEmpty } from "@/components/search/search-empty";
import { getTrustSignals } from "@/app/actions/trust";

export const metadata = {
  title: "Search Rentals | Dubai Rentals",
  description: "Search and filter rental properties in Dubai",
};

async function SearchContent({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const params = parseSearchParams(raw);
  const [result, savedListingIds, trustSignals] = await Promise.all([
    searchListings(params),
    getSavedListingIds(),
    getTrustSignals(),
  ]);

  const hasFilters =
    params.minPrice != null ||
    params.maxPrice != null ||
    params.area != null ||
    params.property_type != null ||
    params.bedrooms != null ||
    params.furnished === true;

  return (
    <>
      <SearchHeader />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 grid gap-4 rounded-2xl bg-gradient-to-r from-zinc-900 to-zinc-700 p-5 text-white shadow-sm md:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-zinc-300">Recently listed</p>
          <p className="mt-1 text-sm">{trustSignals.recentlyListed.length} new homes</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-zinc-300">Most viewed</p>
          <p className="mt-1 text-sm">{trustSignals.mostViewed.length} trending this week</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-zinc-300">Popular in this area</p>
          <p className="mt-1 text-sm">{trustSignals.popularArea ?? "Across Dubai"}</p>
        </div>
      </div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Dubai Rentals
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {result.total} {result.total === 1 ? "property" : "properties"} found
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <FilterDrawer
            params={params}
            activeFilterCount={
              (params.minPrice != null ? 1 : 0) +
              (params.maxPrice != null ? 1 : 0) +
              (params.area ? 1 : 0) +
              (params.property_type ? 1 : 0) +
              (params.bedrooms != null ? 1 : 0) +
              (params.furnished ? 1 : 0)
            }
          />
          <div className="hidden lg:block">
            <SortSelect params={params} />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="hidden lg:block">
          <FilterSidebar params={params} />
        </div>

        <main className="min-w-0 flex-1">
          <div className="mb-4 flex items-center justify-between lg:hidden">
            <SortSelect params={params} />
          </div>

          {result.listings.length === 0 ? (
            <SearchEmpty hasFilters={hasFilters} />
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {result.listings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    savedListingIds={savedListingIds}
                  />
                ))}
              </div>

              {result.totalPages > 1 && (
                <nav
                  className="mt-8 flex justify-center gap-2"
                  aria-label="Pagination"
                >
                  {result.page > 1 && (
                    <Link
                      href={buildSearchUrl({ ...params, page: result.page - 1 })}
                      className="inline-flex h-10 items-center rounded-lg border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      Previous
                    </Link>
                  )}
                  <span className="flex h-10 items-center px-4 text-sm text-zinc-600 dark:text-zinc-400">
                    Page {result.page} of {result.totalPages}
                  </span>
                  {result.page < result.totalPages && (
                    <Link
                      href={buildSearchUrl({ ...params, page: result.page + 1 })}
                      className="inline-flex h-10 items-center rounded-lg border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      Next
                    </Link>
                  )}
                </nav>
              )}
            </>
          )}
        </main>
      </div>
    </div>
    </>
  );
}

function SearchLoading() {
  return (
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
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ListingCardSkeleton key={i} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchContent searchParams={searchParams} />
    </Suspense>
  );
}
