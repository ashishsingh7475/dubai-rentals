"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Listing } from "@/types/database";

export async function saveListing(listingId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in to save listings." };

  const { error } = await supabase.from("saved_listings").insert({
    user_id: user.id,
    listing_id: listingId,
  });

  if (error) {
    if (error.code === "23505") return { error: null }; // unique violation = already saved
    return { error: error.message };
  }
  revalidatePath("/search");
  revalidatePath("/listings/[id]", "page");
  revalidatePath("/dashboard/saved");
  return { error: null };
}

export async function unsaveListing(listingId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in to unsave listings." };

  const { error } = await supabase
    .from("saved_listings")
    .delete()
    .eq("user_id", user.id)
    .eq("listing_id", listingId);

  if (error) return { error: error.message };
  revalidatePath("/search");
  revalidatePath("/listings/[id]", "page");
  revalidatePath("/dashboard/saved");
  return { error: null };
}

/** Returns saved listing ids for the current user, or null if not authenticated. */
export async function getSavedListingIds(): Promise<string[] | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("saved_listings")
    .select("listing_id")
    .eq("user_id", user.id);

  if (error) return [];
  return (data ?? []).map((r) => r.listing_id);
}

/** Returns full listing rows for the current user's saved listings (dashboard). Auth required. */
export async function getSavedListings(): Promise<Listing[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: saved, error: savedError } = await supabase
    .from("saved_listings")
    .select("listing_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (savedError || !saved?.length) return [];

  const ids = saved.map((r) => r.listing_id);
  const { data: listings, error: listError } = await supabase
    .from("listings")
    .select("*")
    .in("id", ids);

  if (listError || !listings?.length) return [];

  const byId = new Map(listings.map((l) => [l.id, l as Listing]));
  return ids.map((id) => byId.get(id)).filter(Boolean) as Listing[];
}
