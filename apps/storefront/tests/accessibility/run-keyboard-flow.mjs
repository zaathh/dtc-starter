import { chromium, expect } from "@playwright/test"
import { mkdir, writeFile } from "node:fs/promises"
import { execFileSync } from "node:child_process"
import { fileURLToPath } from "node:url"
import path from "node:path"

const app = fileURLToPath(new URL("../../", import.meta.url))
const root = path.resolve(app, "../..")
const run = process.argv[2]
const directCartEntry = process.argv.includes("--direct-cart-entry")
if (!/^RUN-A11Y-\d{8}-\d{3}$/.test(run || "")) throw new Error("Provide new run ID")
process.loadEnvFile(path.join(app, ".env.test.local"))
const password = process.env.QA_TEST_PASSWORD
const email = process.env.QA_TEST_EMAIL
if (!password || !email) throw new Error("Existing synthetic account required")
const output = path.join(root, "docs/qa/reports", run)
await mkdir(output, { recursive: false })
const results = { runId: run, at: new Date().toISOString(),
  applicationCommit: execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim(),
  executor: "AI-authored Playwright keyboard-event automation; no pointer clicks, forced focus, fill or screen-reader verification",
  runtime: "Local development server; UI and focus may differ from the production baseline",
  directCartEntry,
  viewport: { width: 1440, height: 900 }, steps: [], observations: [], status: "running", orders: [] }
const browser = await chromium.launch()
const context = await browser.newContext({ viewport: results.viewport })
const page = await context.newPage()
results.browser = browser.version()
page.setDefaultTimeout(20_000)

async function checkpoint(name) {
  await page.screenshot({ path: path.join(output, name + ".png"), fullPage: true })
  await writeFile(path.join(output, name + ".txt"), await page.locator("body").ariaSnapshot())
  results.steps.push({ name, url: page.url(), focus: await page.evaluate(() => {
    const element = document.activeElement
    return { tag: element.tagName, testId: element.getAttribute("data-testid"),
      name: element.getAttribute("name"), text: element.tagName === "INPUT" ? "[input]" : element.textContent.trim().slice(0, 90) }
  }) })
}

async function tabTo(selector) {
  for (let count = 0; count < 160; count++) {
    if (await page.evaluate(selector => document.activeElement?.matches(selector), selector)) return
    await page.keyboard.press("Tab")
  }
  throw new Error("Keyboard Tab could not reach " + selector)
}

async function typeInto(testId, value) {
  await tabTo(`[data-testid="${testId}"]`)
  await page.keyboard.press("ControlOrMeta+A")
  await page.keyboard.type(value)
}

try {
  await page.goto("http://localhost:8000/dk/products/qa-20261026-001-variant")
  await tabTo('input[type="radio"][value="S"]')
  await page.keyboard.press("ArrowRight")
  await expect(page.getByRole("radio", { name: "M", exact: true })).toBeChecked()
  await tabTo('input[type="radio"][value="Black"]')
  await page.keyboard.press("ArrowRight")
  await expect(page.getByRole("radio", { name: "White", exact: true })).toBeChecked()
  await expect(page.getByTestId("product-price")).toContainText("€35.00")
  await tabTo('[data-testid="add-product-button"]')
  await page.keyboard.press("Enter")
  await expect(page.getByTestId("nav-cart-link")).toHaveText("Cart (1)")
  await checkpoint("product-added")
  if (directCartEntry) {
    results.observations.push("Cart was opened by direct URL as a separate task entry. Product-to-cart navigation is bypassed and is not passed by this run.")
    await page.goto("http://localhost:8000/dk/cart")
  } else {
  await tabTo('[data-testid="nav-cart-link"]')
  await page.keyboard.press("Enter")
  try {
    await expect(page).toHaveURL(/\/dk\/cart$/, { timeout: 3000 })
  } catch {
    results.observations.push("Enter on the nested header Cart link did not navigate. Attempting the popover Go to cart action; a workaround does not pass the header link.")
    await checkpoint("header-cart-enter-no-navigation")
    await tabTo('[data-testid="go-to-cart-button"]')
    await page.keyboard.press("Enter")
  }
  }
  await expect(page).toHaveURL(/\/dk\/cart$/)
  await expect(page.getByTestId("cart-total")).toHaveText("€35.00")
  // A popover opened by the header interaction can remain open after navigation.
  await page.keyboard.press("Escape")
  await checkpoint("cart-after-escape")
  await tabTo('a[href*="/checkout"]')
  await page.keyboard.press("Enter")
  await expect(page.getByTestId("shipping-first-name-input")).toBeVisible()
  await tabTo('[data-testid="submit-address-button"]')
  await page.keyboard.press("Enter")
  await expect(page.getByTestId("shipping-first-name-input")).toBeFocused()
  await checkpoint("required-address-error")
  for (const [id, value] of [
    ["shipping-first-name-input", "QA"], ["shipping-last-name-input", "Keyboard"],
    ["shipping-address-input", "2 Fictional QA Street"], ["shipping-postal-code-input", "2100"],
    ["shipping-city-input", "Copenhagen"], ["shipping-email-input", `qa-keyboard-${Date.now()}@example.test`],
  ]) await typeInto(id, value)
  await tabTo('[data-testid="shipping-country-select"]')
  await page.keyboard.press("Home")
  await page.keyboard.press("d")
  await expect(page.getByTestId("shipping-country-select")).toHaveValue("dk")
  await tabTo('[data-testid="submit-address-button"]')
  await page.keyboard.press("Enter")
  await expect(page.getByRole("radio", { name: "Standard Shipping €10.00", exact: true })).toBeVisible()
  await tabTo('[role="radio"]')
  await page.keyboard.press("Space")
  await expect(page.getByTestId("cart-total")).toHaveText("€45.00")
  await tabTo('[data-testid="submit-delivery-option-button"]')
  await page.keyboard.press("Enter")
  await expect(page.getByRole("radio", { name: /Manual Payment/ })).toBeVisible()
  await tabTo('[role="radio"]')
  await page.keyboard.press("Space")
  await tabTo('[data-testid="submit-payment-button"]')
  await page.keyboard.press("Enter")
  await expect(page.getByTestId("submit-order-button")).toBeVisible()
  await checkpoint("checkout-review")
  await tabTo('[data-testid="submit-order-button"]')
  await page.keyboard.press("Enter")
  await expect(page).toHaveURL(/\/order\/order_[^/]+\/confirmed$/)
  await expect(page.getByTestId("cart-total")).toHaveText("€45.00")
  results.orders.push({ url: page.url(), total: 45, simulated: true })
  await checkpoint("order-confirmation")
  // Account is a separate declared task entry, not a claimed keyboard navigation path.
  await page.goto("http://localhost:8000/dk/account")
  await typeInto("email-input", email)
  await typeInto("password-input", password)
  await tabTo('[data-testid="sign-in-button"]')
  await page.keyboard.press("Enter")
  await expect(page.getByTestId("login-page")).not.toBeVisible()
  await checkpoint("account-signed-in")
  await tabTo('[data-testid="logout-button"]')
  await page.keyboard.press("Enter")
  await expect(page.getByTestId("login-page")).toBeVisible()
  await checkpoint("account-signed-out")
  results.status = "completed"
} catch (error) {
  results.status = "incomplete"
  results.error = error.message.replaceAll(password, "[REDACTED]")
  await checkpoint("blocked")
  process.exitCode = 1
} finally {
  await writeFile(path.join(output, "MANIFEST.json"), JSON.stringify(results, null, 2) + "\n")
  // Never save input values/passwords in snapshots intentionally; verify artifacts before publishing.
  await browser.close()
}
console.log(JSON.stringify({ status: results.status, steps: results.steps.map(step => step.name), error: results.error }))
