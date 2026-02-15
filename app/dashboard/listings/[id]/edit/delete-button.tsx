"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { deleteListing } from "@/app/actions/listings";

type DeleteButtonProps = {
  listingId: string;
  listingTitle: string;
};

export function DeleteButton({ listingId, listingTitle }: DeleteButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const handleDelete = async () => {
    if (!confirm) {
      setConfirm(true);
      return;
    }
    setLoading(true);
    const result = await deleteListing(listingId);
    if (result.error) {
      setLoading(false);
      return;
    }
    router.push("/dashboard/listings");
    router.refresh();
  };

  return (
    <div className="mt-8 border-t border-zinc-200 pt-8 dark:border-zinc-800">
      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Delete listing
      </p>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Permanently remove &quot;{listingTitle}&quot;. This cannot be undone.
      </p>
      <Button
        variant="danger"
        size="md"
        className="mt-3"
        onClick={handleDelete}
        loading={loading}
      >
        {confirm ? "Confirm delete" : "Delete listing"}
      </Button>
      {confirm && !loading && (
        <Button
          variant="ghost"
          size="md"
          className="mt-2 ml-2"
          onClick={() => setConfirm(false)}
        >
          Cancel
        </Button>
      )}
    </div>
  );
}
