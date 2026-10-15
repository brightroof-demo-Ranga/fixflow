import { execSync } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { afterAll, beforeAll, beforeEach, expect, test, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: () => {},
    refresh: () => {},
  }),
}));

const root = process.cwd();

let databaseDir: string;

beforeAll(async () => {
  databaseDir = await mkdtemp(path.join(tmpdir(), "fixflow-assign-"));
  const databaseFile = path.join(databaseDir, "test.db").replaceAll("\\", "/");
  process.env.DATABASE_URL = `file:${databaseFile}`;
  execSync("node ./node_modules/prisma/build/index.js migrate deploy", {
    cwd: root,
    env: process.env,
    stdio: "pipe",
  });
}, 60_000);

beforeEach(async () => {
  const { resetClock } = await import("./clock");
  resetClock();
  const { getDb, resetDb } = await import("./db");
  await resetDb();
  const db = getDb();
  await db.assignment.deleteMany();
  await db.session.deleteMany();
  await db.serviceRequest.deleteMany();
  await db.customer.deleteMany();
  await db.system.deleteMany();
  await db.staffUser.deleteMany();
});

afterAll(async () => {
  const { resetDb } = await import("./db");
  await resetDb();
  await rm(databaseDir, { recursive: true, force: true });
});

async function createStaff(role: "dispatcher" | "technician" | "ops_manager", name: string) {
  const { getDb } = await import("./db");
  const id = crypto.randomUUID();
  await getDb().staffUser.create({
    data: {
      id,
      name,
      email: `${id}@brightroof.example`,
      passwordHash: "unused",
      role,
    },
  });
  return id;
}

async function createRequest(status = "not_assigned", cancelledAt: Date | null = null) {
  const { getDb } = await import("./db");
  const db = getDb();
  const customerId = crypto.randomUUID();
  const systemKey = `SYS-${crypto.randomUUID()}`;
  const requestId = crypto.randomUUID();
  const phone = `077${customerId.replaceAll("-", "").slice(0, 7)}`;
  await db.customer.create({
    data: { id: customerId, phone, name: "Nimal Perera" },
  });
  await db.system.create({
    data: { id: crypto.randomUUID(), systemId: systemKey },
  });
  await db.serviceRequest.create({
    data: {
      id: requestId,
      customerId,
      systemId: systemKey,
      description: "Inverter is silent",
      source: "customer_form",
      status,
      createdAt: new Date("2026-10-01T00:00:00.000Z"),
      trackingTokenHash: crypto.randomUUID(),
      cancelledAt,
    },
  });
  return { requestId, phone, systemKey };
}

async function currentAssignments(requestId: string) {
  const { getDb } = await import("./db");
  return getDb().assignment.findMany({
    where: { requestId, supersededAt: null },
  });
}

test("FIX-21 AC1: a dispatcher assigns a technician and stores that save's assignment time", async () => {
  const dispatcherId = await createStaff("dispatcher", "Ada Dispatch");
  const technicianId = await createStaff("technician", "Ben Tech");
  const { requestId } = await createRequest();
  const assignedAt = new Date("2026-10-15T09:00:00.000Z");
  const { setClock } = await import("./clock");
  setClock(() => assignedAt);

  const { assignTechnician } = await import("./assignments");
  const result = await assignTechnician({
    requestId,
    technicianId,
    actorId: dispatcherId,
  });
  expect(result.changed).toBe(true);

  const current = await currentAssignments(requestId);
  expect(current).toHaveLength(1);
  expect(current[0]?.technicianId).toBe(technicianId);
  expect(current[0]?.assignedAt.toISOString()).toBe(assignedAt.toISOString());

  const { getDb } = await import("./db");
  const request = await getDb().serviceRequest.findUnique({ where: { id: requestId } });
  expect(request?.status).toBe("assigned");
});

test("FIX-21 AC2: reassignment leaves technician B as the only assignee at this save's time", async () => {
  const dispatcherId = await createStaff("dispatcher", "Ada Dispatch");
  const technicianA = await createStaff("technician", "Ben Tech");
  const technicianB = await createStaff("technician", "Cara Tech");
  const { requestId } = await createRequest();
  const firstAt = new Date("2026-10-15T09:00:00.000Z");
  const secondAt = new Date("2026-10-15T11:30:00.000Z");
  const { setClock } = await import("./clock");
  const { assignTechnician } = await import("./assignments");

  setClock(() => firstAt);
  await assignTechnician({ requestId, technicianId: technicianA, actorId: dispatcherId });
  setClock(() => secondAt);
  const result = await assignTechnician({
    requestId,
    technicianId: technicianB,
    actorId: dispatcherId,
  });
  expect(result.changed).toBe(true);

  const current = await currentAssignments(requestId);
  expect(current).toHaveLength(1);
  expect(current[0]?.technicianId).toBe(technicianB);
  expect(current[0]?.assignedAt.toISOString()).toBe(secondAt.toISOString());

  const { getDb } = await import("./db");
  const previous = await getDb().assignment.findFirst({
    where: { requestId, technicianId: technicianA },
  });
  expect(previous?.supersededAt).not.toBeNull();
  const request = await getDb().serviceRequest.findUnique({ where: { id: requestId } });
  expect(request?.status).toBe("assigned");
});

test("FIX-21 AC6: assigning a cancelled request leaves the assignee and status unchanged", async () => {
  const dispatcherId = await createStaff("dispatcher", "Ada Dispatch");
  const technicianA = await createStaff("technician", "Ben Tech");
  const technicianB = await createStaff("technician", "Cara Tech");
  const cancelledAt = new Date("2026-10-14T08:00:00.000Z");
  const { requestId } = await createRequest("cancelled", cancelledAt);
  const originalAssignedAt = new Date("2026-10-13T08:00:00.000Z");
  const { getDb } = await import("./db");
  await getDb().assignment.create({
    data: {
      id: crypto.randomUUID(),
      requestId,
      technicianId: technicianA,
      assignedById: dispatcherId,
      assignedAt: originalAssignedAt,
    },
  });

  const { setClock } = await import("./clock");
  setClock(() => new Date("2026-10-15T12:00:00.000Z"));
  const { assignTechnician } = await import("./assignments");
  const result = await assignTechnician({
    requestId,
    technicianId: technicianB,
    actorId: dispatcherId,
  });
  expect(result.changed).toBe(false);

  const current = await currentAssignments(requestId);
  expect(current).toHaveLength(1);
  expect(current[0]?.technicianId).toBe(technicianA);
  expect(current[0]?.assignedAt.toISOString()).toBe(originalAssignedAt.toISOString());
  const request = await getDb().serviceRequest.findUnique({ where: { id: requestId } });
  expect(request?.status).toBe("cancelled");
  expect(request?.cancelledAt?.toISOString()).toBe(cancelledAt.toISOString());
});

test("FIX-21 AC7: the first assignment stores the expected arrival from that save", async () => {
  const dispatcherId = await createStaff("dispatcher", "Ada Dispatch");
  const technicianId = await createStaff("technician", "Ben Tech");
  const { requestId } = await createRequest();
  const expectedArrivalAt = new Date("2026-10-16T04:15:00.000Z");
  const { assignTechnician } = await import("./assignments");
  const result = await assignTechnician({
    requestId,
    technicianId,
    actorId: dispatcherId,
    expectedArrivalAt,
  });
  expect(result.changed).toBe(true);

  const current = await currentAssignments(requestId);
  expect(current).toHaveLength(1);
  expect(current[0]?.technicianId).toBe(technicianId);
  expect(current[0]?.expectedArrivalAt?.toISOString()).toBe(expectedArrivalAt.toISOString());
});

test("FIX-21 AC8: reassignment stores the expected arrival from this save", async () => {
  const dispatcherId = await createStaff("dispatcher", "Ada Dispatch");
  const technicianA = await createStaff("technician", "Ben Tech");
  const technicianB = await createStaff("technician", "Cara Tech");
  const { requestId } = await createRequest();
  const firstArrival = new Date("2026-10-16T04:15:00.000Z");
  const secondArrival = new Date("2026-10-17T06:45:00.000Z");
  const { assignTechnician } = await import("./assignments");
  await assignTechnician({
    requestId,
    technicianId: technicianA,
    actorId: dispatcherId,
    expectedArrivalAt: firstArrival,
  });
  const result = await assignTechnician({
    requestId,
    technicianId: technicianB,
    actorId: dispatcherId,
    expectedArrivalAt: secondArrival,
  });
  expect(result.changed).toBe(true);

  const current = await currentAssignments(requestId);
  expect(current).toHaveLength(1);
  expect(current[0]?.technicianId).toBe(technicianB);
  expect(current[0]?.expectedArrivalAt?.toISOString()).toBe(secondArrival.toISOString());
});

async function sessionToken(staffId: string) {
  const { createSession } = await import("./session");
  return createSession(staffId);
}

async function postAssignment(
  requestId: string,
  body: Record<string, unknown>,
  token: string | null,
) {
  const { POST } = await import("../app/api/requests/[id]/assignments/route");
  const headers = new Headers({ "content-type": "application/json" });
  if (token) {
    headers.set("cookie", `fixflow_session=${token}`);
  }
  return POST(
    new Request(`http://localhost/api/requests/${requestId}/assignments`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    }),
    { params: Promise.resolve({ id: requestId }) },
  );
}

async function getTechnicians(token: string | null) {
  const { GET } = await import("../app/api/technicians/route");
  const headers = new Headers();
  if (token) {
    headers.set("cookie", `fixflow_session=${token}`);
  }
  return GET(new Request("http://localhost/api/technicians", { headers }));
}

test("FIX-21 AC3: a signed-out user or a technician leaves the assignee unchanged", async () => {
  const technicianA = await createStaff("technician", "Ben Tech");
  const technicianB = await createStaff("technician", "Cara Tech");
  const actingTechnician = await createStaff("technician", "Dan Tech");
  const opsManager = await createStaff("ops_manager", "Cam Ops");
  const { requestId, phone, systemKey } = await createRequest();
  const { getDb } = await import("./db");
  const assignedAt = new Date("2026-10-13T08:00:00.000Z");
  const dispatcherId = await createStaff("dispatcher", "Ada Dispatch");
  await getDb().assignment.create({
    data: {
      id: crypto.randomUUID(),
      requestId,
      technicianId: technicianA,
      assignedById: dispatcherId,
      assignedAt,
    },
  });

  const callers = [null, await sessionToken(actingTechnician), await sessionToken(opsManager)];
  for (const token of callers) {
    const response = await postAssignment(requestId, { technicianId: technicianB }, token);
    const body = await response.text();
    expect(body).not.toContain(phone);
    expect(body).not.toContain(systemKey);
    const current = await currentAssignments(requestId);
    expect(current).toHaveLength(1);
    expect(current[0]?.technicianId).toBe(technicianA);
    expect(current[0]?.assignedAt.toISOString()).toBe(assignedAt.toISOString());
  }

  const signedOut = await assignHtml(requestId, null);
  expect(signedOut).toContain(">Sign in<");
  expect(signedOut).not.toContain(phone);
  expect(signedOut).not.toContain(systemKey);
  expect(signedOut).not.toContain("Assign technician");

  const technicianScreen = await assignHtml(requestId, await sessionToken(actingTechnician));
  expect(technicianScreen).toContain("Not available");
  expect(technicianScreen).not.toContain(phone);
  expect(technicianScreen).not.toContain(systemKey);
  expect(technicianScreen).not.toContain("<option");
});

test("FIX-21 AC4: the assignable list is technicians only and has no customer phone or system ID", async () => {
  const dispatcherId = await createStaff("dispatcher", "Ada Dispatch");
  const technicianId = await createStaff("technician", "Ben Tech");
  await createStaff("ops_manager", "Cam Ops");
  const { requestId, phone, systemKey } = await createRequest();

  const response = await getTechnicians(await sessionToken(dispatcherId));
  expect(response.status).toBe(200);
  const body = (await response.json()) as { technicians: { id: string; name: string }[] };
  expect(body.technicians.map((person) => person.id)).toEqual([technicianId]);
  expect(body.technicians.every((person) => person.name === "Ben Tech")).toBe(true);

  const { getDb } = await import("./db");
  const roles = await Promise.all(
    body.technicians.map(async (person) => {
      const staff = await getDb().staffUser.findUnique({ where: { id: person.id } });
      return staff?.role;
    }),
  );
  expect(roles).toEqual(["technician"]);
  const text = JSON.stringify(body);
  expect(text).not.toContain(phone);
  expect(text).not.toContain(systemKey);
  expect(text).not.toContain("Ada Dispatch");
  expect(text).not.toContain("Cam Ops");

  const html = await assignHtml(requestId, await sessionToken(dispatcherId));
  expect(html).toContain("Ben Tech");
  expect(html).toContain("<option");
  expect(html).not.toContain(phone);
  expect(html).not.toContain(systemKey);
  expect(html).not.toContain("Ada Dispatch");
  expect(html).not.toContain("Cam Ops");
});

test("FIX-21 AC5: assigning a dispatcher or an ops manager leaves the assignee unchanged", async () => {
  const dispatcherId = await createStaff("dispatcher", "Ada Dispatch");
  const otherDispatcher = await createStaff("dispatcher", "Eve Dispatch");
  const opsId = await createStaff("ops_manager", "Cam Ops");
  const technicianId = await createStaff("technician", "Ben Tech");
  const { requestId } = await createRequest();
  const assignedAt = new Date("2026-10-13T08:00:00.000Z");
  const { getDb } = await import("./db");
  await getDb().assignment.create({
    data: {
      id: crypto.randomUUID(),
      requestId,
      technicianId,
      assignedById: dispatcherId,
      assignedAt,
    },
  });

  const token = await sessionToken(dispatcherId);
  for (const staffId of [otherDispatcher, opsId]) {
    const response = await postAssignment(requestId, { technicianId: staffId }, token);
    expect(response.status).toBe(200);
    const current = await currentAssignments(requestId);
    expect(current).toHaveLength(1);
    expect(current[0]?.technicianId).toBe(technicianId);
    expect(current[0]?.assignedAt.toISOString()).toBe(assignedAt.toISOString());
  }

  const html = await assignHtml(requestId, token);
  expect(html).toContain("Ben Tech");
  expect(html).not.toContain("Eve Dispatch");
  expect(html).not.toContain("Cam Ops");
});

test("FIX-21 AC9: twelve technicians are the whole assignable list", async () => {
  const dispatcherId = await createStaff("dispatcher", "Ada Dispatch");
  await createStaff("ops_manager", "Cam Ops");
  const names = Array.from({ length: 12 }, (_, index) => `Tech ${String(index + 1).padStart(2, "0")}`);
  const ids: string[] = [];
  for (const name of names) {
    ids.push(await createStaff("technician", name));
  }

  const response = await getTechnicians(await sessionToken(dispatcherId));
  expect(response.status).toBe(200);
  const body = (await response.json()) as { technicians: { id: string; name: string }[] };
  expect(body.technicians.map((person) => person.name)).toEqual(names);
  expect(body.technicians.map((person) => person.id)).toEqual(ids);
  expect(body.technicians).toHaveLength(12);

  const { requestId } = await createRequest();
  const html = await assignHtml(requestId, await sessionToken(dispatcherId));
  expect(html.match(/<option /g)).toHaveLength(12);
  for (const name of names) {
    expect(html).toContain(name);
  }
  expect(html).not.toContain("Ada Dispatch");
  expect(html).not.toContain("Cam Ops");
});

async function assignHtml(requestId: string, token: string | null) {
  const { renderAssignScreen } = await import("./assign-screen");
  return renderToStaticMarkup(await renderAssignScreen(requestId, token));
}
