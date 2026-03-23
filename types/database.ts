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
  verified_listing: boolean;
  verification_notes?: string | null;
  status: "active" | "flagged" | "blocked" | "archived";
  views_count: number;
  saved_count: number;
  contacted_count: number;
  reported_count: number;
  most_recent_view_at?: string | null;
  created_at: string;
  updated_at: string;
}

export type ListingInsert = Omit<
  Listing,
  | "id"
  | "created_at"
  | "updated_at"
  | "verified_listing"
  | "verification_notes"
  | "status"
  | "views_count"
  | "saved_count"
  | "contacted_count"
  | "reported_count"
  | "most_recent_view_at"
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

export interface OwnerProfile {
  user_id: string;
  display_name?: string | null;
  profile_picture_url?: string | null;
  bio?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  email_verified: boolean;
  phone_verified: boolean;
  document_verified: boolean;
  owner_verified: boolean;
  average_owner_rating: number;
  owner_review_count: number;
  blocked: boolean;
  created_at: string;
  updated_at: string;
}

export type OwnerProfileInsert = Omit<
  OwnerProfile,
  "created_at" | "updated_at" | "average_owner_rating" | "owner_review_count"
>;

export type OwnerProfileUpdate = Partial<
  Omit<OwnerProfile, "user_id" | "created_at">
>;

export interface ListingReview {
  id: string;
  listing_id: string;
  reviewer_user_id: string;
  owner_user_id: string;
  rating: number;
  review_text: string;
  status: "pending" | "approved" | "rejected";
  moderated_by?: string | null;
  moderated_reason?: string | null;
  moderated_at?: string | null;
  created_at: string;
  updated_at: string;
}

export type ListingReviewInsert = Omit<
  ListingReview,
  "id" | "status" | "moderated_by" | "moderated_reason" | "moderated_at" | "created_at" | "updated_at"
>;

export interface ListingReport {
  id: string;
  listing_id: string;
  reporter_user_id?: string | null;
  reason: string;
  details?: string | null;
  status: "open" | "investigating" | "resolved" | "rejected";
  moderated_by?: string | null;
  moderated_note?: string | null;
  moderated_at?: string | null;
  created_at: string;
}

export type ListingReportInsert = Omit<
  ListingReport,
  "id" | "status" | "moderated_by" | "moderated_note" | "moderated_at" | "created_at"
>;

export interface ListingView {
  id: string;
  listing_id: string;
  viewer_user_id?: string | null;
  session_id?: string | null;
  viewed_at: string;
}

export type ListingViewInsert = Omit<ListingView, "id" | "viewed_at">;

export interface BlockedUser {
  id: string;
  user_id: string;
  blocked: boolean;
  reason?: string | null;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
}

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
      owner_profiles: {
        Row: OwnerProfile;
        Insert: OwnerProfileInsert;
        Update: OwnerProfileUpdate;
      };
      listing_reviews: {
        Row: ListingReview;
        Insert: ListingReviewInsert;
        Update: Partial<ListingReview>;
      };
      listing_reports: {
        Row: ListingReport;
        Insert: ListingReportInsert;
        Update: Partial<ListingReport>;
      };
      listing_views: {
        Row: ListingView;
        Insert: ListingViewInsert;
        Update: never;
      };
      blocked_users: {
        Row: BlockedUser;
        Insert: Omit<BlockedUser, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<BlockedUser, "id" | "user_id" | "created_at">>;
      };
    };
  };
}
