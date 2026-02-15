"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createLead } from "@/app/actions/leads";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type ContactFormProps = {
  listingId: string;
  listingTitle: string;
};

export function ContactForm({ listingId, listingTitle }: ContactFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    const name = (fd.get("name") as string)?.trim() ?? "";
    const phone = (fd.get("phone") as string)?.trim() ?? "";
    const email = (fd.get("email") as string)?.trim() ?? "";
    const message = (fd.get("message") as string)?.trim() ?? "";

    setError(null);
    setStatus("loading");

    const result = await createLead({
      listingId,
      name,
      phone,
      email,
      message,
    });

    if (result.error) {
      setError(result.error);
      setStatus("error");
      return;
    }

    setStatus("success");
    form.reset();
    router.refresh();
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center dark:border-emerald-900 dark:bg-emerald-950/50">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
          <svg
            className="h-6 w-6 text-emerald-600 dark:text-emerald-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="mt-3 font-semibold text-emerald-900 dark:text-emerald-50">
          Message sent
        </h3>
        <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-300">
          The owner will get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Contact about this property
        </h3>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Interested in {listingTitle}? Send a message.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200"
        >
          {error}
        </div>
      )}

      <Input
        name="name"
        label="Name"
        placeholder="Your name"
        required
        minLength={2}
        autoComplete="name"
      />
      <Input
        name="phone"
        type="tel"
        label="Phone"
        placeholder="+971 50 123 4567"
        required
        autoComplete="tel"
      />
      <Input
        name="email"
        type="email"
        label="Email"
        placeholder="you@example.com"
        required
        autoComplete="email"
      />
      <Textarea
        name="message"
        label="Message"
        placeholder="Tell the owner about your interest..."
        required
        minLength={10}
        rows={4}
      />

      <Button type="submit" fullWidth loading={status === "loading"}>
        Send message
      </Button>
    </form>
  );
}
