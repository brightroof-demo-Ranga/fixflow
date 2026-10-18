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

test("FIX-19: a dropped connection does not confirm and the form can be submitted again", async ({
  page,
}) => {
  await page.route("**/api/requests", (route) => route.abort());
  await page.goto("/requests/new");
  await page.getByLabel("Phone number").fill("0771919191");
  await page.getByLabel("System ID").fill("SYS-NET-19");
  await page.getByLabel("Problem description").fill("Inverter is silent");

  const dropped = page.waitForRequest("**/api/requests");
  await page.getByRole("button", { name: "Submit request" }).click();
  await dropped;

  await expect(page.getByRole("heading", { name: "Request received" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Log a problem" })).toBeVisible();
  const alert = page.locator("p[role=alert]");
  await expect(alert).toHaveText("The request was not submitted. Try again.");
  await expect(alert).not.toContainText("Enter a phone number.");
  const submit = page.getByRole("button", { name: "Submit request" });
  await expect(submit).toBeEnabled();

  await page.unroute("**/api/requests");
  await submit.click();
  await expect(page.getByRole("heading", { name: "Request received" })).toBeVisible();
  await expect(page.getByText(/Request id [0-9a-f-]{36}/)).toBeVisible();
});

test("FIX-19: a server error does not name the submitted fields as missing", async ({ page }) => {
  await page.route("**/api/requests", (route) =>
    route.fulfill({ status: 500, contentType: "application/json", body: "{}" }),
  );
  await page.goto("/requests/new");
  await page.getByLabel("Phone number").fill("0771919192");
  await page.getByLabel("System ID").fill("SYS-ERR-19");
  await page.getByLabel("Problem description").fill("Inverter is silent");
  await page.getByRole("button", { name: "Submit request" }).click();

  const alert = page.locator("p[role=alert]");
  await expect(alert).toHaveText("The request was not submitted. Try again.");
  await expect(alert).not.toContainText("Enter a phone number.");
  await expect(page.getByRole("button", { name: "Submit request" })).toBeEnabled();
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
