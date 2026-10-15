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
const requestMarkers = ["systemId", "trackingToken", "customerPhone", "service-request"];

let databaseDir: string;

beforeAll(async () => {
  databaseDir = await mkdtemp(path.join(tmpdir(), "fixflow-"));
  const databaseFile = path.join(databaseDir, "test.db").replaceAll("\\", "/");
  process.env.DATABASE_URL = `file:${databaseFile}`;
  execSync("node ./node_modules/prisma/build/index.js migrate deploy", {
    cwd: root,
    env: process.env,
    stdio: "pipe",
  });
}, 60_000);

beforeEach(async () => {
  const { getDb, resetDb } = await import("./db");
  await resetDb();
  const db = getDb();
  await db.session.deleteMany();
  await db.staffUser.deleteMany();
});

afterAll(async () => {
  const { resetDb } = await import("./db");
  await resetDb();
  await rm(databaseDir, { recursive: true, force: true });
});

type StaffRole = "dispatcher" | "technician" | "ops_manager";

const roleScreens = {
  dispatcher: { path: "/dispatch", title: "Assign jobs" },
  technician: { path: "/technician/jobs", title: "Update jobs" },
  ops_manager: { path: "/ops/open-jobs", title: "Open jobs" },
} as const;

function expectNoRequestData(value: string) {
  for (const marker of requestMarkers) {
    expect(value).not.toContain(marker);
  }
}

async function createStaff(role: StaffRole, email: string, name: string) {
  const { hashPassword } = await import("./password");
  const { getDb } = await import("./db");
  await getDb().staffUser.create({
    data: {
      id: crypto.randomUUID(),
      name,
      email,
      passwordHash: await hashPassword("secret-pass"),
      role,
    },
  });
}

async function postSignIn(email: string, password: string) {
  const { POST } = await import("../app/api/session/route");
  return POST(
    new Request("http://localhost/api/session", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    }),
  );
}

function sessionTokenFrom(response: Response) {
  const header = response.headers.get("set-cookie") ?? "";
  const match = header.match(/fixflow_session=([^;]*)/);
  if (!match || match[1] === "") {
    return null;
  }
  return decodeURIComponent(match[1]);
}

async function screenHtml(
  staffPath: "/dispatch" | "/technician/jobs" | "/ops/open-jobs",
  token: string | null,
) {
  const { renderStaffScreen } = await import("./staff-screen");
  return renderToStaticMarkup(await renderStaffScreen(staffPath, token));
}

test("FIX-16 AC1: matching staff email and password opens the role screen", async () => {
  const people = [
    { role: "dispatcher" as const, email: "ada@brightroof.example", name: "Ada Dispatch" },
    { role: "technician" as const, email: "ben@brightroof.example", name: "Ben Tech" },
    { role: "ops_manager" as const, email: "cam@brightroof.example", name: "Cam Ops" },
  ];

  for (const person of people) {
    await createStaff(person.role, person.email, person.name);
    const response = await postSignIn(person.email, "secret-pass");
    expect(response.status).toBe(200);
    const setCookie = response.headers.get("set-cookie") ?? "";
    expect(setCookie.toLowerCase()).toContain("httponly");
    const token = sessionTokenFrom(response);
    expect(token).toBeTruthy();

    const body = await response.json();
    expect(body).toEqual({ role: person.role, name: person.name });
    expectNoRequestData(JSON.stringify(body));

    const { getDb } = await import("./db");
    const stored = await getDb().session.findMany();
    expect(stored.some((session) => session.tokenHash === token)).toBe(false);
    expect(JSON.stringify(stored)).not.toContain(token);

    const screen = roleScreens[person.role];
    const html = await screenHtml(screen.path, token);
    expect(html).toContain(screen.title);
    expect(html).not.toContain(">Sign in<");
    expectNoRequestData(html);
  }
});

test("FIX-16 AC2: a staff screen with no session shows sign-in and no request data", async () => {
  const { loadStaffView } = await import("./staff-screen");
  for (const staffPath of ["/dispatch", "/technician/jobs"] as const) {
    expect(await loadStaffView(staffPath, null)).toEqual({ screen: "sign-in" });
    const html = await screenHtml(staffPath, null);
    expect(html).toContain(">Sign in<");
    expect(html).toContain("Email");
    expect(html).toContain("Password");
    expect(html).not.toContain("Assign jobs");
    expect(html).not.toContain("Update jobs");
    expectNoRequestData(html);
  }
});

test("FIX-16 AC3: sign-out then a staff screen shows sign-in and no request data", async () => {
  await createStaff("dispatcher", "ada@brightroof.example", "Ada Dispatch");
  const signedIn = await postSignIn("ada@brightroof.example", "secret-pass");
  const token = sessionTokenFrom(signedIn);
  expect(token).toBeTruthy();

  const { DELETE } = await import("../app/api/session/route");
  const signedOut = await DELETE(
    new Request("http://localhost/api/session", {
      method: "DELETE",
      headers: { cookie: `fixflow_session=${token}` },
    }),
  );
  expect(signedOut.status).toBe(200);
  const signedOutBody = await signedOut.json();
  expect(signedOutBody).toEqual({ signedIn: false });
  expectNoRequestData(JSON.stringify(signedOutBody));
  const cleared = signedOut.headers.get("set-cookie") ?? "";
  expect(cleared.toLowerCase()).toContain("httponly");
  expect(cleared).toMatch(/Max-Age=0/i);

  const { getDb } = await import("./db");
  expect(await getDb().session.count()).toBe(0);

  for (const staffPath of ["/dispatch", "/technician/jobs"] as const) {
    const html = await screenHtml(staffPath, token);
    expect(html).toContain(">Sign in<");
    expect(html).not.toContain("Assign jobs");
    expect(html).not.toContain("Update jobs");
    expectNoRequestData(html);
  }
});

test("FIX-16 AC4: credentials that match no staff user create no session and no request data", async () => {
  await createStaff("technician", "ben@brightroof.example", "Ben Tech");
  const attempts = [
    { email: "ben@brightroof.example", password: "wrong-pass" },
    { email: "nobody@brightroof.example", password: "secret-pass" },
  ];

  for (const attempt of attempts) {
    const response = await postSignIn(attempt.email, attempt.password);
    expect(response.status).toBe(401);
    expect(response.headers.get("set-cookie")).toBeNull();
    const body = await response.json();
    expect(body).toEqual({ error: "Sign-in failed" });
    expectNoRequestData(JSON.stringify(body));
  }

  const { getDb } = await import("./db");
  expect(await getDb().session.count()).toBe(0);
});
