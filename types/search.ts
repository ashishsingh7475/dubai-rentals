export type SortOption = "newest" | "price_asc" | "price_desc";

export interface SearchParams {
  minPrice?: number;
  maxPrice?: number;
  area?: string;
  property_type?: "room" | "apartment";
  bedrooms?: number;
  furnished?: boolean;
  sort?: SortOption;
  page?: number;
}

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

export const BEDROOM_OPTIONS = [
  { value: 0, label: "Studio" },
  { value: 1, label: "1 Bed" },
  { value: 2, label: "2 Beds" },
  { value: 3, label: "3 Beds" },
  { value: 4, label: "4+ Beds" },
] as const;
