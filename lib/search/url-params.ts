import type { SearchParams as SearchParamsType, SortOption } from "@/types/search";

export function parseSearchParams(
  searchParams: Record<string, string | string[] | undefined>
): SearchParamsType {
  const get = (key: string): string | undefined => {
    const v = searchParams[key];
    return Array.isArray(v) ? v[0] : v;
  };

  const minPrice = get("minPrice");
  const maxPrice = get("maxPrice");
  const area = get("area");
  const propertyType = get("property_type");
  const bedrooms = get("bedrooms");
  const furnished = get("furnished");
  const sort = get("sort");
  const page = get("page");

  const params: SearchParamsType = {};

  if (minPrice) {
    const n = Number(minPrice);
    if (!Number.isNaN(n) && n >= 0) params.minPrice = n;
  }
  if (maxPrice) {
    const n = Number(maxPrice);
    if (!Number.isNaN(n) && n > 0) params.maxPrice = n;
  }
  if (area && area.trim()) params.area = area.trim();
  if (propertyType === "room" || propertyType === "apartment")
    params.property_type = propertyType;
  if (bedrooms !== undefined) {
    const n = Number(bedrooms);
    if (!Number.isNaN(n) && n >= 0) params.bedrooms = n;
  }
  if (furnished === "true") params.furnished = true;
  if (sort === "newest" || sort === "price_asc" || sort === "price_desc")
    params.sort = sort as SortOption;
  if (page) {
    const n = Number(page);
    if (!Number.isNaN(n) && n >= 1) params.page = n;
  }

  return params;
}

export function buildSearchUrl(params: SearchParamsType): string {
  const sp = new URLSearchParams();

  if (params.minPrice != null && params.minPrice > 0)
    sp.set("minPrice", String(params.minPrice));
  if (params.maxPrice != null && params.maxPrice > 0)
    sp.set("maxPrice", String(params.maxPrice));
  if (params.area) sp.set("area", params.area);
  if (params.property_type) sp.set("property_type", params.property_type);
  if (params.bedrooms != null && params.bedrooms >= 0)
    sp.set("bedrooms", String(params.bedrooms));
  if (params.furnished === true) sp.set("furnished", "true");
  if (params.sort) sp.set("sort", params.sort);
  if (params.page != null && params.page > 1) sp.set("page", String(params.page));

  const q = sp.toString();
  return q ? `/search?${q}` : "/search";
}
