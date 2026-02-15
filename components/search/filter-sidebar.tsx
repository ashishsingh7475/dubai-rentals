"use client";

import { FilterForm } from "./filter-form";
import type { SearchParams } from "@/types/search";

interface FilterSidebarProps {
  params: SearchParams;
}

export function FilterSidebar({ params }: FilterSidebarProps) {
  return (
    <aside className="sticky top-24 w-full shrink-0 space-y-1 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 lg:w-72">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        Filters
      </h3>
      <FilterForm params={params} />
    </aside>
  );
}
