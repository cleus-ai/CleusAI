import { test, expect } from "@playwright/test";

test.describe("Image Generation", () => {
  test("generates an image from a prompt", async ({ page }) => {
    await page.goto("/image-gen");
    await page.fill("textarea[placeholder*='Describe']", "A futuristic city at night with neon lights");
    await page.click("button:has-text('Generate')");
    await expect(page.locator("img.generated")).toBeVisible({ timeout: 60000 });
  });
});
