import { expect, test } from "@playwright/test";

test.describe("Enzo public experience", () => {
  test("landing page leads into the decision studio", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Enzo/);
    await expect(page.getByRole("heading", { name: /Borrow world-class judgment/i })).toBeVisible();
    await page.getByRole("link", { name: "Enter the Decision Studio" }).click();
    await expect(
      page.getByRole("heading", { name: /Your company, held in context/i }),
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

  test("founder completes the public decision workflow", async ({ page }) => {
    await page.goto("/home");
    await expect(
      page.getByRole("heading", { name: /Your company, held in context/i }),
    ).toBeVisible();
    await page.getByRole("link", { name: /Enter the Decision Room/i }).click();

    await expect(page.getByTestId("evidence-scan")).toContainText("verified");
    await expect(page.getByTestId("routed-council").locator("article")).toHaveCount(3);
    await expect(page.getByTestId("council-disagreement")).toContainText(/Material disagreement/i);

    await page
      .getByTestId("founder-rationale")
      .fill("This promise names the complete decision loop while keeping the audit as proof.");
    await page.getByTestId("record-decision").click();
    await expect(page.getByTestId("decision-confirmation")).toBeVisible();
    await page.getByRole("link", { name: "Open decision artifacts" }).click();

    await expect(page.getByRole("heading", { name: "Decision Memo" })).toBeVisible();
    await page.getByTestId("artifact-editor").fill("# Decision Memo\n\nEdited by the founder.");
    await page.getByTestId("save-artifact").click();
    await expect(page.getByTestId("save-artifact")).toHaveText("Revision saved");

    await page.goto("/ledger");
    await page.getByTestId("open-outcome-review").click();
    await page
      .getByLabel("Observed outcome")
      .fill("Five of eight founders completed the promise test.");
    await page
      .getByLabel("What did this teach you?")
      .fill("The decision loop is clearer than the audit category.");
    await page.getByTestId("save-outcome-review").click();
    await expect(page.getByText(/Outcome recorded\. This decision/i)).toBeVisible();
  });
});
