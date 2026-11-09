import { expect, test } from "@playwright/test";

test.use({ reducedMotion: "no-preference" });

test("the progress bar fills as the page scrolls", async ({ page }) => {
  await page.goto("/");
  const bar = page.getByTestId("scroll-progress");

  await page.mouse.wheel(0, 1500);

  // wait for hydration and the animation, then read the bar's width scale
  await expect
    .poll(
      () =>
        bar.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).a),
      { timeout: 10_000 },
    )
    .toBeGreaterThan(0.05);
});
