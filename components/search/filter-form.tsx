"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DUBAI_AREAS, PROPERTY_TYPES } from "@/types/database";
import { BEDROOM_OPTIONS } from "@/types/search";
import { buildSearchUrl } from "@/lib/search/url-params";
import type { SearchParams } from "@/types/search";

interface FilterFormProps {
  params: SearchParams;
  onApply?: () => void;
  compact?: boolean;
}

export function FilterForm({ params, onApply, compact }: FilterFormProps) {
  const router = useRouter();

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = e.currentTarget;
      const fd = new FormData(form);
      const next: SearchParams = { ...params };

      const minPrice = fd.get("minPrice") as string;
      const maxPrice = fd.get("maxPrice") as string;
      const area = fd.get("area") as string;
      const propertyType = fd.get("property_type") as string;
      const bedrooms = fd.get("bedrooms") as string;
      const furnished = fd.get("furnished") as string;

      if (minPrice && !Number.isNaN(Number(minPrice)))
        next.minPrice = Number(minPrice);
      else delete next.minPrice;
      if (maxPrice && !Number.isNaN(Number(maxPrice)))
        next.maxPrice = Number(maxPrice);
      else delete next.maxPrice;
      if (area?.trim()) next.area = area.trim();
      else delete next.area;
      if (propertyType === "room" || propertyType === "apartment")
        next.property_type = propertyType;
      else delete next.property_type;
      if (bedrooms !== undefined && bedrooms !== "" && !Number.isNaN(Number(bedrooms)))
        next.bedrooms = Number(bedrooms);
      else delete next.bedrooms;
      if (furnished === "true") next.furnished = true;
      else delete next.furnished;

      delete next.page;
      router.push(buildSearchUrl(next));
      onApply?.();
    },
    [params, router, onApply]
  );

  const handleReset = useCallback(() => {
    router.push("/search");
    onApply?.();
  }, [router, onApply]);

  const hasActiveFilters =
    params.minPrice != null ||
    params.maxPrice != null ||
    params.area != null ||
    params.property_type != null ||
    params.bedrooms != null ||
    params.furnished === true;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Price range (AED)
          </label>
          <div className="flex gap-2">
            <Input
              name="minPrice"
              type="number"
              min={0}
              placeholder="Min"
              defaultValue={params.minPrice}
              className="flex-1"
            />
            <Input
              name="maxPrice"
              type="number"
              min={0}
              placeholder="Max"
              defaultValue={params.maxPrice}
              className="flex-1"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Area
          </label>
          <select
            name="area"
            defaultValue={params.area ?? ""}
            className="w-full rounded-xl border border-zinc-300 bg-transparent px-4 py-3 text-base dark:border-zinc-600 dark:text-zinc-100 focus:border-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
          >
            <option value="">All areas</option>
            {DUBAI_AREAS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Property type
          </label>
          <select
            name="property_type"
            defaultValue={params.property_type ?? ""}
            className="w-full rounded-xl border border-zinc-300 bg-transparent px-4 py-3 text-base dark:border-zinc-600 dark:text-zinc-100 focus:border-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
          >
            <option value="">All types</option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Bedrooms
          </label>
          <select
            name="bedrooms"
            defaultValue={params.bedrooms ?? ""}
            className="w-full rounded-xl border border-zinc-300 bg-transparent px-4 py-3 text-base dark:border-zinc-600 dark:text-zinc-100 focus:border-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
          >
            <option value="">Any</option>
            {BEDROOM_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="furnished"
            name="furnished"
            defaultChecked={params.furnished === true}
            value="true"
            className="h-4 w-4 rounded border-zinc-300 text-foreground focus:ring-foreground/20"
          />
          <label htmlFor="furnished" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Furnished only
          </label>
        </div>
      </div>

      <div className={compact ? "flex gap-2" : "flex flex-col gap-2"}>
        <Button type="submit" fullWidth={!compact}>
          Apply filters
        </Button>
        {hasActiveFilters && (
          <Button type="button" variant="outline" onClick={handleReset} fullWidth={!compact}>
            Reset filters
          </Button>
        )}
      </div>
    </form>
  );
}
