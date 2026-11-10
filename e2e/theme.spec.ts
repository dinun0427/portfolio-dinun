import { expect, test } from "@playwright/test";

test("the theme picker changes the theme and remembers it", async ({
  page,
}) => {
  await page.goto("/");
  const dialog = page.getByRole("dialog", { name: "Choose a theme" });

  // retry the click until the page has hydrated
  await expect(async () => {
    await page.getByRole("button", { name: "Change theme" }).click();
    await expect(dialog).toBeVisible({ timeout: 1_000 });
  }).toPass({ timeout: 15_000 });

  await dialog.getByRole("button", { name: "Dracula", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dracula");
  await expect
    .poll(() =>
      page.evaluate(() => getComputedStyle(document.body).backgroundColor),
    )
    .toBe("rgb(40, 42, 54)");

  // still there after a reload, with no flash back to the default
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dracula");
  await expect
    .poll(() =>
      page.evaluate(() => getComputedStyle(document.body).backgroundColor),
    )
    .toBe("rgb(40, 42, 54)");
});
