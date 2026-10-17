import { execSync } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterAll, beforeAll, beforeEach, expect, test } from "vitest";

const root = process.cwd();

let databaseDir: string;

beforeAll(async () => {
  databaseDir = await mkdtemp(path.join(tmpdir(), "fixflow-job-"));
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
  await db.statusEvent.deleteMany();
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

async function createRequest(status = "assigned") {
  const { getDb } = await import("./db");
  const db = getDb();
  const customerId = crypto.randomUUID();
  const systemKey = `SYS-${crypto.randomUUID()}`;
  const requestId = crypto.randomUUID();
  await db.customer.create({
    data: { id: customerId, phone: `077${customerId.replaceAll("-", "").slice(0, 7)}` },
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
      cancelledAt: status === "cancelled" ? new Date("2026-10-14T08:00:00.000Z") : null,
    },
  });
  return requestId;
}

async function assign(requestId: string, technicianId: string, dispatcherId: string, assignedAt: Date) {
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
}

test("FIX-23 AC2: a successful On site save stores that status and the server time", async () => {
  const dispatcherId = await createStaff("dispatcher", "Ada Dispatch");
  const technicianId = await createStaff("technician", "Ben Tech");
  const requestId = await createRequest();
  await assign(requestId, technicianId, dispatcherId, new Date("2026-10-15T08:00:00.000Z"));
  const savedAt = new Date("2026-10-15T09:00:00.000Z");
  const { setClock } = await import("./clock");
  setClock(() => savedAt);

  const { saveJobStatus } = await import("./job-status");
  const result = await saveJobStatus({ requestId, actorId: technicianId, status: "on_site" });
  expect(result.changed).toBe(true);

  const { getDb } = await import("./db");
  const request = await getDb().serviceRequest.findUnique({ where: { id: requestId } });
  expect(request?.status).toBe("on_site");
  expect(request?.onSiteAt?.toISOString()).toBe(savedAt.toISOString());
  expect(request?.remoteDiagnosisCompletedAt).toBeNull();
  const events = await getDb().statusEvent.findMany({ where: { requestId } });
  expect(events).toHaveLength(1);
  expect(events[0]?.status).toBe("on_site");
  expect(events[0]?.at.toISOString()).toBe(savedAt.toISOString());
});

test("FIX-23 AC3: a successful remote diagnosis save stores that status and the server time", async () => {
  const dispatcherId = await createStaff("dispatcher", "Ada Dispatch");
  const technicianId = await createStaff("technician", "Ben Tech");
  const requestId = await createRequest();
  await assign(requestId, technicianId, dispatcherId, new Date("2026-10-15T08:00:00.000Z"));
  const savedAt = new Date("2026-10-15T10:30:00.000Z");
  const { setClock } = await import("./clock");
  setClock(() => savedAt);

  const { saveJobStatus } = await import("./job-status");
  const result = await saveJobStatus({
    requestId,
    actorId: technicianId,
    status: "remote_diagnosis_completed",
  });
  expect(result.changed).toBe(true);

  const { getDb } = await import("./db");
  const request = await getDb().serviceRequest.findUnique({ where: { id: requestId } });
  expect(request?.status).toBe("remote_diagnosis_completed");
  expect(request?.remoteDiagnosisCompletedAt?.toISOString()).toBe(savedAt.toISOString());
  expect(request?.onSiteAt).toBeNull();
  const events = await getDb().statusEvent.findMany({ where: { requestId } });
  expect(events).toHaveLength(1);
  expect(events[0]?.status).toBe("remote_diagnosis_completed");
  expect(events[0]?.at.toISOString()).toBe(savedAt.toISOString());
});

test("FIX-23 AC4: a technician who is not the assignee leaves the job unchanged", async () => {
  const dispatcherId = await createStaff("dispatcher", "Ada Dispatch");
  const assigneeId = await createStaff("technician", "Ben Tech");
  const otherId = await createStaff("technician", "Cara Tech");
  const requestId = await createRequest();
  const assignedAt = new Date("2026-10-15T08:00:00.000Z");
  await assign(requestId, assigneeId, dispatcherId, assignedAt);

  const { setClock } = await import("./clock");
  setClock(() => new Date("2026-10-15T09:00:00.000Z"));
  const { saveJobStatus } = await import("./job-status");
  const result = await saveJobStatus({ requestId, actorId: otherId, status: "on_site" });
  expect(result.changed).toBe(false);

  const { getDb } = await import("./db");
  const request = await getDb().serviceRequest.findUnique({ where: { id: requestId } });
  expect(request?.status).toBe("assigned");
  expect(request?.onSiteAt).toBeNull();
  const current = await getDb().assignment.findMany({ where: { requestId, supersededAt: null } });
  expect(current).toHaveLength(1);
  expect(current[0]?.technicianId).toBe(assigneeId);
  expect(await getDb().statusEvent.count({ where: { requestId } })).toBe(0);
});

test("FIX-23 AC5: after reassignment, technician A cannot update and technician B stays the assignee", async () => {
  const dispatcherId = await createStaff("dispatcher", "Ada Dispatch");
  const technicianA = await createStaff("technician", "Ben Tech");
  const technicianB = await createStaff("technician", "Cara Tech");
  const requestId = await createRequest();
  const { getDb } = await import("./db");
  await getDb().assignment.create({
    data: {
      id: crypto.randomUUID(),
      requestId,
      technicianId: technicianA,
      assignedById: dispatcherId,
      assignedAt: new Date("2026-10-15T08:00:00.000Z"),
      supersededAt: new Date("2026-10-15T09:00:00.000Z"),
    },
  });
  await assign(requestId, technicianB, dispatcherId, new Date("2026-10-15T09:00:00.000Z"));

  const { setClock } = await import("./clock");
  setClock(() => new Date("2026-10-15T11:00:00.000Z"));
  const { saveJobStatus } = await import("./job-status");
  const result = await saveJobStatus({ requestId, actorId: technicianA, status: "on_site" });
  expect(result.changed).toBe(false);

  const request = await getDb().serviceRequest.findUnique({ where: { id: requestId } });
  expect(request?.status).toBe("assigned");
  expect(request?.onSiteAt).toBeNull();
  const current = await getDb().assignment.findMany({ where: { requestId, supersededAt: null } });
  expect(current).toHaveLength(1);
  expect(current[0]?.technicianId).toBe(technicianB);
});

test("FIX-23 AC8: a cancelled request stays cancelled when the assignee saves", async () => {
  const dispatcherId = await createStaff("dispatcher", "Ada Dispatch");
  const technicianId = await createStaff("technician", "Ben Tech");
  const requestId = await createRequest("cancelled");
  await assign(requestId, technicianId, dispatcherId, new Date("2026-10-13T08:00:00.000Z"));

  const { setClock } = await import("./clock");
  setClock(() => new Date("2026-10-15T09:00:00.000Z"));
  const { saveJobStatus } = await import("./job-status");
  const result = await saveJobStatus({ requestId, actorId: technicianId, status: "on_site" });
  expect(result.changed).toBe(false);

  const { getDb } = await import("./db");
  const request = await getDb().serviceRequest.findUnique({ where: { id: requestId } });
  expect(request?.status).toBe("cancelled");
  expect(request?.onSiteAt).toBeNull();
  expect(request?.remoteDiagnosisCompletedAt).toBeNull();
  expect(await getDb().statusEvent.count({ where: { requestId } })).toBe(0);
});

test("FIX-23 AC11: completed from On site or Remote diagnosis completed stores the server time", async () => {
  const dispatcherId = await createStaff("dispatcher", "Ada Dispatch");
  const technicianId = await createStaff("technician", "Ben Tech");
  const { getDb } = await import("./db");
  const { setClock } = await import("./clock");
  const { saveJobStatus } = await import("./job-status");

  for (const prior of ["on_site", "remote_diagnosis_completed"] as const) {
    const requestId = await createRequest(prior);
    const priorAt = new Date("2026-10-15T09:00:00.000Z");
    await getDb().serviceRequest.update({
      where: { id: requestId },
      data:
        prior === "on_site"
          ? { onSiteAt: priorAt }
          : { remoteDiagnosisCompletedAt: priorAt },
    });
    await assign(requestId, technicianId, dispatcherId, new Date("2026-10-15T08:00:00.000Z"));
    const savedAt = new Date("2026-10-15T12:00:00.000Z");
    setClock(() => savedAt);

    const result = await saveJobStatus({ requestId, actorId: technicianId, status: "completed" });
    expect(result.changed).toBe(true);
    const request = await getDb().serviceRequest.findUnique({ where: { id: requestId } });
    expect(request?.status).toBe("completed");
    expect(request?.completedAt?.toISOString()).toBe(savedAt.toISOString());
    const events = await getDb().statusEvent.findMany({ where: { requestId } });
    expect(events).toHaveLength(1);
    expect(events[0]?.status).toBe("completed");
    expect(events[0]?.at.toISOString()).toBe(savedAt.toISOString());
  }
});
