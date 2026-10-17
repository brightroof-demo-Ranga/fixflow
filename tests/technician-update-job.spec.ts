import { randomBytes, scryptSync } from "node:crypto";
import { execSync } from "node:child_process";
import { DatabaseSync } from "node:sqlite";
import { expect, test, type Page } from "@playwright/test";

test.use({ viewport: { width: 390, height: 844 } });

const databasePath = "prisma/dev.db";

test.beforeAll(() => {
  execSync("node ./node_modules/prisma/build/index.js migrate deploy", {
    cwd: process.cwd(),
    env: process.env,
    stdio: "pipe",
  });
});

test("FIX-23 AC1: On site and Remote diagnosis completed are visible at 390px and each save succeeds", async ({
  page,
}) => {
  const technician = seedTechnician("Ben Tech");
  const requestId = seedAssignedRequest(technician.id);

  await signIn(page, technician.email, technician.password);
  await page.goto(`/technician/jobs/${requestId}`);
  const onSite = page.getByRole("button", { name: "On site" });
  const remote = page.getByRole("button", { name: "Remote diagnosis completed" });
  await expect(onSite).toBeVisible();
  await expect(remote).toBeVisible();

  await onSite.click();
  await expect(page.getByRole("status")).toHaveText("Saved On site.");
  await remote.click();
  await expect(page.getByRole("status")).toHaveText("Saved Remote diagnosis completed.");
});

test("FIX-23 AC9: my jobs at 390px lists my request ids and omits another technician's", async ({ page }) => {
  const mine = seedTechnician("Ben Tech");
  const other = seedTechnician("Cara Tech");
  const mineId = seedAssignedRequest(mine.id);
  const otherId = seedAssignedRequest(other.id);

  await signIn(page, mine.email, mine.password);
  await page.goto("/technician/jobs");
  await expect(page.getByRole("link", { name: `Request ${mineId}` })).toBeVisible();
  await expect(page.getByRole("link", { name: `Request ${otherId}` })).toHaveCount(0);
});

test("FIX-23 AC10: a request reassigned to technician B is absent from technician A's jobs", async ({ page }) => {
  const technicianA = seedTechnician("Ben Tech");
  const technicianB = seedTechnician("Cara Tech");
  const requestId = seedAssignedRequest(technicianA.id);
  const db = openDb();
  const dispatcher = db.prepare("SELECT id FROM StaffUser WHERE role = 'dispatcher' LIMIT 1").get() as {
    id: string;
  };
  db.prepare(
    "UPDATE Assignment SET supersededAt = ? WHERE requestId = ? AND supersededAt IS NULL",
  ).run("2026-10-15T09:00:00.000Z", requestId);
  db.prepare(
    "INSERT INTO Assignment (id, requestId, technicianId, assignedById, assignedAt) VALUES (?, ?, ?, ?, ?)",
  ).run(
    crypto.randomUUID(),
    requestId,
    technicianB.id,
    dispatcher.id,
    "2026-10-15T09:00:00.000Z",
  );
  db.close();

  await signIn(page, technicianA.email, technicianA.password);
  await page.goto("/technician/jobs");
  await expect(page.getByRole("heading", { name: "Update jobs" })).toBeVisible();
  await expect(page.getByText(requestId)).toHaveCount(0);
});

async function signIn(page: Page, email: string, password: string) {
  await page.goto("/sign-in");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("heading", { name: "Update jobs" })).toBeVisible();
}

function openDb() {
  return new DatabaseSync(databasePath);
}

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("base64url");
  const hash = scryptSync(password, salt, 32).toString("base64url");
  return `scrypt:${salt}:${hash}`;
}

function seedTechnician(name: string) {
  const db = openDb();
  const id = crypto.randomUUID();
  const email = `${id}@brightroof.example`;
  const password = "job-pass";
  db.prepare(
    "INSERT INTO StaffUser (id, name, email, passwordHash, role) VALUES (?, ?, ?, ?, 'technician')",
  ).run(id, name, email, hashPassword(password));
  db.close();
  return { id, email, password };
}

function seedAssignedRequest(technicianId: string) {
  const db = openDb();
  let dispatcher = db.prepare("SELECT id FROM StaffUser WHERE role = 'dispatcher' LIMIT 1").get() as
    | { id: string }
    | undefined;
  if (!dispatcher) {
    const dispatcherId = crypto.randomUUID();
    db.prepare(
      "INSERT INTO StaffUser (id, name, email, passwordHash, role) VALUES (?, 'Ada Dispatch', ?, ?, 'dispatcher')",
    ).run(dispatcherId, `${dispatcherId}@brightroof.example`, hashPassword("unused-pass"));
    dispatcher = { id: dispatcherId };
  }

  const customerId = crypto.randomUUID();
  const systemKey = `SYS-${crypto.randomUUID()}`;
  const requestId = crypto.randomUUID();
  db.prepare("INSERT INTO Customer (id, phone) VALUES (?, ?)").run(
    customerId,
    `077${customerId.replaceAll("-", "").slice(0, 7)}`,
  );
  db.prepare("INSERT INTO System (id, systemId) VALUES (?, ?)").run(crypto.randomUUID(), systemKey);
  db.prepare(
    `INSERT INTO ServiceRequest (
      id, customerId, systemId, description, source, critical, status, createdAt, trackingTokenHash
    ) VALUES (?, ?, ?, 'Inverter is silent', 'customer_form', 0, 'assigned', ?, ?)`,
  ).run(requestId, customerId, systemKey, "2026-10-01T00:00:00.000Z", crypto.randomUUID());
  db.prepare(
    "INSERT INTO Assignment (id, requestId, technicianId, assignedById, assignedAt) VALUES (?, ?, ?, ?, ?)",
  ).run(
    crypto.randomUUID(),
    requestId,
    technicianId,
    dispatcher.id,
    "2026-10-15T08:00:00.000Z",
  );
  db.close();
  return requestId;
}
