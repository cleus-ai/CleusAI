import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("user can register a new account", async ({ page }) => {
    await page.goto("/auth/register");
    await page.fill("[name=email]", `test-${Date.now()}@cleus.ai`);
    await page.fill("[name=username]", `testuser${Date.now()}`);
    await page.fill("[name=password]", "SecurePass123!");
    await page.click("[type=submit]");
    await expect(page).toHaveURL("/chat");
  });

  test("user can log in", async ({ page }) => {
    await page.goto("/auth/login");
    await page.fill("[name=email]", "demo@cleus.ai");
    await page.fill("[name=password]", "DemoPass123!");
    await page.click("[type=submit]");
    await expect(page).toHaveURL("/chat");
  });

  test("shows error on invalid credentials", async ({ page }) => {
    await page.goto("/auth/login");
    await page.fill("[name=email]", "wrong@example.com");
    await page.fill("[name=password]", "wrongpassword");
    await page.click("[type=submit]");
    await expect(page.getByText("Invalid credentials")).toBeVisible();
  });
});
