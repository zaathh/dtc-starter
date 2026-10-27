import { test, expect } from "@playwright/test"
import { categoryPath } from "./support/shop"

test("TC-003: exact-title search returns only the expected product", async ({ page }) => {
  await page.goto("/dk/search")
  await page.getByRole("searchbox", { name: "Search products" }).fill("QA Run Product 13")
  await page.getByRole("button", { name: "Search", exact: true }).click()
  await expect(page.getByText("1 product found", { exact: true })).toBeVisible()
  await expect(page.getByRole("link", { name: "QA Run Product 13 €13.00", exact: true })).toBeVisible()
  await expect(page.locator('a[href*="/products/qa-20261026-"]')).toHaveCount(1)
})

test("TC-004: unmatched search displays an empty state", async ({ page }) => {
  await page.goto("/dk/search")
  await page.getByRole("searchbox", { name: "Search products" }).fill("qa-playwright-no-match-20261027")
  await page.getByRole("button", { name: "Search", exact: true }).click()
  await expect(page.getByText("No products match your search. Try a different keyword.", { exact: true })).toBeVisible()
  await expect(page.getByRole("searchbox", { name: "Search products" })).toBeEditable()
})

test("TC-005: category prices follow both sort directions", async ({ page }) => {
  await page.goto(categoryPath)
  const prices = page.locator('a[href*="/products/qa-20261026-"]').getByTestId("price")
  await page.getByText("Price: Low -> High", { exact: true }).click()
  await expect(page).toHaveURL(/sortBy=price_asc/)
  await expect(prices).toHaveText(Array.from({ length: 12 }, (_, i) => `€${(i + 1).toFixed(2)}`))
  await page.getByText("Price: High -> Low", { exact: true }).click()
  await expect(page).toHaveURL(/sortBy=price_desc/)
  await expect(prices).toHaveText([45, 40, 20, 13, 12, 11, 10, 9, 8, 7, 6, 5].map(n => `€${n.toFixed(2)}`))
})

test("TC-002/006: category pagination covers the exact fixture membership", async ({ page }) => {
  await page.goto(categoryPath)
  const products = page.locator('a[href*="/products/qa-20261026-"]')
  await expect(products).toHaveCount(12)
  const first = await products.evaluateAll(elements => elements.map(e => e.getAttribute("href")))
  await page.getByRole("button", { name: "2", exact: true }).click()
  await expect(products).toHaveCount(4)
  const second = await products.evaluateAll(elements => elements.map(e => e.getAttribute("href")))
  const expected = [
    ...Array.from({ length: 13 }, (_, i) => `/dk/products/qa-20261026-001-item-${String(i + 1).padStart(2, "0")}`),
    "/dk/products/qa-20261026-001-variant",
    "/dk/products/qa-20261026-001-zero-stock",
    "/dk/products/qa-20261026-001-one-stock",
  ]
  expect([...first, ...second].sort()).toEqual(expected.sort())
})
