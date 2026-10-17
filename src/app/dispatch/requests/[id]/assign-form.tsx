"use client";

import { useState } from "react";

type TechnicianOption = { id: string; name: string };

export function AssignForm({
  requestId,
  technicians,
  assigneeName,
  expectedArrivalAt,
}: {
  requestId: string;
  technicians: TechnicianOption[];
  assigneeName: string | null;
  expectedArrivalAt: string | null;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [assignee, setAssignee] = useState(assigneeName);
  const [arrival, setArrival] = useState(expectedArrivalAt);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const technicianId = String(form.get("technicianId") ?? "");
    const enteredArrival = String(form.get("expectedArrival") ?? "");
    const body: { technicianId: string; expectedArrivalAt?: string } = { technicianId };
    if (enteredArrival) {
      const parsed = new Date(enteredArrival);
      if (!Number.isNaN(parsed.getTime())) {
        body.expectedArrivalAt = parsed.toISOString();
      }
    }

    setPending(true);
    const response = await fetch(`/api/requests/${requestId}/assignments`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = (await response.json()) as {
      changed?: boolean;
      assigneeName?: string | null;
      expectedArrivalAt?: string | null;
    };
    if (result.changed && result.assigneeName) {
      setAssignee(result.assigneeName);
      setArrival(result.expectedArrivalAt ?? null);
      const arrivalText = result.expectedArrivalAt
        ? ` Expected arrival ${result.expectedArrivalAt}.`
        : "";
      setMessage(`Assigned to ${result.assigneeName}.${arrivalText}`);
    } else {
      setMessage("Assignee unchanged.");
    }
    setPending(false);
  }

  return (
    <section className="mx-auto flex w-full max-w-md flex-col gap-6 px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Assign technician</h1>
      <p>Request {requestId}</p>
      <p>{assignee ? `Current assignee ${assignee}` : "No technician assigned"}</p>
      {arrival ? <p>Expected arrival {arrival}</p> : null}
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm" htmlFor="technicianId">
          Technician
          <select
            id="technicianId"
            name="technicianId"
            required
            className="h-11 rounded border border-black/15 bg-transparent px-3 dark:border-white/20"
          >
            {technicians.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm" htmlFor="expectedArrival">
          Expected arrival
          <input
            id="expectedArrival"
            name="expectedArrival"
            type="datetime-local"
            defaultValue={toLocalInput(expectedArrivalAt)}
            className="h-11 rounded border border-black/15 bg-transparent px-3 dark:border-white/20"
          />
        </label>
        <button
          type="submit"
          disabled={pending || technicians.length === 0}
          className="h-11 rounded bg-foreground px-4 text-background disabled:opacity-60"
        >
          Assign technician
        </button>
      </form>
      {message ? <p>{message}</p> : null}
    </section>
  );
}

function toLocalInput(iso: string | null) {
  if (!iso) {
    return "";
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
