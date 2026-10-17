import { Suspense } from "react";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { renderTechnicianJobs } from "@/lib/technician-screen";
import { SESSION_COOKIE } from "@/lib/session";

export default function TechnicianJobsPage() {
  return (
    <Suspense fallback={<p className="px-4 py-10">Loading…</p>}>
      <TechnicianJobsBody />
    </Suspense>
  );
}

async function TechnicianJobsBody() {
  await connection();
  const token = (await cookies()).get(SESSION_COOKIE)?.value ?? null;
  return renderTechnicianJobs(token);
}
