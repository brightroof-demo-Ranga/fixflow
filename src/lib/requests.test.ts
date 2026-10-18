import { execSync } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { afterAll, afterEach, beforeAll, beforeEach, expect, test, vi } from "vitest";

const root = process.cwd();

let databaseDir: string;

beforeAll(async () => {
  databaseDir = await mkdtemp(path.join(tmpdir(), "fixflow-requests-"));
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
  await db.serviceRequest.deleteMany();
  await db.customer.deleteMany();
  await db.system.deleteMany();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

afterAll(async () => {
  const { resetDb } = await import("./db");
  await resetDb();
  await rm(databaseDir, { recursive: true, force: true });
});

const valid = {
  phone: "0771234567",
  systemId: "SYS-100",
  description: "Inverter is silent",
};

async function postRequest(body: Record<string, unknown>) {
  const { POST } = await import("../app/api/requests/route");
  return POST(
    new Request("http://localhost/api/requests", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}

async function requestCount() {
  const { getDb } = await import("./db");
  return getDb().serviceRequest.count();
}

async function storedRequest(id: string) {
  const { getDb } = await import("./db");
  return getDb().serviceRequest.findUnique({
    where: { id },
    include: { customer: true, system: true },
  });
}

async function screenHtml(props: { missing?: string[]; requestId?: string }) {
  const { renderCustomerRequestScreen } = await import("./request-screen");
  return renderToStaticMarkup(
    await renderCustomerRequestScreen({
      missing: props.missing ?? [],
      requestId: props.requestId,
    }),
  );
}

function expectNotAnOfficeHoursOrDateRejection(body: unknown) {
  const text = JSON.stringify(body).toLowerCase();
  expect(text).not.toContain("office hours");
  expect(text).not.toContain("weekend");
  expect(text).not.toContain("november");
  expect(text).not.toContain("december");
  expect(text).not.toContain("rejected");
}

test("FIX-19 AC1: a customer request stores phone, system ID, description, id, and create time", async () => {
  const createdAt = new Date("2026-10-15T08:30:00.000Z");
  const { setClock } = await import("./clock");
  setClock(() => createdAt);

  const response = await postRequest(valid);
  expect(response.status).toBe(201);
  const body = (await response.json()) as { requestId?: string; trackingToken?: string };
  expect(body.requestId).toEqual(expect.any(String));
  expect(body.trackingToken).toEqual(expect.any(String));

  const stored = await storedRequest(body.requestId!);
  expect(stored).toMatchObject({
    id: body.requestId,
    description: valid.description,
    source: "customer_form",
    critical: false,
    status: "not_assigned",
    customer: { phone: valid.phone },
    system: { systemId: valid.systemId },
  });
  expect(stored?.createdAt.toISOString()).toBe(createdAt.toISOString());
  expect(stored?.trackingTokenHash).not.toBe(body.trackingToken);
  expect(JSON.stringify(stored)).not.toContain(body.trackingToken);

  const again = await postRequest({
    phone: "0770000002",
    systemId: "SYS-101",
    description: "Display is blank",
  });
  const second = (await again.json()) as { requestId: string };
  expect(second.requestId).not.toBe(body.requestId);
});

test("FIX-19 AC2: a missing phone number or system ID stores nothing and the screen names each missing field", async () => {
  const cases = [
    {
      body: { phone: "   ", systemId: "SYS-100", description: "Inverter is silent" },
      missing: ["phone number"],
      absent: ["system ID", "problem description"],
    },
    {
      body: { systemId: "SYS-100", description: "Inverter is silent" },
      missing: ["phone number"],
      absent: ["system ID", "problem description"],
    },
    {
      body: { phone: "0771234567", description: "Inverter is silent" },
      missing: ["system ID"],
      absent: ["phone number", "problem description"],
    },
    {
      body: { description: "Inverter is silent" },
      missing: ["phone number", "system ID"],
      absent: ["problem description"],
    },
  ];

  for (const item of cases) {
    const response = await postRequest(item.body);
    expect(response.status).toBe(400);
    const body = (await response.json()) as { requestId?: string; missing?: string[] };
    expect(body.requestId).toBeUndefined();
    expect(body.missing).toEqual(item.missing);
    expect(await requestCount()).toBe(0);

    const html = await screenHtml({ missing: body.missing });
    for (const field of item.missing) {
      expect(html).toContain(`Enter a ${field}.`);
    }
    for (const field of item.absent) {
      expect(html).not.toContain(`Enter a ${field}.`);
    }
  }
});

test("FIX-19 AC3: the confirmation shows the request id for the stored request", async () => {
  const response = await postRequest(valid);
  const body = (await response.json()) as { requestId: string };
  const html = await screenHtml({ requestId: body.requestId });
  expect(html).toContain("Request received");
  expect(html).toContain(`Request id ${body.requestId}`);
  expect(html).not.toContain("Log a problem");

  const stored = await storedRequest(body.requestId);
  expect(stored?.id).toBe(body.requestId);
});

test("FIX-19 AC4: a Saturday or Sunday submit is stored and is not rejected for office hours", async () => {
  const weekend = [
    new Date("2026-10-17T10:00:00.000Z"),
    new Date("2026-10-18T10:00:00.000Z"),
  ];
  const { setClock } = await import("./clock");

  for (const [index, createdAt] of weekend.entries()) {
    expect(createdAt.getUTCDay() === 6 || createdAt.getUTCDay() === 0).toBe(true);
    setClock(() => createdAt);
    const response = await postRequest({
      phone: `077200000${index}`,
      systemId: `SYS-WKND-${index}`,
      description: "No generation on the weekend",
    });
    expect(response.status).toBe(201);
    const body = await response.json();
    expectNotAnOfficeHoursOrDateRejection(body);
    const stored = await storedRequest(body.requestId);
    expect(stored?.id).toBe(body.requestId);
    expect(stored?.createdAt.toISOString()).toBe(createdAt.toISOString());
  }
});

test("FIX-19 AC5: a second open request for the same phone and system ID is a new row and the first is unchanged", async () => {
  const { setClock } = await import("./clock");
  const firstAt = new Date("2026-10-12T09:00:00.000Z");
  setClock(() => firstAt);
  const firstResponse = await postRequest({
    phone: "0773333333",
    systemId: "SYS-SAME",
    description: "First report",
  });
  const firstBody = (await firstResponse.json()) as { requestId: string };
  const snapshot = JSON.parse(JSON.stringify(await storedRequest(firstBody.requestId)));

  const secondAt = new Date("2026-10-13T09:00:00.000Z");
  setClock(() => secondAt);
  const secondResponse = await postRequest({
    phone: "0773333333",
    systemId: "SYS-SAME",
    description: "Second report",
  });
  expect(secondResponse.status).toBe(201);
  const secondBody = (await secondResponse.json()) as { requestId: string };
  expect(secondBody.requestId).not.toBe(firstBody.requestId);

  const firstAgain = JSON.parse(JSON.stringify(await storedRequest(firstBody.requestId)));
  expect(firstAgain).toEqual(snapshot);
  const second = await storedRequest(secondBody.requestId);
  expect(second?.description).toBe("Second report");
  expect(second?.createdAt.toISOString()).toBe(secondAt.toISOString());
  expect(second?.customer.phone).toBe("0773333333");
  expect(second?.system.systemId).toBe("SYS-SAME");
  expect(await requestCount()).toBe(2);
});

test("FIX-19 AC6: a system ID outside an existing set of 2000 is stored", async () => {
  const { getDb } = await import("./db");
  const db = getDb();
  const customers = [];
  const systems = [];
  const requests = [];
  for (let index = 0; index < 2000; index += 1) {
    const customerId = `customer-${index}`;
    const systemId = `SYS-EXISTING-${index}`;
    customers.push({ id: customerId, phone: `070${String(index).padStart(7, "0")}` });
    systems.push({ id: `system-${index}`, systemId });
    requests.push({
      id: `request-${index}`,
      customerId,
      systemId,
      description: "Existing request",
      source: "customer_form",
      critical: false,
      status: "not_assigned",
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      trackingTokenHash: `hash-${index}`,
    });
  }
  for (let offset = 0; offset < 2000; offset += 500) {
    await db.customer.createMany({ data: customers.slice(offset, offset + 500) });
    await db.system.createMany({ data: systems.slice(offset, offset + 500) });
    await db.serviceRequest.createMany({ data: requests.slice(offset, offset + 500) });
  }

  const response = await postRequest({
    phone: "0779999999",
    systemId: "SYS-NEW-2001",
    description: "A system FixFlow has not stored",
  });
  expect(response.status).toBe(201);
  const body = (await response.json()) as { requestId: string };
  const stored = await storedRequest(body.requestId);
  expect(stored).toMatchObject({
    description: "A system FixFlow has not stored",
    customer: { phone: "0779999999" },
    system: { systemId: "SYS-NEW-2001" },
  });
  expect(stored?.createdAt).toBeInstanceOf(Date);
  expect(await requestCount()).toBe(2001);
}, 60_000);

test("FIX-19 AC7: 1 December 2026 is stored and is not rejected for that date", async () => {
  const createdAt = new Date("2026-12-01T00:00:00.000Z");
  const { setClock } = await import("./clock");
  setClock(() => createdAt);

  const response = await postRequest({
    phone: "0771201001",
    systemId: "SYS-DEC-1",
    description: "Fault on 1 December",
  });
  expect(response.status).toBe(201);
  const body = await response.json();
  expectNotAnOfficeHoursOrDateRejection(body);
  const stored = await storedRequest(body.requestId);
  expect(stored?.id).toBe(body.requestId);
  expect(stored?.createdAt.toISOString()).toBe(createdAt.toISOString());
});

test("FIX-19 AC8: a request is stored when no Google Sheet and no WhatsApp API are available", async () => {
  const calls: unknown[] = [];
  vi.stubGlobal("fetch", (...args: unknown[]) => {
    calls.push(args);
    throw new Error("Google Sheet and WhatsApp API are unavailable");
  });

  const response = await postRequest(valid);
  expect(response.status).toBe(201);
  expect(calls).toEqual([]);
  const body = (await response.json()) as { requestId: string };
  const stored = await storedRequest(body.requestId);
  expect(stored?.id).toBe(body.requestId);
  expect(stored?.createdAt).toBeInstanceOf(Date);
});

test("FIX-19 AC9: name, site address, email, and photo may be omitted", async () => {
  const response = await postRequest(valid);
  expect(response.status).toBe(201);
  const body = await response.json();
  expectNotAnOfficeHoursOrDateRejection(body);
  const text = JSON.stringify(body).toLowerCase();
  expect(text).not.toContain("name");
  expect(text).not.toContain("email");
  expect(text).not.toContain("address");
  expect(text).not.toContain("photo");

  const stored = await storedRequest(body.requestId);
  expect(stored?.id).toBe(body.requestId);
  expect(stored?.createdAt).toBeInstanceOf(Date);
  expect(stored?.customer.name).toBeNull();
  expect(stored?.customer.email).toBeNull();
});

test("FIX-19 AC10: 30 November 2026 is stored and is not rejected for that date", async () => {
  const createdAt = new Date("2026-11-30T00:00:00.000Z");
  const { setClock } = await import("./clock");
  setClock(() => createdAt);

  const response = await postRequest({
    phone: "0771130001",
    systemId: "SYS-NOV-30",
    description: "Fault on 30 November",
  });
  expect(response.status).toBe(201);
  const body = await response.json();
  expectNotAnOfficeHoursOrDateRejection(body);
  const stored = await storedRequest(body.requestId);
  expect(stored?.id).toBe(body.requestId);
  expect(stored?.createdAt.toISOString()).toBe(createdAt.toISOString());
});

test("FIX-19 AC11: a request is stored and no email is sent when sheet, WhatsApp, and email are unavailable", async () => {
  const calls: unknown[] = [];
  vi.stubGlobal("fetch", (...args: unknown[]) => {
    calls.push(args);
    throw new Error("Google Sheet, WhatsApp API, and email delivery are unavailable");
  });

  const response = await postRequest({
    phone: "0771111111",
    systemId: "SYS-NO-EMAIL",
    description: "Store without email",
  });
  expect(response.status).toBe(201);
  expect(calls).toEqual([]);
  const body = await response.json();
  expect(JSON.stringify(body).toLowerCase()).not.toContain("email");
  const stored = await storedRequest(body.requestId);
  expect(stored?.id).toBe(body.requestId);
  expect(stored?.createdAt).toBeInstanceOf(Date);
});

test("FIX-19 AC12: a weekday submit is stored and is not rejected for office hours", async () => {
  const weekdays = [
    new Date("2026-10-12T08:00:00.000Z"),
    new Date("2026-10-13T08:00:00.000Z"),
    new Date("2026-10-14T08:00:00.000Z"),
    new Date("2026-10-15T08:00:00.000Z"),
    new Date("2026-10-16T08:00:00.000Z"),
  ];
  const { setClock } = await import("./clock");

  for (const [index, createdAt] of weekdays.entries()) {
    expect(createdAt.getUTCDay()).toBeGreaterThanOrEqual(1);
    expect(createdAt.getUTCDay()).toBeLessThanOrEqual(5);
    setClock(() => createdAt);
    const response = await postRequest({
      phone: `077500000${index}`,
      systemId: `SYS-DAY-${index}`,
      description: "Weekday fault",
    });
    expect(response.status).toBe(201);
    const body = await response.json();
    expectNotAnOfficeHoursOrDateRejection(body);
    const stored = await storedRequest(body.requestId);
    expect(stored?.id).toBe(body.requestId);
    expect(stored?.createdAt.toISOString()).toBe(createdAt.toISOString());
  }
});

test("FIX-19: overlapping first submits for a new phone each store a request", async () => {
  const phone = "0778181818";
  const responses = await Promise.all([
    postRequest({
      phone,
      systemId: "SYS-RACE",
      description: "First overlapping report",
    }),
    postRequest({
      phone,
      systemId: "SYS-RACE",
      description: "Second overlapping report",
    }),
  ]);

  expect(responses.map((response) => response.status)).toEqual([201, 201]);
  const bodies = (await Promise.all(responses.map((response) => response.json()))) as {
    requestId: string;
  }[];
  expect(bodies[0].requestId).not.toBe(bodies[1].requestId);

  const stored = await Promise.all(bodies.map((body) => storedRequest(body.requestId)));
  expect(stored.map((row) => row?.description).sort()).toEqual([
    "First overlapping report",
    "Second overlapping report",
  ]);
  expect(stored.every((row) => row?.customer.phone === phone)).toBe(true);
  expect(stored.every((row) => row?.system.systemId === "SYS-RACE")).toBe(true);
  expect(await requestCount()).toBe(2);

  const { getDb } = await import("./db");
  expect(await getDb().customer.count({ where: { phone } })).toBe(1);
  expect(await getDb().system.count({ where: { systemId: "SYS-RACE" } })).toBe(1);
});

test("FIX-19: a different system or a different phone still stores a new request", async () => {
  const { setClock } = await import("./clock");
  const firstAt = new Date("2026-10-12T09:00:00.000Z");
  setClock(() => firstAt);
  const firstResponse = await postRequest({
    phone: "0774242424",
    systemId: "SYS-ROOF-A",
    description: "Roof A",
  });
  const firstBody = (await firstResponse.json()) as { requestId: string };
  const snapshot = JSON.parse(JSON.stringify(await storedRequest(firstBody.requestId)));

  const secondAt = new Date("2026-10-12T10:00:00.000Z");
  setClock(() => secondAt);
  const otherRoof = await postRequest({
    phone: "0774242424",
    systemId: "SYS-ROOF-B",
    description: "Roof B",
  });
  expect(otherRoof.status).toBe(201);
  const otherRoofBody = (await otherRoof.json()) as { requestId: string };
  expect(otherRoofBody.requestId).not.toBe(firstBody.requestId);
  expect(JSON.parse(JSON.stringify(await storedRequest(firstBody.requestId)))).toEqual(snapshot);

  const otherRoofRow = await storedRequest(otherRoofBody.requestId);
  expect(otherRoofRow?.description).toBe("Roof B");
  expect(otherRoofRow?.customer.id).toBe(snapshot.customer.id);
  expect(otherRoofRow?.system.systemId).toBe("SYS-ROOF-B");

  const otherPhone = await postRequest({
    phone: "0774343434",
    systemId: "SYS-ROOF-A",
    description: "Other phone, roof A",
  });
  expect(otherPhone.status).toBe(201);
  const otherPhoneBody = (await otherPhone.json()) as { requestId: string };
  expect(JSON.parse(JSON.stringify(await storedRequest(firstBody.requestId)))).toEqual(snapshot);

  const otherPhoneRow = await storedRequest(otherPhoneBody.requestId);
  expect(otherPhoneRow?.customer.phone).toBe("0774343434");
  expect(otherPhoneRow?.customer.id).not.toBe(snapshot.customer.id);
  expect(otherPhoneRow?.system.id).toBe(snapshot.system.id);
  expect(await requestCount()).toBe(3);

  const { getDb } = await import("./db");
  expect(await getDb().customer.count()).toBe(2);
  expect(await getDb().system.count()).toBe(2);
});
