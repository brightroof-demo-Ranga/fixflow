import { NextResponse } from "next/server";
import { assignTechnician, currentAssignment } from "@/lib/assignments";
import { staffFromRequest } from "@/lib/session";

export async function POST(request: Request, context: RouteContext<"/api/requests/[id]/assignments">) {
  const staff = await staffFromRequest(request);
  if (!staff) {
    return NextResponse.json({ error: "Sign in" }, { status: 401 });
  }
  if (staff.role !== "dispatcher") {
    return NextResponse.json({ error: "Not available" }, { status: 403 });
  }

  const { id } = await context.params;
  const body = await readBody(request);
  const technicianId = typeof body.technicianId === "string" ? body.technicianId : "";
  const expectedArrivalAt = readArrival(body.expectedArrivalAt);
  if (expectedArrivalAt === "invalid") {
    return NextResponse.json({ changed: false }, { status: 400 });
  }

  const result = await assignTechnician({
    requestId: id,
    technicianId,
    actorId: staff.id,
    expectedArrivalAt,
  });
  if (!result.changed) {
    return NextResponse.json({ changed: false });
  }

  const current = await currentAssignment(id);
  return NextResponse.json({
    changed: true,
    assigneeName: current?.technician.name ?? null,
    assignedAt: current?.assignedAt.toISOString() ?? null,
    expectedArrivalAt: current?.expectedArrivalAt?.toISOString() ?? null,
  });
}

async function readBody(request: Request) {
  try {
    const parsed = (await request.json()) as unknown;
    if (typeof parsed === "object" && parsed !== null) {
      return parsed as { technicianId?: unknown; expectedArrivalAt?: unknown };
    }
  } catch {
    return {};
  }
  return {};
}

function readArrival(value: unknown) {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  if (typeof value !== "string") {
    return "invalid" as const;
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "invalid" as const;
  }
  return parsed;
}
