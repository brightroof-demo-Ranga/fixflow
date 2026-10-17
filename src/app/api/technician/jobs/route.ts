import { NextResponse } from "next/server";
import { listTechnicianJobs } from "@/lib/job-status";
import { staffFromRequest } from "@/lib/session";

export async function GET(request: Request) {
  const staff = await staffFromRequest(request);
  if (!staff) {
    return NextResponse.json({ error: "Sign in" }, { status: 401 });
  }
  if (staff.role !== "technician") {
    return NextResponse.json({ error: "Not available" }, { status: 403 });
  }

  const jobs = await listTechnicianJobs(staff.id);
  return NextResponse.json({ jobs });
}
