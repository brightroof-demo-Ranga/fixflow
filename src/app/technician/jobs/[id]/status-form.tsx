"use client";

import { useState } from "react";
import { submitJobStatus } from "@/lib/submit-job-status";
import type { JobStatusInput } from "@/lib/job-status";

const actions: { status: JobStatusInput; label: string }[] = [
  { status: "on_site", label: "On site" },
  { status: "remote_diagnosis_completed", label: "Remote diagnosis completed" },
  { status: "completed", label: "Completed" },
];

export function StatusForm({
  requestId,
  status,
  canComplete,
}: {
  requestId: string;
  status: string;
  canComplete: boolean;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(status);
  const [allowComplete, setAllowComplete] = useState(canComplete);

  async function save(next: JobStatusInput) {
    setPending(true);
    const result = await submitJobStatus(requestId, next);
    if (result.saved) {
      setCurrentStatus(next);
      setAllowComplete(next === "on_site" || next === "remote_diagnosis_completed");
      const label = actions.find((action) => action.status === next)?.label ?? next;
      setMessage(`Saved ${label}.`);
    } else {
      setMessage("Update not saved.");
    }
    setPending(false);
  }

  const visible =
    currentStatus === "completed" || currentStatus === "cancelled"
      ? []
      : actions.filter((action) => action.status !== "completed" || allowComplete);

  return (
    <section className="mx-auto flex w-full max-w-sm flex-col gap-4 px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Update job</h1>
      <p>Request {requestId}</p>
      <p>Status {currentStatus}</p>
      {message ? <p role="status">{message}</p> : null}
      <div className="flex flex-col gap-3">
        {visible.map((action) => (
          <button
            key={action.status}
            type="button"
            disabled={pending}
            onClick={() => save(action.status)}
            className="h-11 rounded bg-foreground px-4 text-background disabled:opacity-60"
          >
            {action.label}
          </button>
        ))}
      </div>
    </section>
  );
}
