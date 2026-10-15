import { Suspense } from "react";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { renderStaffScreen } from "@/lib/staff-screen";
import { SESSION_COOKIE } from "@/lib/session";
import type { StaffPath } from "@/lib/staff-paths";

export function StaffGate({ path }: { path: StaffPath }) {
  return (
    <Suspense fallback={<p className="px-6 py-16">Loading…</p>}>
      <StaffGateBody path={path} />
    </Suspense>
  );
}

async function StaffGateBody({ path }: { path: StaffPath }) {
  await connection();
  const token = (await cookies()).get(SESSION_COOKIE)?.value ?? null;
  return renderStaffScreen(path, token);
}
