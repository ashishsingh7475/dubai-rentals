import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ensureOwnerProfile, getOwnerProfileWithListings } from "@/app/actions/trust";
import { getSavedListings } from "@/app/actions/saved";
import { ProfileTabs } from "@/components/profile/profile-tabs";

export const metadata = {
  title: "Profile | Dubai Rentals",
};

export default async function DashboardProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [profile, ownerData, saved] = await Promise.all([
    ensureOwnerProfile(user.id),
    getOwnerProfileWithListings(user.id),
    getSavedListings(),
  ]);

  return (
    <ProfileTabs
      profile={profile}
      userId={user.id}
      listings={ownerData.listings}
      saved={saved}
      reviews={ownerData.reviews}
    />
  );
}

