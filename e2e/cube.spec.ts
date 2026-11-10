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

test("dragging the cube does not break the page", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("/");
  await page.locator("#playground").scrollIntoViewIfNeeded();
  const scene = page
    .locator('#playground canvas, [data-testid="cube-fallback"]')
    .first();
  await expect(scene).toBeVisible({ timeout: 20_000 });

  const canvas = page.locator("#playground canvas");
  test.skip((await canvas.count()) === 0, "no WebGL on this machine");

  const box = (await canvas.boundingBox())!;
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;

  // drag from a few places: background, middle, and either side of the middle
  for (const [x, y] of [
    [box.x + 20, box.y + 20],
    [cx, cy],
    [cx - box.width * 0.12, cy - box.height * 0.1],
    [cx + box.width * 0.12, cy + box.height * 0.1],
  ]) {
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x + 60, y + 25, { steps: 8 });
    await page.mouse.up();
  }

  await page.waitForTimeout(600);
  expect(errors).toEqual([]);
});

test("scramble then solve brings the cube back", async ({ page }) => {
  await page.goto("/");
  await page.locator("#playground").scrollIntoViewIfNeeded();
  await expect(
    page.locator('#playground canvas, [data-testid="cube-fallback"]').first(),
  ).toBeVisible({ timeout: 20_000 });
  test.skip(
    (await page.locator("#playground canvas").count()) === 0,
    "no WebGL here",
  );

  await page.getByRole("button", { name: "Scramble" }).click();
  const solve = page.getByRole("button", { name: "Solve" });
  await expect(solve).toBeEnabled({ timeout: 15_000 });
  await solve.click();
  await expect(page.getByText("Solved. Nice!")).toBeVisible({
    timeout: 15_000,
  });
});
