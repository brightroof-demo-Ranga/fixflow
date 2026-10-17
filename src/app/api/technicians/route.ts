import { NextResponse } from "next/server";
import { listAssignableTechnicians } from "@/lib/assignments";
import { staffFromRequest } from "@/lib/session";

export async function GET(request: Request) {
  const staff = await staffFromRequest(request);
  if (!staff) {
    return NextResponse.json({ error: "Sign in" }, { status: 401 });
  }
  if (staff.role !== "dispatcher") {
    return NextResponse.json({ error: "Not available" }, { status: 403 });
  }

  const technicians = await listAssignableTechnicians();
  return NextResponse.json({ technicians });
}
