"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function NavLinks({
  mobile,
  authed,
  isAdmin,
  setOpen,
  handleSignOut,
}: {
  mobile?: boolean;
  authed: boolean;
  isAdmin?: boolean;
  setOpen: (open: boolean) => void;
  handleSignOut: () => void;
}) {
  return (
    <nav
      className={[
        "flex items-center",
        mobile ? "flex-col items-stretch gap-2" : "gap-5",
      ].join(" ")}
    >
      <Link
        href="/search"
        className={[
          "text-sm font-medium transition",
          "text-muted-foreground hover:text-foreground",
          mobile &&
            "rounded-2xl border border-border bg-card/60 px-4 py-3 backdrop-blur",
        ].join(" ")}
        onClick={() => setOpen(false)}
      >
        Browse
      </Link>

      {authed ? (
        <>
          <Link
            href="/dashboard/listings/new"
            className={[
              "text-sm font-medium transition",
              "text-muted-foreground hover:text-foreground",
              mobile &&
                "rounded-2xl border border-border bg-card/60 px-4 py-3 backdrop-blur",
            ].join(" ")}
            onClick={() => setOpen(false)}
          >
            Create listing
          </Link>
          <Link
            href="/dashboard/profile"
            className={[
              "text-sm font-medium transition",
              "text-muted-foreground hover:text-foreground",
              mobile &&
                "rounded-2xl border border-border bg-card/60 px-4 py-3 backdrop-blur",
            ].join(" ")}
            onClick={() => setOpen(false)}
          >
            Profile
          </Link>
          {isAdmin ? (
            <Link
              href="/dashboard/admin"
              className={[
                "text-sm font-medium transition",
                "text-muted-foreground hover:text-foreground",
                mobile &&
                  "rounded-2xl border border-border bg-card/60 px-4 py-3 backdrop-blur",
              ].join(" ")}
              onClick={() => setOpen(false)}
            >
              Admin
            </Link>
          ) : null}

          {!mobile ? (
            <>
              <Link href="/dashboard" onClick={() => setOpen(false)}>
                <Button size="sm">Dashboard</Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link href="/dashboard" onClick={() => setOpen(false)}>
                <Button fullWidth>Dashboard</Button>
              </Link>
              <Button variant="outline" fullWidth onClick={handleSignOut}>
                Sign out
              </Button>
            </>
          )}
        </>
      ) : (
        <>
          <Link
            href="/login"
            className={[
              "text-sm font-medium transition",
              "text-muted-foreground hover:text-foreground",
              mobile &&
                "rounded-2xl border border-border bg-card/60 px-4 py-3 backdrop-blur",
            ].join(" ")}
            onClick={() => setOpen(false)}
          >
            Sign in
          </Link>
          {!mobile ? (
            <Link href="/signup" onClick={() => setOpen(false)}>
              <Button size="sm">Create account</Button>
            </Link>
          ) : (
            <Link href="/signup" onClick={() => setOpen(false)}>
              <Button fullWidth>Create account</Button>
            </Link>
          )}
        </>
      )}
    </nav>
  );
}

export function SiteHeader({
  maxWidthClassName = "max-w-7xl",
  isAdmin,
}: {
  maxWidthClassName?: string;
  isAdmin?: boolean;
}) {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const authed = !!user && !loading;

  const handleSignOut = async () => {
    await signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/75 backdrop-blur">
      <div className={["mx-auto flex items-center justify-between px-4 py-4 sm:px-6", maxWidthClassName].join(" ")}>
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-foreground"
        >
          Dubai Rentals
        </Link>

        <div className="hidden items-center gap-3 md:flex">
          <NavLinks
            authed={authed}
            isAdmin={isAdmin}
            setOpen={setOpen}
            handleSignOut={handleSignOut}
          />
          <ThemeToggle className="bg-card/60 backdrop-blur" />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle className="bg-card/60 backdrop-blur" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="rounded-full border border-transparent hover:border-border"
          >
            {open ? <XIcon className="h-4 w-4" /> : <MenuIcon className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {open ? (
        <div className="md:hidden">
          <div className="mx-auto max-w-7xl px-4 pb-4 sm:px-6">
            <div className="rounded-3xl border border-border bg-card/70 p-3 backdrop-blur">
              <NavLinks
                mobile
                authed={authed}
                isAdmin={isAdmin}
                setOpen={setOpen}
                handleSignOut={handleSignOut}
              />
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

