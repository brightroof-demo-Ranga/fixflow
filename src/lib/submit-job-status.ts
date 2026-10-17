import type { JobStatusInput } from "./job-status";

export async function submitJobStatus(
  requestId: string,
  status: JobStatusInput,
  fetchImpl: typeof fetch = fetch,
) {
  try {
    const response = await fetchImpl(`/api/requests/${requestId}/status`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      return { saved: false as const };
    }
    const body = (await response.json()) as { changed?: boolean };
    return { saved: body.changed === true };
  } catch {
    return { saved: false as const };
  }
}
