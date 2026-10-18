"use client";

import { useState } from "react";
import { CustomerRequestScreen } from "@/lib/request-screen";
import { missingIntakeFields } from "@/lib/request-fields";

const submitFailed = "The request was not submitted. Try again.";

export function RequestForm() {
  const [missing, setMissing] = useState<string[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
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
      setNotice(null);
      return;
    }

    setMissing([]);
    setNotice(null);
    setPending(true);
    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(input),
      });
      let body: { requestId?: string; missing?: string[] } = {};
      try {
        body = (await response.json()) as { requestId?: string; missing?: string[] };
      } catch {
        setNotice(submitFailed);
        return;
      }
      if (Array.isArray(body.missing) && body.missing.length > 0) {
        setMissing(body.missing);
        return;
      }
      if (!response.ok || typeof body.requestId !== "string") {
        setNotice(submitFailed);
        return;
      }
      setRequestId(body.requestId);
    } catch {
      setNotice(submitFailed);
    } finally {
      setPending(false);
    }
  }

  if (requestId) {
    return <CustomerRequestScreen requestId={requestId} />;
  }

  return (
    <CustomerRequestScreen
      missing={missing}
      notice={notice ?? undefined}
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
