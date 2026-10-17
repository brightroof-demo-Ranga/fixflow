import { NextResponse } from "next/server";
import { saveJobStatus, type JobStatusInput } from "@/lib/job-status";
import { staffFromRequest } from "@/lib/session";

const statuses = new Set<JobStatusInput>(["on_site", "remote_diagnosis_completed", "completed"]);

export async function POST(request: Request, context: RouteContext<"/api/requests/[id]/status">) {
  const staff = await staffFromRequest(request);
  if (!staff) {
    return NextResponse.json({ error: "Sign in" }, { status: 401 });
  }
  if (staff.role !== "technician") {
    return NextResponse.json({ error: "Not available" }, { status: 403 });
  }

  const { id } = await context.params;
  const status = await readStatus(request);
  if (!status) {
    return NextResponse.json({ changed: false }, { status: 400 });
  }

  const result = await saveJobStatus({ requestId: id, actorId: staff.id, status });
  return NextResponse.json(result);
}

async function readStatus(request: Request) {
  try {
    const parsed = (await request.json()) as { status?: unknown };
    if (typeof parsed.status === "string" && statuses.has(parsed.status as JobStatusInput)) {
      return parsed.status as JobStatusInput;
    }
  } catch {
    return null;
  }
  return null;
}
