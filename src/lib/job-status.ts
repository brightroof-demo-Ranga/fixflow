import { now } from "./clock";
import { getDb } from "./db";

export type JobStatusInput = "on_site" | "remote_diagnosis_completed" | "completed";

type ProjectionInput = {
  cancelledAt: Date | null;
  completedAt: Date | null;
  onSiteAt: Date | null;
  remoteDiagnosisCompletedAt: Date | null;
  hasAssignment: boolean;
};

export function projectRequestStatus(input: ProjectionInput) {
  if (input.cancelledAt) {
    return "cancelled";
  }
  if (input.completedAt) {
    return "completed";
  }
  const onSite = input.onSiteAt?.getTime() ?? null;
  const remote = input.remoteDiagnosisCompletedAt?.getTime() ?? null;
  if (onSite !== null && (remote === null || onSite >= remote)) {
    return "on_site";
  }
  if (remote !== null) {
    return "remote_diagnosis_completed";
  }
  if (input.hasAssignment) {
    return "assigned";
  }
  return "not_assigned";
}

export async function saveJobStatus(input: {
  requestId: string;
  actorId: string;
  status: JobStatusInput;
}) {
  return getDb().$transaction(async (tx) => {
    const request = await tx.serviceRequest.findUnique({ where: { id: input.requestId } });
    if (!request || request.cancelledAt || request.completedAt) {
      return { changed: false as const };
    }

    const current = await tx.assignment.findFirst({
      where: { requestId: request.id, supersededAt: null },
    });
    if (!current || current.technicianId !== input.actorId) {
      return { changed: false as const };
    }

    const prior = projectRequestStatus({
      cancelledAt: request.cancelledAt,
      completedAt: request.completedAt,
      onSiteAt: request.onSiteAt,
      remoteDiagnosisCompletedAt: request.remoteDiagnosisCompletedAt,
      hasAssignment: true,
    });
    if (input.status === "completed" && prior !== "on_site" && prior !== "remote_diagnosis_completed") {
      return { changed: false as const };
    }

    const savedAt = now();
    const onSiteAt = input.status === "on_site" ? savedAt : request.onSiteAt;
    const remoteDiagnosisCompletedAt =
      input.status === "remote_diagnosis_completed" ? savedAt : request.remoteDiagnosisCompletedAt;
    const completedAt = input.status === "completed" ? savedAt : request.completedAt;
    const status = projectRequestStatus({
      cancelledAt: request.cancelledAt,
      completedAt,
      onSiteAt,
      remoteDiagnosisCompletedAt,
      hasAssignment: true,
    });

    await tx.serviceRequest.update({
      where: { id: request.id },
      data: { status, onSiteAt, remoteDiagnosisCompletedAt, completedAt },
    });
    await tx.statusEvent.create({
      data: {
        id: crypto.randomUUID(),
        requestId: request.id,
        status,
        actorStaffUserId: input.actorId,
        at: savedAt,
      },
    });
    return { changed: true as const };
  });
}

export async function listTechnicianJobs(technicianId: string) {
  const assignments = await getDb().assignment.findMany({
    where: { technicianId, supersededAt: null },
    orderBy: { assignedAt: "asc" },
    select: { requestId: true },
  });
  return assignments.map((row) => ({ requestId: row.requestId }));
}
