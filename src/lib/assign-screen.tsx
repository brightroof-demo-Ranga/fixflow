import type { ReactElement } from "react";
import { AssignForm } from "../app/dispatch/requests/[id]/assign-form";
import { SignInScreen } from "./staff-screen";
import { currentAssignment, listAssignableTechnicians } from "./assignments";
import { getDb } from "./db";
import { getStaffBySession } from "./session";

export async function renderAssignScreen(requestId: string, token: string | null): Promise<ReactElement> {
  const staff = await getStaffBySession(token);
  if (!staff) {
    return <SignInScreen />;
  }
  if (staff.role !== "dispatcher") {
    return (
      <section className="mx-auto flex w-full max-w-md flex-col gap-4 px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">Not available</h1>
      </section>
    );
  }

  const request = await getDb().serviceRequest.findUnique({ where: { id: requestId } });
  if (!request) {
    return (
      <section className="mx-auto flex w-full max-w-md flex-col gap-4 px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">Request not found</h1>
      </section>
    );
  }

  const technicians = await listAssignableTechnicians();
  const current = await currentAssignment(requestId);
  return (
    <AssignForm
      requestId={request.id}
      technicians={technicians}
      assigneeName={current?.technician.name ?? null}
      expectedArrivalAt={current?.expectedArrivalAt?.toISOString() ?? null}
    />
  );
}
