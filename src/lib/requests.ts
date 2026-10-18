import { createHash, randomBytes } from "node:crypto";
import { now } from "./clock";
import { getDb } from "./db";
import { missingIntakeFields, trimmedText } from "./request-fields";

export type PublicRequestInput = {
  phone?: unknown;
  systemId?: unknown;
  description?: unknown;
  name?: unknown;
  email?: unknown;
  siteAddress?: unknown;
  photo?: unknown;
};

export async function createPublicRequest(input: PublicRequestInput) {
  const missing = missingIntakeFields(input);
  if (missing.length > 0) {
    return { ok: false as const, missing };
  }

  const phone = trimmedText(input.phone);
  const systemId = trimmedText(input.systemId);
  const description = trimmedText(input.description);
  const name = trimmedText(input.name) || null;
  const email = trimmedText(input.email) || null;
  const trackingToken = randomBytes(32).toString("base64url");
  const trackingTokenHash = createHash("sha256").update(trackingToken).digest("hex");
  const createdAt = now();

  const requestId = await getDb().$transaction(async (tx) => {
    const customer = await tx.customer.upsert({
      where: { phone },
      create: {
        id: crypto.randomUUID(),
        phone,
        name,
        email,
      },
      update: {},
    });

    await tx.system.upsert({
      where: { systemId },
      create: {
        id: crypto.randomUUID(),
        systemId,
      },
      update: {},
    });

    const id = crypto.randomUUID();
    await tx.serviceRequest.create({
      data: {
        id,
        customerId: customer.id,
        systemId,
        description,
        source: "customer_form",
        critical: false,
        status: "not_assigned",
        createdAt,
        trackingTokenHash,
      },
    });
    return id;
  });

  return {
    ok: true as const,
    requestId,
    trackingToken,
    createdAt,
  };
}
