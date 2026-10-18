import { expect, test } from "@playwright/test";

test("home page shows the hero and every section", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Dinun Ranasinghe",
  );
  for (const id of [
    "about",
    "skills",
    "projects",
    "experience",
    "now",
    "contact",
  ]) {
    await expect(page.locator(`section#${id}`)).toBeAttached();
  }
});

test("navbar link scrolls to the projects section", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("navigation", { name: "Main" })
    .getByRole("link", { name: "Projects" })
    .click();
  await expect(page).toHaveURL(/#projects$/);
  await expect(page.locator("section#projects")).toBeInViewport();
});

test("contact call to action opens the mail app", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Say hello" })).toHaveAttribute(
    "href",
    /^mailto:/,
  );
});
