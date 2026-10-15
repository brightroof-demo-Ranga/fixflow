"use client";

import { useState } from "react";
import { CustomerRequestScreen } from "@/lib/request-screen";
import { missingIntakeFields } from "@/lib/request-fields";

export function RequestForm() {
  const [missing, setMissing] = useState<string[]>([]);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const input = {
      phone: String(form.get("phone") ?? ""),
      systemId: String(form.get("systemId") ?? ""),
      description: String(form.get("description") ?? ""),
    };
    const absent = missingIntakeFields(input);
    if (absent.length > 0) {
      setMissing(absent);
      return;
    }

    setPending(true);
    const response = await fetch("/api/requests", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input),
    });
    const body = (await response.json()) as { requestId?: string; missing?: string[] };
    if (!response.ok || typeof body.requestId !== "string") {
      setMissing(body.missing ?? ["phone number", "system ID", "problem description"]);
      setPending(false);
      return;
    }
    setRequestId(body.requestId);
    setPending(false);
  }

  if (requestId) {
    return <CustomerRequestScreen requestId={requestId} />;
  }

  return (
    <CustomerRequestScreen
      missing={missing}
      form={
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm" htmlFor="phone">
            Phone number
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              className="h-11 rounded border border-black/15 bg-transparent px-3 dark:border-white/20"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm" htmlFor="systemId">
            System ID
            <input
              id="systemId"
              name="systemId"
              type="text"
              className="h-11 rounded border border-black/15 bg-transparent px-3 dark:border-white/20"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm" htmlFor="description">
            Problem description
            <textarea
              id="description"
              name="description"
              rows={4}
              className="rounded border border-black/15 bg-transparent px-3 py-2 dark:border-white/20"
            />
          </label>
          <button
            type="submit"
            disabled={pending}
            className="h-11 rounded bg-foreground px-4 text-background disabled:opacity-60"
          >
            Submit request
          </button>
        </form>
      }
    />
  );
}
