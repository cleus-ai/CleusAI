import { test, expect } from "@playwright/test";

test.describe("Billing Settings", () => {
  test("shows current plan", async ({ page }) => {
    await page.goto("/settings/billing");
    await expect(page.getByText("Current Plan")).toBeVisible();
  });

  test("shows upgrade options for free users", async ({ page }) => {
    await page.goto("/settings/billing");
    await expect(page.getByText("PRO")).toBeVisible();
    await expect(page.getByText("ENTERPRISE")).toBeVisible();
  });
});
