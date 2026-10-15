"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { homeForRole, isStaffRole } from "@/lib/staff-paths";

export function SignInForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/session", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: String(form.get("email") ?? ""),
        password: String(form.get("password") ?? ""),
      }),
    });
    if (!response.ok) {
      setError("Sign-in failed");
      setPending(false);
      return;
    }
    const body = (await response.json()) as { role?: unknown };
    if (typeof body.role !== "string" || !isStaffRole(body.role)) {
      setError("Sign-in failed");
      setPending(false);
      return;
    }
    router.push(homeForRole(body.role));
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm" htmlFor="email">
        Email
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className="h-11 rounded border border-black/15 bg-transparent px-3 dark:border-white/20"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm" htmlFor="password">
        Password
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="h-11 rounded border border-black/15 bg-transparent px-3 dark:border-white/20"
        />
      </label>
      {error ? (
        <p role="alert" className="text-sm">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="h-11 rounded bg-foreground px-4 text-background disabled:opacity-60"
      >
        Sign in
      </button>
    </form>
  );
}
