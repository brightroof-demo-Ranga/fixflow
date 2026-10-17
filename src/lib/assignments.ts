import { now } from "./clock";
import { getDb } from "./db";

export type AssignInput = {
  requestId: string;
  technicianId: string;
  actorId: string;
  expectedArrivalAt?: Date | null;
};

export async function assignTechnician(input: AssignInput) {
  return getDb().$transaction(async (tx) => {
    const request = await tx.serviceRequest.findUnique({ where: { id: input.requestId } });
    if (!request) {
      return { changed: false as const };
    }
    if (
      request.status === "cancelled" ||
      request.cancelledAt !== null ||
      request.status === "completed" ||
      request.completedAt !== null
    ) {
      return { changed: false as const };
    }

    const technician = await tx.staffUser.findUnique({ where: { id: input.technicianId } });
    if (!technician || technician.role !== "technician") {
      return { changed: false as const };
    }

    const assignedAt = now();
    await tx.assignment.updateMany({
      where: { requestId: request.id, supersededAt: null },
      data: { supersededAt: assignedAt },
    });
    await tx.assignment.create({
      data: {
        id: crypto.randomUUID(),
        requestId: request.id,
        technicianId: technician.id,
        assignedById: input.actorId,
        assignedAt,
        expectedArrivalAt: input.expectedArrivalAt ?? null,
      },
    });

    if (request.status === "not_assigned") {
      await tx.serviceRequest.update({
        where: { id: request.id },
        data: { status: "assigned" },
      });
    }

    return { changed: true as const };
  });
}

export async function listAssignableTechnicians() {
  return getDb().staffUser.findMany({
    where: { role: "technician" },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}

export async function currentAssignment(requestId: string) {
  return getDb().assignment.findFirst({
    where: { requestId, supersededAt: null },
    include: { technician: { select: { id: true, name: true } } },
  });
}
