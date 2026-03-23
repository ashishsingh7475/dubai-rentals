import type { User } from "@supabase/supabase-js";

export function isAdminUser(user: User | null): boolean {
  if (!user?.email) return false;
  const raw = process.env.ADMIN_EMAILS ?? "";
  const admins = raw
    .split(",")
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean);
  return admins.includes(user.email.toLowerCase());
}
