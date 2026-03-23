"use client";

import { useState, useTransition } from "react";
import type { OwnerProfile } from "@/types/database";
import { updateOwnerProfile } from "@/app/actions/trust";

export function OwnerProfileForm({ profile }: { profile: OwnerProfile | null }) {
  const [displayName, setDisplayName] = useState(profile?.display_name ?? "");
  const [avatar, setAvatar] = useState(profile?.profile_picture_url ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [email, setEmail] = useState(profile?.contact_email ?? "");
  const [phone, setPhone] = useState(profile?.contact_phone ?? "");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        startTransition(async () => {
          const fd = new FormData();
          fd.set("display_name", displayName);
          fd.set("profile_picture_url", avatar);
          fd.set("bio", bio);
          fd.set("contact_email", email);
          fd.set("contact_phone", phone);
          const result = await updateOwnerProfile(fd);
          if (result.error) setError(result.error);
          else setMessage("Profile updated.");
        });
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Display name"
          className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
        />
        <input
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
          placeholder="Profile picture URL"
          className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
        />
      </div>
      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        rows={4}
        placeholder="Bio"
        className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Public contact email"
          className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Public contact phone"
          className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full bg-zinc-100 px-2 py-1 dark:bg-zinc-800">
          Email: {profile?.email_verified ? "verified" : "not verified"}
        </span>
        <span className="rounded-full bg-zinc-100 px-2 py-1 dark:bg-zinc-800">
          Phone: {profile?.phone_verified ? "verified" : "not verified"}
        </span>
        <span className="rounded-full bg-zinc-100 px-2 py-1 dark:bg-zinc-800">
          Document: {profile?.document_verified ? "verified" : "not verified"}
        </span>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {message && <p className="text-sm text-emerald-600">{message}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900"
      >
        {isPending ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
}
