import Link from "next/link";
import { Button } from "@/components/ui/button";

interface SearchEmptyProps {
  hasFilters: boolean;
  onReset?: () => void;
}

export function SearchEmpty({ hasFilters }: SearchEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50/50 px-6 py-16 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-800">
        <svg
          className="h-8 w-8 text-zinc-500 dark:text-zinc-400"
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
      <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        No properties found
      </h3>
      <p className="mt-2 max-w-sm text-sm text-zinc-600 dark:text-zinc-400">
        {hasFilters
          ? "Try adjusting your filters to see more results."
          : "There are no rental listings yet. Check back later."}
      </p>
      <div className="mt-6 flex gap-3">
        {hasFilters && (
          <Link href="/search">
            <Button variant="outline">Clear filters</Button>
          </Link>
        )}
        <Link href="/dashboard">
          <Button variant="secondary">View dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
