import { test, expect } from "@playwright/test"

test("TC-022: invalid login does not grant account access", async ({ page }) => {
  await page.goto("/dk/account")
  await page.getByTestId("email-input").fill("qa-invalid-playwright@example.test")
  await page.getByTestId("password-input").fill("Wrong-Local-QA-Password")
  await page.getByTestId("sign-in-button").click()
  await expect(page.getByTestId("login-error-message")).toContainText("Invalid email or password")
  await expect(page.getByTestId("logout-button")).not.toBeVisible()
})

test("TC-023: valid login and logout change account access", async ({ page }) => {
  const email = process.env.QA_TEST_EMAIL
  const password = process.env.QA_TEST_PASSWORD
  test.skip(!email || !password, "Set synthetic local QA credentials in .env.test.local (see tests/e2e/README.md)")
  await page.goto("/dk/account")
  await page.getByTestId("email-input").fill(email!)
  await page.getByTestId("password-input").fill(password!)
  await page.getByTestId("sign-in-button").click()
  const logout = page.getByTestId("logout-button").filter({ visible: true })
  await expect(logout).toBeVisible()
  await logout.click()
  await expect(page.getByTestId("login-page")).toBeVisible()
  await page.reload()
  await expect(page.getByTestId("login-page")).toBeVisible()
})
