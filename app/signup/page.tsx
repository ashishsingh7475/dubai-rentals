"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { GoogleButton } from "@/components/auth/google-button";

export default function SignupPage() {
  const router = useRouter();
  const [oauthError, setOauthError] = useState("");

  const handleSuccess = () => {
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-zinc-950 sm:px-6">
      <div className="w-full max-w-[400px] rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Create account
        </h1>
        <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400">
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
              <span className="w-full border-t border-zinc-200 dark:border-zinc-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                Or
              </span>
            </div>
          </div>

          {oauthError && (
            <p className="text-sm text-red-600 dark:text-red-400">{oauthError}</p>
          )}
          <GoogleButton onSuccess={handleSuccess} onError={setOauthError} />
        </div>

        <p className="mt-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground underline underline-offset-2 hover:no-underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
