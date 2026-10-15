"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function signOut() {
    setPending(true);
    await fetch("/api/session", { method: "DELETE" });
    router.push("/sign-in");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={pending}
      className="h-11 w-fit rounded border border-black/15 px-4 dark:border-white/20"
    >
      Sign out
    </button>
  );
}
