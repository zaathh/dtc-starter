import lighthouse from "lighthouse"
import desktopConfig from "lighthouse/core/config/desktop-config.js"
import { chromium } from "@playwright/test"
import assert from "node:assert/strict"
import { createRequire } from "node:module"
import { readFile, writeFile, mkdir, mkdtemp, rm } from "node:fs/promises"
import { existsSync } from "node:fs"
import { createHash, randomUUID } from "node:crypto"
import { execFileSync } from "node:child_process"
import { createServer } from "node:net"
import os from "node:os"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

// Reuse the puppeteer-core version bundled with the pinned Lighthouse package.
// Supplying our own Puppeteer page keeps it open for post-measurement validation.
const lighthouseRequire = createRequire(import.meta.resolve("lighthouse"))
const { default: puppeteer } = await import(pathToFileURL(lighthouseRequire.resolve("puppeteer-core")).href)

const app = fileURLToPath(new URL("../../", import.meta.url))
const root = path.resolve(app, "../..")
const pilotCheckout = process.argv.includes("--pilot-checkout")
const pilot = process.argv.includes("--pilot") || pilotCheckout
const runId = process.argv[2] || "RUN-LH-20261027-001"
if (!/^RUN-LH-\d{8}-\d{3}$/.test(runId)) throw new Error("Use RUN-LH-YYYYMMDD-NNN")
const output = pilot
  ? path.join(root, "../.medusa-local", `lighthouse-pilot-${Date.now()}`)
  : path.join(root, "docs/qa/reports", runId)
const origin = "http://localhost:8000"
const backend = "http://localhost:9000"
if (existsSync(path.join(app, ".env.local"))) process.loadEnvFile(path.join(app, ".env.local"))
const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
if (!publishableKey) throw new Error("Missing local publishable key; see performance README")
if (process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL &&
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL !== backend) {
  throw new Error("This runner requires the local Medusa backend")
}
const fixtures = JSON.parse(await readFile(path.join(root,
  "docs/qa/reports/RUN-20261026-001/evidence/FIXTURES.json"), "utf8"))
const qaVariant = fixtures.products.find(p => p.handle.endsWith("-variant"))
  .variants.find(v => v.id === "variant_01M5VE4CMV3WJZZZ25CHY43FA2")
if (!qaVariant) throw new Error("Documented M/White fixture missing")
const pages = pilot ? (pilotCheckout
  ? [{ name: "checkout", route: "/dk/checkout?step=address", heading: "Shipping Address", checkout: true }]
  : [{ name: "home", route: "/dk", heading: "Ecommerce Starter Template" }]) : [
  { name: "home", route: "/dk", heading: "Ecommerce Starter Template" },
  { name: "catalog", route: "/dk/store", heading: "All products" },
  { name: "product", route: "/dk/products/t-shirt", heading: "Medusa T-Shirt" },
  { name: "checkout", route: "/dk/checkout?step=address", heading: "Shipping Address", checkout: true },
]
const profiles = pilot ? [pilotCheckout ? "mobile" : "desktop"] : ["mobile", "desktop"]
const metrics = {
  fcp_ms: "first-contentful-paint",
  lcp_ms: "largest-contentful-paint",
  cls: "cumulative-layout-shift",
  tbt_ms: "total-blocking-time",
  speed_index_ms: "speed-index",
}
await mkdir(output, { recursive: false })
await mkdir(path.join(output, "raw"))
const buildId = (await readFile(path.join(app, ".next/BUILD_ID"), "utf8")).trim()
const lighthousePackage = JSON.parse(await readFile(path.join(app, "node_modules/lighthouse/package.json"), "utf8"))
const manifest = {
  runId, pilot, startedAt: new Date().toISOString(), status: "running",
  applicationCommit: execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim(),
  branch: execFileSync("git", ["branch", "--show-current"], { cwd: root, encoding: "utf8" }).trim(),
  buildId, lighthouse: lighthousePackage.version, node: process.version,
  lockfileSha256: createHash("sha256").update(await readFile(path.join(root, "pnpm-lock.yaml"))).digest("hex"),
  machine: { platform: os.platform(), release: os.release(), arch: os.arch(),
    cpu: os.cpus()[0].model, logicalCpus: os.cpus().length, memoryBytes: os.totalmem(),
    initialFreeMemoryBytes: os.freemem(), initialLoadAverage: os.loadavg(),
    powerObservation: execFileSync("pmset", ["-g", "batt"], { encoding: "utf8" }).replace(/\(id=\d+\)/g, "(device id omitted)").trim() },
  protocol: {
    mode: "Existing production build served locally; backend and PostgreSQL local",
    rounds: pilot ? 1 : 3, profiles, pages,
    browserCache: "Fresh temporary Chromium profile per measurement; HTTP cache explicitly cleared before Lighthouse",
    serverCache: "Page fetched once outside Chromium immediately before each measurement; server/backend caches not reset",
    checkout: "Fresh anonymous QA M/White x1 cart per checkout measurement; EUR 35, no address, no payment, no order",
    storage: "Fresh profiles; storage reset enabled except checkout, where disabled to preserve only prepared cart/cache cookies",
    throttling: "Lighthouse built-in mobile/desktop configs; exact resolved settings retained per raw report",
    category: "performance only", order: "Round, profile, page; sequential, no concurrent test suite",
    limits: "Local lab results, not field data; other desktop applications not controlled; no INP/conformance/release claim",
  }, rows: [],
}
const saveManifest = () => writeFile(path.join(output, "MANIFEST.json"), JSON.stringify(manifest, null, 2) + "\n")
await saveManifest()

async function requestStore(route, method, body) {
  const response = await fetch(backend + route, { method,
    headers: { "content-type": "application/json", "x-publishable-api-key": publishableKey },
    body: JSON.stringify(body), signal: AbortSignal.timeout(30_000) })
  if (!response.ok) throw new Error(`Local Store prerequisite failed: ${route}, HTTP ${response.status}`)
  return response.json()
}

async function prepareCart() {
  const created = await requestStore("/store/carts", "POST", { region_id: fixtures.region.id })
  const updated = await requestStore(`/store/carts/${created.cart.id}/line-items`, "POST", {
    variant_id: qaVariant.id, quantity: 1,
  })
  if (updated.cart.total !== 35 || updated.cart.items.length !== 1) {
    throw new Error("Checkout prerequisite must be a single EUR 35 fixture")
  }
  return created.cart.id
}

async function availablePort() {
  const server = createServer()
  return new Promise((resolve, reject) => {
    server.on("error", reject)
    server.listen(0, "127.0.0.1", () => {
      const port = server.address().port
      server.close(() => resolve(port))
    })
  })
}

async function measure(pageSpec, profile, round) {
  const name = `${profile}-${pageSpec.name}-${round}`
  const cartId = pageSpec.checkout ? await prepareCart() : null
  const warm = await fetch(origin + pageSpec.route, {
    headers: cartId ? { cookie: `_medusa_cart_id=${cartId}` } : {},
    signal: AbortSignal.timeout(30_000),
  })
  if (warm.status !== 200 || new URL(warm.url).pathname !== new URL(origin + pageSpec.route).pathname) {
    throw new Error(`${name}: production page prerequisite failed`)
  }
  await warm.text()
  const userData = await mkdtemp(path.join(os.tmpdir(), "qa-lighthouse-"))
  let context
  let auditBrowser
  try {
    const port = await availablePort()
    context = await chromium.launchPersistentContext(userData, {
      headless: true, viewport: null, locale: "en-US", timezoneId: "Asia/Jakarta",
      args: [`--remote-debugging-port=${port}`, "--remote-debugging-address=127.0.0.1"],
    })
    const browserVersion = context.browser().version()
    if (cartId) await context.addCookies([
      { name: "_medusa_cart_id", value: cartId, url: origin, httpOnly: true, sameSite: "Lax" },
      { name: "_medusa_cache_id", value: randomUUID(), url: origin, httpOnly: true, sameSite: "Lax" },
    ])
    const page = context.pages()[0]
    const cdp = await context.newCDPSession(page)
    await cdp.send("Network.clearBrowserCache")
    await cdp.detach()
    auditBrowser = await puppeteer.connect({ browserURL: `http://127.0.0.1:${port}`, defaultViewport: null })
    const auditPage = await auditBrowser.newPage()
    console.log(`MEASURE ${name}`)
    const result = await lighthouse(origin + pageSpec.route, {
      port, hostname: "127.0.0.1", onlyCategories: ["performance"],
      output: ["html", "json"], logLevel: "error", locale: "en-US",
      disableStorageReset: Boolean(cartId),
    }, profile === "desktop" ? desktopConfig : undefined, auditPage)
    if (!result) throw new Error(`${name}: Lighthouse returned no result`)
    await writeFile(path.join(output, "raw", name + ".html"), result.report[0])
    await writeFile(path.join(output, "raw", name + ".json"), result.report[1])
    const lhr = result.lhr
    if (lhr.runtimeError) throw new Error(`${name}: ${lhr.runtimeError.code}`)
    const requested = new URL(origin + pageSpec.route)
    const final = new URL(lhr.finalDisplayedUrl)
    const allowedParams = new Set([...requested.searchParams.keys(), ...(pageSpec.name === "product" ? ["v_id"] : [])])
    if (final.origin !== requested.origin || final.pathname !== requested.pathname ||
        [...requested.searchParams].some(([key, value]) => final.searchParams.get(key) !== value) ||
        [...final.searchParams.keys()].some(key => !allowedParams.has(key))) {
      throw new Error(`${name}: unexpected destination`)
    }
    await auditPage.waitForFunction(heading => [...document.querySelectorAll("h1,h2")]
      .some(e => e.textContent.replace(/\s+/g, " ").trim() === heading), { timeout: 10_000 }, pageSpec.heading)
    if (cartId) {
      const state = await auditPage.evaluate(() => ({
        total: document.querySelector('[data-testid="cart-total"]')?.textContent.trim(),
        body: document.body.textContent.replace(/\s+/g, " "),
      }))
      assert.equal(state.total, "€35.00")
      assert.ok(state.body.includes("Variant: M / White"))
    }
    await auditPage.screenshot({ path: path.join(output, "raw", name + ".png") })
    const values = Object.fromEntries(Object.entries(metrics).map(([key, audit]) => [key, lhr.audits[audit].numericValue]))
    if (Object.values(values).some(v => !Number.isFinite(v))) throw new Error(`${name}: metric unavailable`)
    const row = { name, profile, page: pageSpec.name, round, at: lhr.fetchTime, browserVersion,
      requestedUrl: lhr.requestedUrl, finalDisplayedUrl: lhr.finalDisplayedUrl,
      score: lhr.categories.performance.score * 100, ...values,
      configSettings: lhr.configSettings, environment: lhr.environment,
      runWarnings: lhr.runWarnings, status: "measured", freeMemoryBytes: os.freemem(), loadAverage: os.loadavg() }
    manifest.rows.push(row)
    await saveManifest()
    console.log(JSON.stringify({ name, score: row.score, lcp_ms: row.lcp_ms, cls: row.cls, tbt_ms: row.tbt_ms }))
  } finally {
    if (auditBrowser) await auditBrowser.disconnect()
    if (context) await context.close()
    await rm(userData, { recursive: true, force: true })
  }
}

try {
  const health = await fetch(backend + "/health", { signal: AbortSignal.timeout(10_000) })
  if (!health.ok) throw new Error("Local backend unavailable")
  const productionAsset = await fetch(`${origin}/_next/static/${buildId}/_buildManifest.js`, {
    signal: AbortSignal.timeout(10_000),
  })
  if (!productionAsset.ok) throw new Error("Production build asset unavailable; start the matching production server, not next dev")
  for (let round = 1; round <= (pilot ? 1 : 3); round++) {
    for (const profile of profiles) for (const page of pages) await measure(page, profile, round)
  }
  const median = values => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)]
  manifest.medians = []
  for (const profile of profiles) for (const page of pages) {
    const rows = manifest.rows.filter(r => r.profile === profile && r.page === page.name)
    const keys = ["score", ...Object.keys(metrics)]
    manifest.medians.push({ profile, page: page.name, samples: rows.length,
      ...Object.fromEntries(keys.map(k => [k, median(rows.map(r => r[k]))])) })
  }
  manifest.status = "complete"
  manifest.completedAt = new Date().toISOString()
  await saveManifest()
  console.log(`COMPLETE ${manifest.rows.length} measurements: ${output}`)
} catch (error) {
  manifest.status = "incomplete"
  manifest.error = error.message
  manifest.completedAt = new Date().toISOString()
  await saveManifest()
  throw error
}
