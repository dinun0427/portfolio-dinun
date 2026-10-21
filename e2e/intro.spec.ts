import { expect, test } from "@playwright/test";

// the rest of the suite runs with reduced motion; here we want the real intro
test.use({ reducedMotion: "no-preference" });

test("the signature plays, then reveals the site once per session", async ({
  page,
}) => {
  await page.goto("/");
  const intro = page.getByTestId("signature-intro");

  await expect(intro).toBeVisible();
  await expect(intro).toBeHidden({ timeout: 10_000 });

  await page.reload();
  await expect(page.getByTestId("signature-intro")).toBeHidden();
});

test("the intro can be skipped", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Skip" }).click();
  await expect(page.getByTestId("signature-intro")).toBeHidden();
});
