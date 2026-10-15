import { expect, test } from "@playwright/test";

test("FIX-19 AC2: the request screen names a missing phone number and system ID", async ({ page }) => {
  await page.goto("/requests/new");
  await page.getByLabel("Problem description").fill("Inverter is silent");
  await page.getByRole("button", { name: "Submit request" }).click();
  const alert = page.locator("p[role=alert]");
  await expect(alert).toContainText("Enter a phone number.");
  await expect(alert).toContainText("Enter a system ID.");
  await expect(alert).not.toContainText("Enter a problem description.");
  await expect(page.getByRole("heading", { name: "Request received" })).toHaveCount(0);
});

test("FIX-19 AC3: the confirmation shows the request id for that stored request", async ({ page }) => {
  await page.goto("/requests/new");
  await page.getByLabel("Phone number").fill("0771234567");
  await page.getByLabel("System ID").fill("SYS-E2E-19");
  await page.getByLabel("Problem description").fill("Inverter is silent");
  await page.getByRole("button", { name: "Submit request" }).click();
  await expect(page.getByRole("heading", { name: "Request received" })).toBeVisible();
  await expect(page.getByText(/Request id [0-9a-f-]{36}/)).toBeVisible();
});
