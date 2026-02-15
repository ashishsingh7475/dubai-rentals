"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Lead } from "@/types/database";

export interface CreateLeadInput {
  listingId: string;
  name: string;
  phone: string;
  email: string;
  message: string;
}

export async function createLead(input: CreateLeadInput) {
  const { listingId, name, phone, email, message } = input;

  const nameTrim = name?.trim() ?? "";
  const phoneTrim = phone?.trim() ?? "";
  const emailTrim = email?.trim() ?? "";
  const messageTrim = message?.trim() ?? "";

  if (!nameTrim) return { error: "Name is required." };
  if (nameTrim.length < 2) return { error: "Name must be at least 2 characters." };
  if (!phoneTrim) return { error: "Phone is required." };
  if (!emailTrim) return { error: "Email is required." };
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(emailTrim)) return { error: "Please enter a valid email." };
  if (!messageTrim) return { error: "Message is required." };
  if (messageTrim.length < 10)
    return { error: "Message must be at least 10 characters." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("leads").insert({
    listing_id: listingId,
    user_id: user?.id ?? null,
    name: nameTrim,
    phone: phoneTrim,
    email: emailTrim,
    message: messageTrim,
  });

  if (error) return { error: error.message };
  revalidatePath("/dashboard/leads");
  return { error: null };
}

export interface LeadWithListing extends Lead {
  listing?: { id: string; title: string; area: string } | null;
}

export type LeadsSort = "newest" | "oldest" | "listing";

export async function getOwnerLeads(sort: LeadsSort = "newest"): Promise<LeadWithListing[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: leads, error } = await supabase
    .from("leads")
    .select("*, listing:listings(id, title, area)")
    .order("created_at", { ascending: sort === "oldest" });

  if (error) return [];

  let rows = (leads ?? []) as LeadWithListing[];

  if (sort === "listing") {
    rows = [...rows].sort((a, b) => {
      const ta = (a.listing?.title ?? "").toLowerCase();
      const tb = (b.listing?.title ?? "").toLowerCase();
      if (ta !== tb) return ta.localeCompare(tb);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }

  return rows;
}
