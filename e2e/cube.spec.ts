import { expect, test } from "@playwright/test";

test("the cube loads when its section is scrolled into view", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("#playground").scrollIntoViewIfNeeded();

  await expect(
    page.locator('#playground canvas, [data-testid="cube-fallback"]').first(),
  ).toBeVisible({ timeout: 20_000 });
});
