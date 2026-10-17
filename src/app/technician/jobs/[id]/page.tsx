import { Suspense } from "react";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { renderTechnicianJob } from "@/lib/technician-screen";
import { SESSION_COOKIE } from "@/lib/session";

export default function TechnicianJobPage({ params }: PageProps<"/technician/jobs/[id]">) {
  return (
    <Suspense fallback={<p className="px-4 py-10">Loading…</p>}>
      <TechnicianJobBody params={params} />
    </Suspense>
  );
}

async function TechnicianJobBody({ params }: { params: PageProps<"/technician/jobs/[id]">["params"] }) {
  await connection();
  const { id } = await params;
  const token = (await cookies()).get(SESSION_COOKIE)?.value ?? null;
  return renderTechnicianJob(id, token);
}
