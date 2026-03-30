import Link from "next/link";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { MotionDiv, fadeInUp } from "@/components/motion/motion";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(80%_60%_at_20%_10%,rgba(99,102,241,0.18),transparent_60%),radial-gradient(80%_60%_at_80%_20%,rgba(236,72,153,0.14),transparent_60%)] dark:bg-[radial-gradient(80%_60%_at_20%_10%,rgba(129,140,248,0.16),transparent_60%),radial-gradient(80%_60%_at_80%_20%,rgba(244,114,182,0.12),transparent_60%)]" />
      <div className="pointer-events-none absolute -left-24 -top-24 h-[520px] w-[520px] rounded-full bg-[rgb(var(--accent))] opacity-[0.06] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-[620px] w-[620px] rounded-full bg-[rgb(var(--accent-2))] opacity-[0.06] blur-3xl" />

      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 sm:px-6">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          Dubai Rentals
        </Link>
        <ThemeToggle className="bg-card/70 backdrop-blur" />
      </header>

      <main className="mx-auto flex max-w-6xl flex-col items-center px-4 py-14 sm:px-6">
        <MotionDiv {...fadeInUp} className="w-full max-w-3xl text-center">
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
            Find a place in Dubai that feels like home.
          </h1>
          <p className="mt-5 text-pretty text-lg text-muted-foreground sm:text-xl">
            A clean, modern rental experience with verified trust signals, fast
            search, and a profile that looks as polished as an Instagram page.
          </p>

          <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row">
            <Link
              href="/search"
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-foreground px-6 text-sm font-semibold text-background shadow-sm transition hover:bg-foreground/90"
            >
              Browse rentals
            </Link>
            <Link
              href="/login"
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-border bg-card/60 px-6 text-sm font-semibold text-card-foreground backdrop-blur transition hover:bg-card"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-border bg-card/40 px-6 text-sm font-semibold text-card-foreground backdrop-blur transition hover:bg-card"
            >
              Create account
            </Link>
          </div>
        </MotionDiv>

        <div className="mt-14 grid w-full max-w-5xl gap-4 sm:grid-cols-3">
          {[
            {
              title: "Trust-first profiles",
              body: "Verified signals, clean identity, and public owner pages that feel premium.",
            },
            {
              title: "Responsive everywhere",
              body: "Mobile-first layouts, touch-friendly controls, and readable spacing.",
            },
            {
              title: "Smooth motion",
              body: "Subtle animations that feel modern without distracting from listings.",
            },
          ].map((c) => (
            <div
              key={c.title}
              className="rounded-3xl border border-border bg-card/60 p-6 shadow-sm backdrop-blur"
            >
              <p className="text-sm font-semibold text-card-foreground">
                {c.title}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
