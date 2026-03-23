import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { isAdminUser } from "@/lib/auth/admin";
import { getAdminModerationData } from "@/app/actions/trust";
import { AdminModeration } from "@/components/dashboard/admin-moderation";

export const metadata = {
  title: "Admin moderation | Dubai Rentals",
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!isAdminUser(user)) redirect("/dashboard");

  const result = await getAdminModerationData();
  if (result.error || !result.data) return <p className="text-sm text-red-600">Failed to load moderation data.</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Admin moderation</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Review flagged listings, suspicious activity, user reports, and pending review approvals.
        </p>
      </div>
      <AdminModeration data={result.data} />
    </div>
  );
}
