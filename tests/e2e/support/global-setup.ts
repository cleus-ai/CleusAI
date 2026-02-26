import { chromium } from "@playwright/test";
export default async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  // Seed test user if not exists
  await page.request.post("http://localhost:8080/api/auth/register", { data: { email: "demo@cleus.ai", username: "demouser", password: "DemoPass123!" } }).catch(() => {});
  await browser.close();
}
