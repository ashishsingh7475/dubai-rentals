import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SearchResultEmpty() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 px-8 py-16 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="mb-4 rounded-full bg-zinc-200 p-4 dark:bg-zinc-700">
        <svg
          className="h-12 w-12 text-zinc-500 dark:text-zinc-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        No properties found
      </h3>
      <p className="mt-2 max-w-sm text-sm text-zinc-600 dark:text-zinc-400">
        Try adjusting your filters or search criteria to find more listings.
      </p>
      <Link href="/search" className="mt-6">
        <Button variant="outline">Reset all filters</Button>
      </Link>
    </div>
  );
}
