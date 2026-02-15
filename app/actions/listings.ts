"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ListingInsert, ListingUpdate } from "@/types/database";

export async function createListing(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in to create a listing." };

  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const price = Number(formData.get("price"));
  const property_type = formData.get("property_type") as "room" | "apartment";
  const area = (formData.get("area") as string)?.trim();
  const bedrooms = Number(formData.get("bedrooms"));
  const bathrooms = Number(formData.get("bathrooms"));
  const furnished = formData.get("furnished") === "true";
  const image_urls_raw = formData.get("image_urls") as string | null;
  const image_urls = image_urls_raw ? (JSON.parse(image_urls_raw) as string[]) : [];
  const owner_phone = (formData.get("owner_phone") as string)?.trim() || null;
  const owner_whatsapp = (formData.get("owner_whatsapp") as string)?.trim() || null;

  if (!title) return { error: "Title is required." };
  if (!description) return { error: "Description is required." };
  if (Number.isNaN(price) || price < 0) return { error: "Valid price is required." };
  if (!property_type || !["room", "apartment"].includes(property_type))
    return { error: "Property type must be room or apartment." };
  if (!area) return { error: "Area is required." };
  if (Number.isNaN(bedrooms) || bedrooms < 0) return { error: "Bedrooms must be 0 or more." };
  if (Number.isNaN(bathrooms) || bathrooms < 0) return { error: "Bathrooms must be 0 or more." };

  const insert: ListingInsert = {
    title,
    description,
    price,
    property_type,
    area,
    bedrooms,
    bathrooms,
    furnished,
    image_urls,
    user_id: user.id,
    owner_phone,
    owner_whatsapp,
  };

  const { data, error } = await supabase
    .from("listings")
    .insert(insert)
    .select("id")
    .single();

  if (error) return { error: error.message };
  revalidatePath("/dashboard/listings");
  revalidatePath("/dashboard");
  return { data: { id: data.id }, error: null };
}

export async function updateListing(listingId: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in to update a listing." };

  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const price = Number(formData.get("price"));
  const property_type = formData.get("property_type") as "room" | "apartment";
  const area = (formData.get("area") as string)?.trim();
  const bedrooms = Number(formData.get("bedrooms"));
  const bathrooms = Number(formData.get("bathrooms"));
  const furnished = formData.get("furnished") === "true";
  const image_urls_raw = formData.get("image_urls") as string | null;
  const image_urls = image_urls_raw ? (JSON.parse(image_urls_raw) as string[]) : [];
  const owner_phone = (formData.get("owner_phone") as string)?.trim() || null;
  const owner_whatsapp = (formData.get("owner_whatsapp") as string)?.trim() || null;

  if (!title) return { error: "Title is required." };
  if (!description) return { error: "Description is required." };
  if (Number.isNaN(price) || price < 0) return { error: "Valid price is required." };
  if (!property_type || !["room", "apartment"].includes(property_type))
    return { error: "Property type must be room or apartment." };
  if (!area) return { error: "Area is required." };
  if (Number.isNaN(bedrooms) || bedrooms < 0) return { error: "Bedrooms must be 0 or more." };
  if (Number.isNaN(bathrooms) || bathrooms < 0) return { error: "Bathrooms must be 0 or more." };

  const update: ListingUpdate = {
    title,
    description,
    price,
    property_type,
    owner_phone,
    owner_whatsapp,
    area,
    bedrooms,
    bathrooms,
    furnished,
    image_urls,
  };

  const { error } = await supabase
    .from("listings")
    .update(update)
    .eq("id", listingId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/dashboard/listings");
  revalidatePath(`/dashboard/listings/${listingId}/edit`);
  return { error: null };
}

export async function deleteListing(listingId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in to delete a listing." };

  const { error } = await supabase
    .from("listings")
    .delete()
    .eq("id", listingId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/dashboard/listings");
  revalidatePath("/dashboard");
  return { error: null };
}
