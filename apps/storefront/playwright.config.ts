import { defineConfig } from "@playwright/test"
import { existsSync } from "node:fs"
import path from "node:path"

const localEnv = path.join(__dirname, ".env.test.local")
if (existsSync(localEnv)) {
  const nodeProcess = process as typeof process & {
    loadEnvFile(file: string): void
  }
  nodeProcess.loadEnvFile(localEnv)
}

// This portfolio suite creates local carts and simulated orders.
const baseURL = "http://localhost:8000"

export default defineConfig({
  testDir: "./tests/e2e",
  globalSetup: "./tests/e2e/support/preflight.ts",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  forbidOnly: Boolean(process.env.CI),
  timeout: 60_000,
  expect: { timeout: 15_000 },
  outputDir: "test-results",
  reporter: [
    ["list"],
    ["html", { open: "never" }],
    ["json", { outputFile: "test-results/results.json" }],
  ],
  use: {
    baseURL,
    browserName: "chromium",
    locale: "en-GB",
    timezoneId: "Asia/Jakarta",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { viewport: { width: 390, height: 844 } } },
    { name: "tablet", use: { viewport: { width: 768, height: 1024 } } },
  ],
})
