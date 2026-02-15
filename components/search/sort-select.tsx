"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { SORT_OPTIONS } from "@/types/search";
import { buildSearchUrl } from "@/lib/search/url-params";
import type { SearchParams, SortOption } from "@/types/search";

interface SortSelectProps {
  params: SearchParams;
}

export function SortSelect({ params }: SortSelectProps) {
  const router = useRouter();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const sort = e.target.value as SortOption;
      const next = { ...params, sort };
      delete next.page;
      router.push(buildSearchUrl(next));
    },
    [params, router]
  );

  const currentSort = params.sort ?? "newest";

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="sort"
        className="text-sm font-medium text-zinc-600 dark:text-zinc-400"
      >
        Sort by
      </label>
      <select
        id="sort"
        value={currentSort}
        onChange={handleChange}
        className="rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm dark:border-zinc-600 dark:text-zinc-100 focus:border-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
