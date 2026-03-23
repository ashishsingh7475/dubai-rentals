import { createClient } from "@/lib/supabase/server";
import { ensureOwnerProfile } from "@/app/actions/trust";
import { OwnerProfileForm } from "@/components/dashboard/owner-profile-form";

export const metadata = {
  title: "Trust profile | Dubai Rentals",
};

export default async function TrustDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const profile = await ensureOwnerProfile(user.id);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Owner trust profile</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Build trust with a complete profile, verified contact information, and transparent identity signals.
      </p>
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <OwnerProfileForm profile={profile} />
      </div>
    </div>
  );
}
