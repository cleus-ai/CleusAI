import { test, expect } from "@playwright/test";

test.describe("Chat", () => {
  test.beforeEach(async ({ page }) => { await page.goto("/auth/login"); await page.fill("[name=email]", "demo@cleus.ai"); await page.fill("[name=password]", "DemoPass123!"); await page.click("[type=submit]"); await expect(page).toHaveURL("/chat"); });

  test("user can send a message", async ({ page }) => {
    await page.fill("[placeholder='Message Cleus...']", "Hello, Cleus!");
    await page.click("[aria-label='Send message']");
    await expect(page.getByText("Hello, Cleus!")).toBeVisible();
    await expect(page.locator(".assistant-message")).toBeVisible({ timeout: 30000 });
  });

  test("user can switch models", async ({ page }) => {
    await page.selectOption("select[aria-label='Model selector']", "gpt-4o");
    await expect(page.locator("select")).toHaveValue("gpt-4o");
  });

  test("user can create a new conversation", async ({ page }) => {
    await page.click("[aria-label='New Chat']");
    await expect(page.locator(".active-conversation")).toHaveText("New Chat");
  });
});
