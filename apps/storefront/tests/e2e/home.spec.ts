import { test, expect } from "@playwright/test"

test("TC-001: homepage displays the main heading", async ({ page }) => {
  await page.goto("/dk")
  await expect(
    page.getByRole("heading", { name: "Ecommerce Starter Template", exact: true })
  ).toBeVisible()
})

test("TC-001: navigation menu opens and closes", async ({ page }) => {
  await page.goto("/dk")
  await page.getByRole("button", { name: "Menu", exact: true }).click()
  await expect(page.getByTestId("nav-menu-popup").getByRole("link", { name: "Account", exact: true })).toBeVisible()
  await page.getByRole("button", { name: "Close menu", exact: true }).click()
  await expect(page.getByRole("button", { name: "Menu", exact: true })).toHaveAttribute(
    "aria-expanded", "false"
  )
})

test("TC-008: missing product provides a usable not-found page", async ({ page }) => {
  const response = await page.goto("/dk/products/qa-20261026-001-missing")
  expect(response?.status()).toBe(404)
  await expect(page.getByRole("heading", { name: "Page not found", exact: true })).toBeVisible()
  await expect(page.getByRole("link", { name: "Go to frontpage", exact: true })).toBeVisible()
})
