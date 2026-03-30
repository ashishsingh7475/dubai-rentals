"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { GoogleButton } from "@/components/auth/google-button";
import { MotionDiv, fadeInUp } from "@/components/motion/motion";
import { SoothingAuthScene } from "@/components/visual/soothing-auth-scene";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export default function SignupPage() {
  const router = useRouter();
  const [oauthError, setOauthError] = useState("");

  const handleSuccess = () => {
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-12 sm:px-6">
      <SoothingAuthScene />

      <div className="absolute left-4 top-4 z-10 flex items-center gap-2 sm:left-6 sm:top-6">
        <Link
          href="/"
          className="rounded-full border border-border bg-card/70 px-4 py-2 text-sm font-medium text-card-foreground shadow-sm backdrop-blur hover:bg-card"
        >
          Dubai Rentals
        </Link>
      </div>
      <div className="absolute right-4 top-4 z-10 sm:right-6 sm:top-6">
        <ThemeToggle className="bg-card/70 backdrop-blur" />
      </div>

      <MotionDiv
        {...fadeInUp}
        className="w-full max-w-[420px] rounded-3xl border border-border bg-card/80 p-7 shadow-[0_18px_60px_-28px_rgba(0,0,0,0.55)] backdrop-blur sm:p-8"
      >
        <h1 className="text-2xl font-semibold tracking-tight text-card-foreground">
          Create account
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Get started with email or Google.
        </p>

        <div className="mt-8 space-y-6">
          <AuthForm
            mode="signup"
            onSuccess={handleSuccess}
            onError={() => setOauthError("")}
          />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          {oauthError && (
            <p className="text-sm text-red-600 dark:text-red-400">{oauthError}</p>
          )}
          <GoogleButton onSuccess={handleSuccess} onError={setOauthError} />
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-card-foreground underline underline-offset-2 hover:no-underline"
          >
            Sign in
          </Link>
        </p>
      </MotionDiv>
    </div>
  );
}
