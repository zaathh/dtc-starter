import AxeBuilder from "@axe-core/playwright"
import { chromium, expect } from "@playwright/test"
import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = fileURLToPath(new URL("../../../../", import.meta.url))
const run = process.argv[2]
if (!/^RUN-A11Y-\d{8}-\d{3}$/.test(run || "")) throw new Error("Provide existing run ID")
const output = path.join(root, "docs/qa/reports", run, "supplemental")
await mkdir(output, { recursive: false })
const browser = await chromium.launch()
const observations = []
try {
  for (const width of [1440, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } })
    const page = await context.newPage()
    await page.goto("http://localhost:8000/dk")
    await page.getByRole("button", { name: "Menu", exact: true }).click()
    const panel = page.getByTestId("nav-menu-popup")
    await expect(panel).toBeVisible()
    // Wait for finite CSS transitions so intermediate opacity is not the baseline.
    await panel.evaluate(async element => {
      await Promise.all(element.getAnimations({ subtree: true })
        .filter(animation => animation.effect?.getComputedTiming().iterations !== Infinity)
        .map(animation => animation.finished.catch(() => {})))
    })
    const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze()
    await writeFile(path.join(output, `stable-menu-${width}.json`), JSON.stringify(result, null, 2) + "\n")
    await page.screenshot({ path: path.join(output, `stable-menu-${width}.png`), fullPage: true })
    observations.push({ probe: "stable-menu", width, rules: result.violations.map(rule => rule.id),
      opacity: await panel.evaluate(element => getComputedStyle(element).opacity) })
    await context.close()
  }
  const context = await browser.newContext({ viewport: { width: 320, height: 800 } })
  const page = await context.newPage()
  for (const route of ["/dk", "/dk/store", "/dk/products/t-shirt", "/dk/account"]) {
    await page.goto("http://localhost:8000" + route)
    await expect(page.locator("main")).toBeVisible()
    for (const spacing of [false, true]) {
      if (spacing) await page.addStyleTag({ content: "* { line-height:1.5!important; letter-spacing:.12em!important; word-spacing:.16em!important } p { margin-bottom:2em!important }" })
      const measurement = await page.evaluate(() => ({
        width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
        title: document.title, lang: document.documentElement.lang,
        media: document.querySelectorAll("audio,video").length,
        controls: [...document.querySelectorAll("input,select,button,a")].filter(element => {
          const rectangle = element.getBoundingClientRect()
          return rectangle.width && rectangle.height && (rectangle.right > innerWidth + 1 || rectangle.left < -1)
        }).map(element => ({ tag: element.tagName, text: (element.textContent || "").trim().slice(0, 70) }))
      }))
      observations.push({ probe: "narrow-layout", route, spacing, ...measurement })
      await page.screenshot({ path: path.join(output, `${route.replaceAll("/", "-")}-320${spacing ? "-spacing" : ""}.png`), fullPage: true })
    }
  }
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("http://localhost:8000/dk/account")
  await page.getByTestId("sign-in-button").click()
  observations.push({ probe: "account-native-required", ...await page.getByTestId("email-input").evaluate(element => ({
    focused: document.activeElement === element, valid: element.validity.valid,
    valueMissing: element.validity.valueMissing, validationMessage: element.validationMessage,
    id: element.id, labels: [...element.labels].map(label => label.textContent.trim()), title: element.title
  })) })
  await context.close()
} finally {
  await writeFile(path.join(output, "OBSERVATIONS.json"), JSON.stringify({
    at: new Date().toISOString(), executor: "Playwright programmatic probes; visual screenshots require review",
    browser: browser.version(), observations
  }, null, 2) + "\n")
  await browser.close()
}
console.log(JSON.stringify(observations))
