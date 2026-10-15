import { Suspense } from "react";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { renderAssignScreen } from "@/lib/assign-screen";
import { SESSION_COOKIE } from "@/lib/session";

export default function AssignPage({ params }: PageProps<"/dispatch/requests/[id]">) {
  return (
    <Suspense fallback={<p className="px-6 py-16">Loading…</p>}>
      <AssignPageBody params={params} />
    </Suspense>
  );
}

async function AssignPageBody({ params }: { params: PageProps<"/dispatch/requests/[id]">["params"] }) {
  await connection();
  const { id } = await params;
  const token = (await cookies()).get(SESSION_COOKIE)?.value ?? null;
  return renderAssignScreen(id, token);
}
