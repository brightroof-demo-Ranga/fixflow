import { NextResponse } from "next/server";
import { createPublicRequest } from "@/lib/requests";

export async function POST(request: Request) {
  let body: PublicBody = {};
  try {
    const parsed = (await request.json()) as unknown;
    if (typeof parsed === "object" && parsed !== null) {
      body = parsed as PublicBody;
    }
  } catch {
    body = {};
  }

  const result = await createPublicRequest({
    phone: body.phone,
    systemId: body.systemId,
    description: body.description,
    name: body.name,
    email: body.email,
    siteAddress: body.siteAddress,
    photo: body.photo,
  });

  if (!result.ok) {
    return NextResponse.json({ missing: result.missing }, { status: 400 });
  }

  return NextResponse.json(
    { requestId: result.requestId, trackingToken: result.trackingToken },
    { status: 201 },
  );
}

type PublicBody = {
  phone?: unknown;
  systemId?: unknown;
  description?: unknown;
  name?: unknown;
  email?: unknown;
  siteAddress?: unknown;
  photo?: unknown;
};
