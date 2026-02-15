import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ListingForm } from "@/components/listings/listing-form";

export default async function NewListingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Create listing
      </h1>
      <p className="mt-1 text-zinc-600 dark:text-zinc-400">
        Add a new property to the listings.
      </p>
      <div className="mt-8">
        <ListingForm mode="create" userId={user.id} />
      </div>
    </div>
  );
}
