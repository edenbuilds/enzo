import { expect, test } from "@playwright/test";

test.describe("Enzo public experience", () => {
  test("landing page leads into an audit", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Enzo/);
    await expect(page.getByRole("heading", { name: /Interrogate the experience/i })).toBeVisible();
    await page.getByRole("link", { name: "Start an audit" }).click();
    await expect(
      page.getByRole("heading", { name: /Begin with what can be observed/i }),
    ).toBeVisible();
  });

  test("intake reaches the evidence-backed report", async ({ page }) => {
    await page.goto("/audit/new");
    await page.getByTestId("audit-target").fill("https://example.com");
    await page.getByTestId("start-audit").click();
    await expect(page).toHaveURL(/projects\/demo/);
    await expect(
      page.getByRole("heading", { name: /The experience has earned attention/i }),
    ).toBeVisible();
    await expect(page.getByText(/% confidence/).first()).toBeVisible();
  });

  test("adaptive interview produces a Vision Brief", async ({ page }) => {
    await page.goto("/projects/demo/interview");
    await page.getByText("Earn institutional trust").click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByText("Category challenger").click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("link", { name: "Read the Vision Brief" }).click();
    await expect(
      page.getByRole("heading", { name: /Make the product immediately legible/i }),
    ).toBeVisible();
  });

  test("has no obvious keyboard focus trap on the home page", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    await expect(page.locator(":focus")).toBeVisible();
  });
});
