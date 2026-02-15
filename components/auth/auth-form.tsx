"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AuthFormMode = "signup" | "login";

type AuthFormProps = {
  mode: AuthFormMode;
  onSuccess?: () => void;
  onError?: (message: string) => void;
};

const MIN_PASSWORD_LENGTH = 6;

export function AuthForm({ mode, onSuccess, onError }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Please enter a valid email";
    if (!password) next.password = "Password is required";
    else if (password.length < MIN_PASSWORD_LENGTH)
      next.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
    if (mode === "signup") {
      if (password !== confirmPassword)
        next.confirmPassword = "Passwords do not match";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        onSuccess?.();
        if (onError) onError("");
        return;
      }
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      onSuccess?.();
      if (onError) onError("");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setErrors({ form: message });
      onError?.(message);
    } finally {
      setLoading(false);
    }
  };

  const isSignup = mode === "signup";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {errors.form && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300"
        >
          {errors.form}
        </div>
      )}
      <Input
        type="email"
        label="Email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        autoComplete="email"
        disabled={loading}
      />
      <Input
        type="password"
        label="Password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        autoComplete={isSignup ? "new-password" : "current-password"}
        disabled={loading}
      />
      {isSignup && (
        <Input
          type="password"
          label="Confirm password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
          autoComplete="new-password"
          disabled={loading}
        />
      )}
      <Button
        type="submit"
        loading={loading}
        fullWidth
        size="lg"
        className="mt-1"
      >
        {isSignup ? "Create account" : "Sign in"}
      </Button>
    </form>
  );
}
