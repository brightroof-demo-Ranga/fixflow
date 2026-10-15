import { NextResponse } from "next/server";
import { verifyPassword } from "@/lib/password";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  createSession,
  deleteSession,
  findStaffByEmail,
} from "@/lib/session";
import { isStaffRole } from "@/lib/staff-paths";

function sessionCookie(value: string, maxAge: number) {
  return {
    name: SESSION_COOKIE,
    value,
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge,
  };
}

function readCookie(header: string | null, name: string) {
  if (!header) {
    return null;
  }
  for (const part of header.split(";")) {
    const separator = part.indexOf("=");
    if (separator === -1) {
      continue;
    }
    const key = part.slice(0, separator).trim();
    if (key !== name) {
      continue;
    }
    const value = decodeURIComponent(part.slice(separator + 1).trim());
    return value === "" ? null : value;
  }
  return null;
}

export async function POST(request: Request) {
  let email = "";
  let password = "";
  try {
    const body = (await request.json()) as { email?: unknown; password?: unknown };
    email = typeof body.email === "string" ? body.email : "";
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Sign-in failed" }, { status: 401 });
  }

  const staff = await findStaffByEmail(email);
  const passwordMatches = staff !== null && (await verifyPassword(password, staff.passwordHash));
  if (!staff || !passwordMatches || !isStaffRole(staff.role)) {
    return NextResponse.json({ error: "Sign-in failed" }, { status: 401 });
  }

  const token = await createSession(staff.id);
  const response = NextResponse.json({ role: staff.role, name: staff.name });
  response.cookies.set(sessionCookie(token, SESSION_MAX_AGE_SECONDS));
  return response;
}

export async function DELETE(request: Request) {
  await deleteSession(readCookie(request.headers.get("cookie"), SESSION_COOKIE));
  const response = NextResponse.json({ signedIn: false });
  response.cookies.set(sessionCookie("", 0));
  return response;
}
