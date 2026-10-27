import { test, expect } from "@playwright/test"
import { selectWhiteMedium } from "./support/shop"

test("TC-007: M/White selects the EUR 35 variant", async ({ page }) => {
  await selectWhiteMedium(page)
})

test("TC-009: stock-zero product cannot be added", async ({ page }) => {
  await page.goto("/dk/products/qa-20261026-001-zero-stock")
  await expect(page.getByTestId("product-availability")).toHaveText("Out of stock")
  await expect(page.getByTestId("add-product-button")).toBeDisabled()
})
