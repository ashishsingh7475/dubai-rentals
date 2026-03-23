import { unstable_cache } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Listing } from "@/types/database";
import type { SearchParams, SortOption } from "@/types/search";

const PAGE_SIZE = 12;

export interface SearchResult {
  listings: Listing[];
  total: number;
  page: number;
  totalPages: number;
}

export const searchListings = unstable_cache(async function searchListings(
  params: SearchParams = {}
): Promise<SearchResult> {
  const supabase = await createClient();
  const page = Math.max(1, params.page ?? 1);

  let query = supabase
    .from("listings")
    .select(
      "id, title, description, price, property_type, area, bedrooms, bathrooms, furnished, image_urls, user_id, owner_phone, owner_whatsapp, verified_listing, verification_notes, status, views_count, saved_count, contacted_count, reported_count, most_recent_view_at, created_at, updated_at",
      {
      count: "exact",
    }
    )
    .in("status", ["active", "flagged"]);

  // Price filters
  if (params.minPrice != null && params.minPrice > 0) {
    query = query.gte("price", params.minPrice);
  }
  if (params.maxPrice != null && params.maxPrice > 0) {
    query = query.lte("price", params.maxPrice);
  }

  // Area filter
  if (params.area && params.area.trim()) {
    query = query.eq("area", params.area.trim());
  }

  // Property type filter
  if (params.property_type) {
    query = query.eq("property_type", params.property_type);
  }

  // Bedrooms filter
  if (params.bedrooms != null && params.bedrooms >= 0) {
    if (params.bedrooms >= 4) {
      query = query.gte("bedrooms", 4);
    } else {
      query = query.eq("bedrooms", params.bedrooms);
    }
  }

  // Furnished filter
  if (params.furnished === true) {
    query = query.eq("furnished", true);
  }

  // Sorting
  const sort = params.sort ?? "newest";
  switch (sort) {
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    case "newest":
    default:
      query = query.order("created_at", { ascending: false });
      break;
  }

  // Pagination
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const total = count ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return {
    listings: (data ?? []) as Listing[],
    total,
    page,
    totalPages,
  };
}, ["search-listings-cache"], { revalidate: 60 });
