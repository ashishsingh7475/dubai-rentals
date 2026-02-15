import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 py-16 dark:bg-zinc-950 sm:px-6">
      <main className="flex max-w-2xl flex-col items-center gap-10 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
          Dubai Rentals
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Find your next rental in Dubai. Sign in or create an account to get
          started.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/login"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-foreground px-6 font-medium text-background transition-colors hover:bg-foreground/90"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-12 items-center justify-center rounded-xl border-2 border-foreground px-6 font-medium transition-colors hover:bg-foreground/5 dark:hover:bg-white/5"
          >
            Create account
          </Link>
          <Link
            href="/search"
            className="inline-flex h-12 items-center justify-center rounded-xl border border-zinc-300 px-6 font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Browse rentals
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex h-12 items-center justify-center rounded-xl border border-zinc-300 px-6 font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
