"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveListing, unsaveListing } from "@/app/actions/saved";

type SaveButtonProps = {
  listingId: string;
  initialSaved: boolean;
  variant?: "card" | "detail";
  className?: string;
};

export function SaveButton({
  listingId,
  initialSaved,
  variant = "card",
  className = "",
}: SaveButtonProps) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;

    const nextSaved = !saved;
    setSaved(nextSaved);
    setLoading(true);

    const result = nextSaved
      ? await saveListing(listingId)
      : await unsaveListing(listingId);

    setLoading(false);
    if (result.error) {
      setSaved(saved);
      return;
    }
    router.refresh();
  };

  const isCard = variant === "card";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      aria-label={saved ? "Remove from saved" : "Save listing"}
      className={[
        "inline-flex items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-foreground/20 disabled:pointer-events-none disabled:opacity-60",
        isCard
          ? "absolute right-3 top-3 h-10 w-10 bg-white/90 shadow-md hover:bg-white hover:scale-110 dark:bg-zinc-900/90 dark:hover:bg-zinc-900"
          : "h-11 w-11 border-2 border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600 dark:hover:bg-zinc-800",
        className,
      ].join(" ")}
    >
      {loading ? (
        <span
          className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden
        />
      ) : (
        <svg
          className={[
            "transition-transform duration-200",
            saved ? "scale-110 text-red-500" : "scale-100 text-zinc-700 dark:text-zinc-300",
          ].join(" ")}
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill={saved ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      )}
    </button>
  );
}
