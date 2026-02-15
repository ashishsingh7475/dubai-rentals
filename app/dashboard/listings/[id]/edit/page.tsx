import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { ListingForm } from "@/components/listings/listing-form";
import { DeleteButton } from "./delete-button";

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: listing, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !listing) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Edit listing
      </h1>
      <p className="mt-1 text-zinc-600 dark:text-zinc-400">
        Update your property details.
      </p>
      <div className="mt-8">
        <ListingForm mode="edit" listing={listing} userId={user.id} />
        <DeleteButton listingId={listing.id} listingTitle={listing.title} />
      </div>
    </div>
  );
}
