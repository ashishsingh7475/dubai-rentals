import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const displayName =
    user.user_metadata?.full_name ??
    user.user_metadata?.name ??
    user.email?.split("@")[0] ??
    "User";

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Welcome, {displayName}
      </h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        You&apos;re signed in. This is your protected dashboard.
      </p>
      <div className="mt-6 rounded-xl bg-zinc-100 p-4 dark:bg-zinc-800">
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Session info
        </p>
        <p className="mt-1 font-mono text-xs text-zinc-600 dark:text-zinc-400">
          {user.email}
        </p>
        <p className="mt-1 font-mono text-xs text-zinc-500 dark:text-zinc-500">
          ID: {user.id}
        </p>
      </div>
    </div>
  );
}
