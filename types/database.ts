export type PropertyType = "room" | "apartment";

export const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: "room", label: "Room" },
  { value: "apartment", label: "Apartment" },
];

export const DUBAI_AREAS = [
  "Downtown Dubai",
  "Dubai Marina",
  "JBR",
  "Palm Jumeirah",
  "Business Bay",
  "JLT",
  "DIFC",
  "Arabian Ranches",
  "Dubai Hills Estate",
  "Al Barsha",
  "Jumeirah",
  "Al Nahda",
  "Deira",
  "Dubai Creek Harbour",
  "Meydan",
  "Silicon Oasis",
  "Discovery Gardens",
  "International City",
  "Other",
] as const;

export type DubaiArea = (typeof DUBAI_AREAS)[number];

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  property_type: PropertyType;
  area: string;
  bedrooms: number;
  bathrooms: number;
  furnished: boolean;
  image_urls: string[];
  user_id: string;
  owner_phone?: string | null;
  owner_whatsapp?: string | null;
  created_at: string;
  updated_at: string;
}

export type ListingInsert = Omit<
  Listing,
  "id" | "created_at" | "updated_at"
> & { image_urls?: string[] };

export type ListingUpdate = Partial<
  Omit<Listing, "id" | "user_id" | "created_at">
>;

export interface SavedListing {
  id: string;
  user_id: string;
  listing_id: string;
  created_at: string;
}

export type SavedListingInsert = Omit<SavedListing, "id" | "created_at">;

export interface Lead {
  id: string;
  listing_id: string;
  user_id: string | null;
  name: string;
  phone: string;
  email: string;
  message: string;
  created_at: string;
}

export type LeadInsert = Omit<Lead, "id" | "created_at">;

export interface Database {
  public: {
    Tables: {
      listings: {
        Row: Listing;
        Insert: ListingInsert;
        Update: ListingUpdate;
      };
      saved_listings: {
        Row: SavedListing;
        Insert: SavedListingInsert;
        Update: never;
      };
      leads: {
        Row: Lead;
        Insert: LeadInsert;
        Update: never;
      };
    };
  };
}
