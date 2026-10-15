export function trimmedText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function missingIntakeFields(input: {
  phone?: unknown;
  systemId?: unknown;
  description?: unknown;
}) {
  const missing: string[] = [];
  if (!trimmedText(input.phone)) {
    missing.push("phone number");
  }
  if (!trimmedText(input.systemId)) {
    missing.push("system ID");
  }
  if (!trimmedText(input.description)) {
    missing.push("problem description");
  }
  return missing;
}

export function missingFieldSentences(missing: string[]) {
  return missing.map((field) => `Enter a ${field}.`).join(" ");
}
