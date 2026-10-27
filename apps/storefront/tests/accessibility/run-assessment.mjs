import AxeBuilder from "@axe-core/playwright"
import { chromium, expect } from "@playwright/test"
import { readFile, writeFile, mkdir } from "node:fs/promises"
import { existsSync } from "node:fs"
import { execFileSync } from "node:child_process"
import { createHash } from "node:crypto"
import path from "node:path"
import { fileURLToPath } from "node:url"

const app = fileURLToPath(new URL("../../", import.meta.url))
const root = path.resolve(app, "../..")
const runId = process.argv[2]
if (!/^RUN-A11Y-\d{8}-\d{3}$/.test(runId || "")) throw new Error("Provide RUN-A11Y-YYYYMMDD-NNN")
const output = path.join(root, "docs/qa/reports", runId)
const origin = "http://localhost:8000"
const buildId = (await readFile(path.join(app, ".next/BUILD_ID"), "utf8")).trim()
const credentialsFile = path.join(app, ".env.test.local")
if (existsSync(credentialsFile)) process.loadEnvFile(credentialsFile)
const email = process.env.QA_TEST_EMAIL
const password = process.env.QA_TEST_PASSWORD
if (!email || !password) throw new Error("Synthetic credentials required in ignored .env.test.local")
const adapter = JSON.parse(await readFile(path.join(app, "node_modules/@axe-core/playwright/package.json"), "utf8"))
const tags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]
const profiles = [{ name: "desktop", width: 1440, height: 900 }, { name: "mobile", width: 390, height: 844 }]
const states = ["home", "menu-open", "catalog", "search-empty", "product", "variant-selected",
  "cart-empty", "cart-filled", "cart-invalid-coupon", "checkout-address", "checkout-required-error",
  "checkout-delivery", "checkout-payment", "checkout-review", "order-confirmation",
  "account-login", "account-error", "account-signed-in", "account-signed-out"]
await mkdir(output, { recursive: false })
await mkdir(path.join(output, "automated"))
const manifest = {
  runId, startedAt: new Date().toISOString(), status: "running",
  applicationCommit: execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim(),
  branch: execFileSync("git", ["branch", "--show-current"], { cwd: root, encoding: "utf8" }).trim(),
  runnerSha256: createHash("sha256").update(await readFile(fileURLToPath(import.meta.url))).digest("hex"),
  buildId, adapter: adapter.version, node: process.version, tags, profiles, plannedStates: states,
  scope: "WCAG-tagged axe checks on selected page states; no rule suppression or node exclusions",
  executor: "AI-assisted browser automation; not human or screen-reader validation",
  data: "Existing QA M/White fixture, synthetic customer, fictional DK address, manual payment only",
  scans: [], errors: [], orders: [], observations: [],
}
const save = () => writeFile(path.join(output, "MANIFEST.json"), JSON.stringify(manifest, null, 2) + "\n")
await save()

async function scan(page, profile, state) {
  const result = await new AxeBuilder({ page }).withTags(tags).analyze()
  const name = `${profile}-${state}`
  await writeFile(path.join(output, "automated", name + ".json"), JSON.stringify(result, null, 2) + "\n")
  await writeFile(path.join(output, "automated", name + ".txt"), await page.locator("body").ariaSnapshot())
  await page.screenshot({ path: path.join(output, "automated", name + ".png"), fullPage: true })
  const row = { profile, state, at: result.timestamp, url: page.url(), engine: result.testEngine,
    violations: result.violations.length, violationNodes: result.violations.reduce((n, r) => n + r.nodes.length, 0),
    incomplete: result.incomplete.length, passes: result.passes.length, inapplicable: result.inapplicable.length,
    rules: result.violations.map(r => ({ id: r.id, impact: r.impact, tags: r.tags, nodes: r.nodes.length })) }
  manifest.scans.push(row)
  await save()
  console.log(JSON.stringify({ profile, state, violationRules: row.violations, affectedNodes: row.violationNodes, needsReview: row.incomplete }))
}

async function addVariant(page) {
  await page.goto(origin + "/dk/products/qa-20261026-001-variant")
  await page.getByTestId("option-button").filter({ hasText: /^M$/ }).click()
  await page.getByTestId("option-button").filter({ hasText: /^White$/ }).click()
  await expect(page.getByTestId("product-price")).toContainText("€35.00")
  await page.getByTestId("add-product-button").click()
  await expect(page.getByRole("link", { name: "Cart (1)", exact: true })).toBeVisible()
  await page.goto(origin + "/dk/cart")
  await expect(page.getByTestId("cart-total")).toHaveText("€35.00")
}

const browser = await chromium.launch({ headless: true })
manifest.browser = browser.version()
try {
  const production = await fetch(`${origin}/_next/static/${buildId}/_buildManifest.js`)
  if (!production.ok) throw new Error("Matching local production server required")
  for (const profile of profiles) {
    const context = await browser.newContext({ viewport: { width: profile.width, height: profile.height },
      locale: "en-GB", timezoneId: "Asia/Jakarta" })
    const page = await context.newPage()
    page.setDefaultTimeout(20_000)
    try {
      await page.goto(origin + "/dk")
      await expect(page.getByRole("heading", { name: "Ecommerce Starter Template", exact: true })).toBeVisible()
      await scan(page, profile.name, "home")
      await page.getByRole("button", { name: "Menu", exact: true }).click()
      await expect(page.getByTestId("nav-menu-popup")).toBeVisible()
      await scan(page, profile.name, "menu-open")
      await page.goto(origin + "/dk/store")
      await expect(page.getByRole("link", { name: /Medusa T-Shirt/ })).toBeVisible()
      await scan(page, profile.name, "catalog")
      await page.goto(origin + "/dk/search?q=qa-a11y-no-match-20261027")
      await expect(page.getByText("No products match your search. Try a different keyword.", { exact: true })).toBeVisible()
      await scan(page, profile.name, "search-empty")
      await page.goto(origin + "/dk/products/t-shirt")
      await expect(page.getByRole("heading", { name: "Medusa T-Shirt", exact: true })).toBeVisible()
      await scan(page, profile.name, "product")
      await page.getByTestId("option-button").filter({ hasText: /^M$/ }).click()
      await page.getByTestId("option-button").filter({ hasText: /^White$/ }).click()
      await expect(page.getByRole("radio", { name: "White", exact: true })).toBeChecked()
      await scan(page, profile.name, "variant-selected")
      await page.goto(origin + "/dk/cart")
      await expect(page.getByText("You don't have anything in your cart.", { exact: false })).toBeVisible()
      await scan(page, profile.name, "cart-empty")
      await addVariant(page)
      await scan(page, profile.name, "cart-filled")
      await page.getByTestId("add-discount-button").click()
      await page.getByTestId("discount-input").fill("QA-A11Y-INVALID")
      await page.getByTestId("discount-apply-button").click()
      await expect(page.getByTestId("discount-error-message")).not.toHaveText("")
      await expect(page.getByTestId("cart-total")).toHaveText("€35.00")
      manifest.observations.push({ profile: profile.name, state: "cart-invalid-coupon",
        feedback: await page.getByTestId("discount-error-message").innerText(),
        note: "Error-state presence is the scan prerequisite; this does not approve the wording as valid functional feedback" })
      await scan(page, profile.name, "cart-invalid-coupon")
      await page.getByRole("link", { name: "Go to checkout", exact: true }).click()
      await expect(page.getByTestId("shipping-first-name-input")).toBeVisible()
      await scan(page, profile.name, "checkout-address")
      await page.getByTestId("submit-address-button").click()
      await expect(page.getByTestId("shipping-first-name-input")).toBeFocused()
      await scan(page, profile.name, "checkout-required-error")
      await page.getByTestId("shipping-first-name-input").fill("QA")
      await page.getByTestId("shipping-last-name-input").fill("Accessibility")
      await page.getByTestId("shipping-address-input").fill("1 Fictional QA Street")
      await page.getByTestId("shipping-postal-code-input").fill("2100")
      await page.getByTestId("shipping-city-input").fill("Copenhagen")
      await page.getByTestId("shipping-country-select").selectOption("dk")
      await page.getByTestId("shipping-email-input").fill(`qa-a11y-${profile.name}-${Date.now()}@example.test`)
      await page.getByTestId("submit-address-button").click()
      await page.getByRole("radio", { name: "Standard Shipping €10.00", exact: true }).click()
      await expect(page.getByTestId("cart-total")).toHaveText("€45.00")
      await scan(page, profile.name, "checkout-delivery")
      await page.getByTestId("submit-delivery-option-button").click()
      await expect(page.getByRole("radio", { name: "Manual Payment", exact: true })).toBeVisible()
      await scan(page, profile.name, "checkout-payment")
      await page.getByRole("radio", { name: "Manual Payment", exact: true }).click()
      await page.getByTestId("submit-payment-button").click()
      await expect(page.getByTestId("submit-order-button")).toBeVisible()
      await scan(page, profile.name, "checkout-review")
      await page.getByTestId("submit-order-button").click()
      await expect(page).toHaveURL(/\/order\/order_[^/]+\/confirmed$/)
      await expect(page.getByTestId("cart-total")).toHaveText("€45.00")
      manifest.orders.push({ profile: profile.name, url: page.url(), total: 45, currency: "eur", simulated: true })
      await scan(page, profile.name, "order-confirmation")
      await page.goto(origin + "/dk/account")
      await expect(page.getByTestId("login-page")).toBeVisible()
      await scan(page, profile.name, "account-login")
      await page.getByTestId("email-input").fill("qa-a11y-wrong@example.test")
      await page.getByTestId("password-input").fill("Wrong-QA-Only-Password")
      await page.getByTestId("sign-in-button").click()
      await expect(page.getByTestId("login-error-message")).toContainText("Invalid email or password")
      await scan(page, profile.name, "account-error")
      await page.getByTestId("email-input").fill(email)
      await page.getByTestId("password-input").fill(password)
      await page.getByTestId("sign-in-button").click()
      const logout = page.getByTestId("logout-button").filter({ visible: true })
      await expect(logout).toBeVisible()
      await expect(page.getByTestId("login-page")).not.toBeVisible()
      await scan(page, profile.name, "account-signed-in")
      await logout.click()
      await expect(page.getByTestId("login-page")).toBeVisible()
      await scan(page, profile.name, "account-signed-out")
    } catch (error) {
      const message = error.message.replaceAll(password, "[REDACTED]")
      manifest.errors.push({ profile: profile.name, message, url: page.url() })
      await page.screenshot({ path: path.join(output, "automated", profile.name + "-blocked.png"), fullPage: true })
      console.error(`BLOCKED ${profile.name}: ${message}`)
    } finally {
      await context.close()
      await save()
    }
  }
  const expectedScans = profiles.length * states.length
  manifest.status = manifest.scans.length === expectedScans && !manifest.errors.length ? "complete-with-findings" : "incomplete"
  manifest.completedAt = new Date().toISOString()
  manifest.totalRuleOccurrences = manifest.scans.reduce((n, r) => n + r.violations, 0)
  manifest.totalNodeOccurrences = manifest.scans.reduce((n, r) => n + r.violationNodes, 0)
  await save()
  console.log(JSON.stringify({ status: manifest.status, scans: manifest.scans.length, expectedScans,
    ruleOccurrences: manifest.totalRuleOccurrences, nodeOccurrences: manifest.totalNodeOccurrences }))
  process.exitCode = manifest.status === "incomplete" ? 1 : manifest.totalRuleOccurrences ? 2 : 0
} finally {
  await browser.close()
}
