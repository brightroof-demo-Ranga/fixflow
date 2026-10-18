import type { ReactElement } from "react";
import { SignInScreen } from "./staff-screen";
import { getStaffBySession } from "./session";
import { getDb } from "./db";
import { listTechnicianJobs } from "./job-status";
import { JobsList } from "../app/technician/jobs/jobs-list";
import { StatusForm } from "../app/technician/jobs/[id]/status-form";

function unavailable() {
  return (
    <section className="mx-auto flex w-full max-w-sm flex-col gap-4 px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Not available</h1>
    </section>
  );
}

export async function renderTechnicianJobs(token: string | null): Promise<ReactElement> {
  const staff = await getStaffBySession(token);
  if (!staff) {
    return <SignInScreen />;
  }
  if (staff.role !== "technician") {
    return unavailable();
  }
  const jobs = await listTechnicianJobs(staff.id);
  return <JobsList jobs={jobs} />;
}

export async function renderTechnicianJob(requestId: string, token: string | null): Promise<ReactElement> {
  const staff = await getStaffBySession(token);
  if (!staff) {
    return <SignInScreen />;
  }
  if (staff.role !== "technician") {
    return unavailable();
  }

  const request = await getDb().serviceRequest.findUnique({ where: { id: requestId } });
  const current = await getDb().assignment.findFirst({
    where: { requestId, supersededAt: null, technicianId: staff.id },
  });
  if (!request || !current) {
    return unavailable();
  }

  return (
    <StatusForm
      requestId={request.id}
      status={request.status}
      canComplete={request.status === "on_site" || request.status === "remote_diagnosis_completed"}
    />
  );
}
