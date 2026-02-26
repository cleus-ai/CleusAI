import { test, expect } from "@playwright/test";

test.describe("Profile Settings", () => {
  test("can update username", async ({ page }) => {
    await page.goto("/settings/profile");
    await page.fill("[name=username]", "newusername");
    await page.click("button:has-text('Save Changes')");
    await expect(page.getByText("Profile updated")).toBeVisible();
  });
});
