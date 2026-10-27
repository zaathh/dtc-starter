import { test, expect } from "@playwright/test"

test("TC-025 / BUG-001: Customer Service should reach a usable destination", async ({ page }) => {
  test.info().annotations.push({ type: "issue", description: "docs/qa/bug-reports/BUG-001-customer-service-link-404.md" })
  await page.goto("/dk/account")
  await page.getByRole("link", { name: "Customer Service", exact: true }).click()
  await expect(page).toHaveURL(/\/dk\/customer-service$/)
  await expect(page.getByRole("heading").first()).toBeVisible()
  // Navigation/setup errors must fail normally, not be masked by this annotation.
  test.fail(true, "BUG-001 is open: account Customer Service currently renders 404")
  // Assert the desired behavior; this must fail while BUG-001 remains open.
  await expect(page.getByRole("heading", { name: "Page not found", exact: true })).not.toBeVisible()
})

test("RSP-001 / BUG-002: open navigation menu stays within viewport", async ({ page }, testInfo) => {
  test.info().annotations.push({ type: "issue", description: "docs/qa/bug-reports/BUG-002-mobile-menu-overflow.md" })
  await page.goto("/dk")
  await page.getByRole("button", { name: "Menu", exact: true }).click()
  const menu = page.getByTestId("nav-menu-popup")
  await expect(menu).toBeVisible()
  // Wait for transitions using browser animations, not a fixed sleep.
  await menu.evaluate(async element => {
    await Promise.all(element.getAnimations({ subtree: true }).map(animation => animation.finished))
  })
  const geometry = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
  }))
  test.fail(testInfo.project.name === "mobile", "BUG-002 is open at mobile width: 8 px menu overflow")
  expect(geometry.document).toBeLessThanOrEqual(geometry.viewport)
})
