import { expect, test } from "@playwright/test";

test("CV button downloads a real PDF", async ({ page, request }) => {
  await page.goto("/");

  const cv = page.getByRole("link", { name: "CV", exact: true });
  await expect(cv).toHaveAttribute("download", "");

  const href = await cv.getAttribute("href");
  const response = await request.get(href!);
  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toContain("pdf");
});
