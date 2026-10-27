import { request } from "@playwright/test"

export default async function preflight() {
  const api = await request.newContext({ timeout: 30_000 })
  try {
    for (const url of [
      "http://localhost:9000/health",
      "http://localhost:8000/dk",
      "http://localhost:8000/dk/products/qa-20261026-001-variant",
      "http://localhost:8000/dk/products/qa-20261026-001-zero-stock",
      "http://localhost:8000/dk/categories/qa-20261026-001",
    ]) {
      const response = await api.get(url)
      if (response.status() !== 200) {
        throw new Error(
          `Local QA prerequisite unavailable (${response.status()}): ${url}. Start the services and restore the documented QA fixtures; do not interpret this as a product test failure.`
        )
      }
    }
  } finally {
    await api.dispose()
  }
}
