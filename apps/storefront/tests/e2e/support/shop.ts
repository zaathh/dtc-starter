import { expect, type Page } from "@playwright/test"

export const variantPath = "/dk/products/qa-20261026-001-variant"
export const categoryPath = "/dk/categories/qa-20261026-001"
export const coupon = "QA20261026TEN"

export async function selectWhiteMedium(page: Page) {
  await page.goto(variantPath)
  // Click the visible labels; the sr-only radio inputs are covered by them.
  await page.getByTestId("option-button").filter({ hasText: /^M$/ }).click()
  await page.getByTestId("option-button").filter({ hasText: /^White$/ }).click()
  await expect(page.getByRole("radio", { name: "M", exact: true })).toBeChecked()
  await expect(page.getByRole("radio", { name: "White", exact: true })).toBeChecked()
  await expect(page.getByTestId("product-price")).toContainText("€35.00")
  await expect(page).toHaveURL(/v_id=variant_01M5VE4CMV3WJZZZ25CHY43FA2/)
}

export async function addWhiteMedium(page: Page) {
  await selectWhiteMedium(page)
  await page.getByTestId("add-product-button").click()
  // Wait for the completed mutation, not an arbitrary sleep.
  await expect(page.getByRole("link", { name: "Cart (1)", exact: true })).toBeVisible()
  await page.goto("/dk/cart")
  await expect(page.getByTestId("product-row")).toHaveCount(1)
  await expect(page.getByTestId("product-variant")).toContainText("M / White")
  await expect(page.getByTestId("cart-subtotal")).toHaveText("€35.00")
}

export async function applyCoupon(page: Page) {
  await page.getByTestId("add-discount-button").click()
  await page.getByTestId("discount-input").fill(coupon)
  await page.getByTestId("discount-apply-button").click()
  await expect(page.getByTestId("cart-discount")).toContainText("€3.50")
  await expect(page.getByTestId("cart-total")).toHaveText("€31.50")
}
