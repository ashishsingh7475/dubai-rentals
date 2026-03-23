"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/auth/admin";
import type { OwnerProfile, ListingReview, ListingReport } from "@/types/database";

export async function ensureOwnerProfile(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("owner_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (data) return data as OwnerProfile;

  const { data: inserted } = await supabase
    .from("owner_profiles")
    .insert({ user_id: userId })
    .select("*")
    .single();
  return inserted as OwnerProfile;
}

export async function getOwnerProfile(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("owner_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  return (data ?? null) as OwnerProfile | null;
}

export async function updateOwnerProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  await ensureOwnerProfile(user.id);

  const display_name = (formData.get("display_name") as string | null)?.trim() ?? null;
  const profile_picture_url =
    (formData.get("profile_picture_url") as string | null)?.trim() ?? null;
  const bio = (formData.get("bio") as string | null)?.trim() ?? null;
  const contact_email =
    (formData.get("contact_email") as string | null)?.trim() ?? null;
  const contact_phone =
    (formData.get("contact_phone") as string | null)?.trim() ?? null;

  const { error } = await supabase
    .from("owner_profiles")
    .update({
      display_name: display_name || null,
      profile_picture_url: profile_picture_url || null,
      bio: bio || null,
      contact_email: contact_email || null,
      contact_phone: contact_phone || null,
      email_verified: Boolean(user.email_confirmed_at),
    })
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/dashboard");
  revalidatePath(`/owners/${user.id}`);
  return { error: null };
}

export async function getOwnerProfileWithListings(ownerId: string) {
  const supabase = await createClient();
  const [{ data: profile }, { data: listings }, { data: reviews }] = await Promise.all([
    supabase.from("owner_profiles").select("*").eq("user_id", ownerId).maybeSingle(),
    supabase
      .from("listings")
      .select("*")
      .eq("user_id", ownerId)
      .in("status", ["active", "flagged"])
      .order("created_at", { ascending: false }),
    supabase
      .from("listing_reviews")
      .select("*")
      .eq("owner_user_id", ownerId)
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  return {
    profile: (profile ?? null) as OwnerProfile | null,
    listings: listings ?? [],
    reviews: (reviews ?? []) as ListingReview[],
  };
}

export async function createListingReview(input: {
  listingId: string;
  ownerUserId: string;
  rating: number;
  reviewText: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in to review." };
  if (user.id === input.ownerUserId) return { error: "You cannot review your own listing." };

  const rating = Math.max(1, Math.min(5, Math.floor(input.rating)));
  const reviewText = input.reviewText.trim();
  if (reviewText.length < 10) return { error: "Review must be at least 10 characters." };

  const { error } = await supabase.from("listing_reviews").upsert(
    {
      listing_id: input.listingId,
      reviewer_user_id: user.id,
      owner_user_id: input.ownerUserId,
      rating,
      review_text: reviewText,
      status: "pending",
      moderated_by: null,
      moderated_reason: null,
      moderated_at: null,
    },
    { onConflict: "listing_id,reviewer_user_id" }
  );

  if (error) return { error: error.message };
  revalidatePath(`/listings/${input.listingId}`);
  revalidatePath(`/owners/${input.ownerUserId}`);
  return { error: null };
}

export async function reportListing(input: {
  listingId: string;
  reason: string;
  details?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const reason = input.reason.trim();
  if (!reason) return { error: "Reason is required." };

  const { error } = await supabase.from("listing_reports").insert({
    listing_id: input.listingId,
    reporter_user_id: user?.id ?? null,
    reason,
    details: input.details?.trim() || null,
  });

  if (error) return { error: error.message };
  revalidatePath(`/listings/${input.listingId}`);
  revalidatePath("/dashboard/admin");
  return { error: null };
}

export async function trackListingView(input: { listingId: string; sessionId: string }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("listing_views").upsert(
    {
      listing_id: input.listingId,
      viewer_user_id: user?.id ?? null,
      session_id: input.sessionId,
    },
    { onConflict: user?.id ? "listing_id,viewer_user_id" : "listing_id,session_id" }
  );
  if (error) return { error: error.message };

  const { data: countData } = await supabase
    .from("listing_views")
    .select("id", { count: "exact", head: true })
    .eq("listing_id", input.listingId);
  void countData;

  await supabase
    .from("listings")
    .update({
      views_count: await getListingViewsCount(input.listingId),
      most_recent_view_at: new Date().toISOString(),
    })
    .eq("id", input.listingId);

  revalidatePath("/search");
  revalidatePath(`/listings/${input.listingId}`);
  return { error: null };
}

async function getListingViewsCount(listingId: string) {
  const supabase = await createClient();
  const { count } = await supabase
    .from("listing_views")
    .select("id", { count: "exact", head: true })
    .eq("listing_id", listingId);
  return count ?? 0;
}

export async function incrementContactedCount(listingId: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("listings").select("contacted_count").eq("id", listingId).single();
  const current = Number(data?.contacted_count ?? 0);
  await supabase.from("listings").update({ contacted_count: current + 1 }).eq("id", listingId);
  revalidatePath("/search");
  revalidatePath(`/listings/${listingId}`);
}

export async function getTrustSignals() {
  const supabase = await createClient();
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const [recent, mostViewed, popularArea] = await Promise.all([
    supabase
      .from("listings")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("listings")
      .select("*")
      .eq("status", "active")
      .order("views_count", { ascending: false })
      .limit(6),
    supabase
      .from("listing_views")
      .select("listing_id, listings!inner(*)")
      .gte("viewed_at", oneDayAgo)
      .limit(1000),
  ]);

  const byArea = new Map<string, number>();
  for (const row of (popularArea.data ?? []) as Array<{ listings?: { area?: string } }>) {
    const area = row.listings?.area ?? "Other";
    byArea.set(area, (byArea.get(area) ?? 0) + 1);
  }
  const area = [...byArea.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  return {
    recentlyListed: recent.data ?? [],
    mostViewed: mostViewed.data ?? [],
    popularArea: area,
  };
}

export async function getAdminModerationData() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!isAdminUser(user)) return { error: "Forbidden", data: null };

  const [reports, pendingReviews, flaggedListings, blockedUsers] = await Promise.all([
    supabase
      .from("listing_reports")
      .select("*, listings(id, title, user_id, status)")
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("listing_reviews")
      .select("*, listings(id, title)")
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("listings")
      .select("*")
      .in("status", ["flagged", "blocked"])
      .order("reported_count", { ascending: false }),
    supabase.from("blocked_users").select("*").order("updated_at", { ascending: false }),
  ]);

  return {
    error: null,
    data: {
      reports: (reports.data ?? []) as (ListingReport & { listings?: { id: string; title: string; user_id: string; status: string } })[],
      pendingReviews: pendingReviews.data ?? [],
      flaggedListings: flaggedListings.data ?? [],
      blockedUsers: blockedUsers.data ?? [],
    },
  };
}

export async function moderateReport(input: {
  reportId: string;
  status: "investigating" | "resolved" | "rejected";
  note?: string;
  listingStatus?: "active" | "flagged" | "blocked";
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!isAdminUser(user)) return { error: "Forbidden" };

  const { data: report } = await supabase
    .from("listing_reports")
    .select("listing_id")
    .eq("id", input.reportId)
    .single();

  const { error } = await supabase
    .from("listing_reports")
    .update({
      status: input.status,
      moderated_note: input.note?.trim() || null,
      moderated_by: user?.id ?? null,
      moderated_at: new Date().toISOString(),
    })
    .eq("id", input.reportId);
  if (error) return { error: error.message };

  if (report?.listing_id && input.listingStatus) {
    await supabase
      .from("listings")
      .update({ status: input.listingStatus })
      .eq("id", report.listing_id);
  }

  revalidatePath("/dashboard/admin");
  return { error: null };
}

export async function moderateReview(input: {
  reviewId: string;
  status: "approved" | "rejected";
  reason?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!isAdminUser(user)) return { error: "Forbidden" };

  const { data: review } = await supabase
    .from("listing_reviews")
    .select("listing_id")
    .eq("id", input.reviewId)
    .single();

  const { error } = await supabase
    .from("listing_reviews")
    .update({
      status: input.status,
      moderated_reason: input.reason?.trim() || null,
      moderated_by: user?.id ?? null,
      moderated_at: new Date().toISOString(),
    })
    .eq("id", input.reviewId);
  if (error) return { error: error.message };

  if (review?.listing_id) {
    revalidatePath(`/listings/${review.listing_id}`);
  }
  revalidatePath("/dashboard/admin");
  return { error: null };
}

export async function setOwnerBlocked(input: {
  userId: string;
  blocked: boolean;
  reason?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!isAdminUser(user)) return { error: "Forbidden" };

  if (input.blocked) {
    await supabase.from("blocked_users").upsert({
      user_id: input.userId,
      blocked: true,
      reason: input.reason?.trim() || null,
      created_by: user?.id ?? null,
    });
    await supabase.from("listings").update({ status: "blocked" }).eq("user_id", input.userId);
  } else {
    await supabase.from("blocked_users").delete().eq("user_id", input.userId);
    await supabase
      .from("listings")
      .update({ status: "active" })
      .eq("user_id", input.userId)
      .eq("status", "blocked");
  }

  revalidatePath("/dashboard/admin");
  return { error: null };
}

export async function verifyListing(input: {
  listingId: string;
  verified: boolean;
  notes?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!isAdminUser(user)) return { error: "Forbidden" };

  const { error } = await supabase
    .from("listings")
    .update({
      verified_listing: input.verified,
      verification_notes: input.notes?.trim() || null,
    })
    .eq("id", input.listingId);
  if (error) return { error: error.message };
  revalidatePath("/search");
  revalidatePath(`/listings/${input.listingId}`);
  revalidatePath("/dashboard/admin");
  return { error: null };
}
