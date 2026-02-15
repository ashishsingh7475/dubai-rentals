import Link from "next/link";
import { getOwnerLeads } from "@/app/actions/leads";
import type { LeadsSort } from "@/app/actions/leads";
import { LeadsContent } from "./leads-content";

export const metadata = {
  title: "Leads | Dubai Rentals",
  description: "View and manage your rental inquiry leads",
};

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const params = await searchParams;
  const sort = (params.sort === "oldest" || params.sort === "listing"
    ? params.sort
    : "newest") as LeadsSort;

  const leads = await getOwnerLeads(sort);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Leads
      </h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Contact inquiries from your rental listings
      </p>

      <LeadsContent leads={leads} currentSort={sort} />
    </div>
  );
}
