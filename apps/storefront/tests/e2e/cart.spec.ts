import { test, expect } from "@playwright/test"
import { addWhiteMedium, coupon } from "./support/shop"

test("TC-011–015: cart supports add, quantity, reload, and removal", async ({ page }) => {
  await test.step("Verify a new browser context starts with an empty cart", async () => {
    await page.goto("/dk/cart")
    await expect(page.getByText("You don't have anything in your cart.", { exact: false })).toBeVisible()
  })
  await test.step("Add M/White and independently check EUR 35 x 2 = EUR 70", async () => {
    await addWhiteMedium(page)
    await page.getByTestId("product-select-button").selectOption("2")
    await expect(page.getByTestId("cart-subtotal")).toHaveText("€70.00")
    await expect(page.getByTestId("cart-total")).toHaveText("€70.00")
  })
  await test.step("Reload and verify the same variant, quantity and amount", async () => {
    await page.reload()
    await expect(page.getByTestId("product-select-button")).toHaveValue("2")
    await expect(page.getByTestId("product-variant")).toContainText("M / White")
    await expect(page.getByTestId("cart-subtotal")).toHaveText("€70.00")
  })
  await test.step("Remove the item and verify the empty state", async () => {
    // The existing DeleteButton does not forward its data-testid prop.
    await page.getByTestId("product-row").getByRole("button").click()
    await expect(page.getByText("You don't have anything in your cart.", { exact: false })).toBeVisible()
  })
})

test("TC-016/017: invalid coupon is rejected and valid coupon calculates 10 percent", async ({ page }) => {
  await addWhiteMedium(page)
  await page.getByTestId("add-discount-button").click()
  await page.getByTestId("discount-input").fill("QA20261026INVALID")
  await page.getByTestId("discount-apply-button").click()
  await expect(page.getByTestId("discount-error-message")).toContainText("invalid")
  await expect(page.getByTestId("cart-total")).toHaveText("€35.00")
  await page.getByTestId("discount-input").fill(coupon)
  await page.getByTestId("discount-apply-button").click()
  await expect(page.getByTestId("cart-discount")).toContainText("€3.50")
  await expect(page.getByTestId("cart-total")).toHaveText("€31.50")
})
