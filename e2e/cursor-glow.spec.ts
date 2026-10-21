import { expect, test } from "@playwright/test";

// the rest of the suite runs with reduced motion (see the intro step);
// the glow is switched off in that mode, so this spec opts back in
test.use({ reducedMotion: "no-preference" });

test("the light follows the mouse", async ({ page }) => {
  await page.goto("/");
  const glow = page.getByTestId("cursor-glow");

  // keep moving until the page has hydrated and the listener is attached
  await expect(async () => {
    await page.mouse.move(100, 100);
    await page.mouse.move(400, 300, { steps: 5 });
    await expect(glow).toHaveAttribute(
      "style",
      /at (39\d|40\d)(\.\d+)?px (29\d|30\d)(\.\d+)?px/,
      { timeout: 2000 },
    );
  }).toPass({ timeout: 15_000 });
});
