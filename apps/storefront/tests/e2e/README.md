# Playwright portfolio tests

These tests exercise the local Medusa storefront with the synthetic fixtures from
`docs/qa/reports/RUN-20261026-001/evidence/FIXTURES.json` at the repository root.
They create local carts and simulated guest orders without resetting existing data.
They are an initial automated subset, not a replacement for the manual suite.

## Prerequisites

- Use the Node and pnpm versions required by the repository.
- Start the existing PostgreSQL, Medusa backend (`localhost:9000`) and storefront
  (`localhost:8000`). From the repository root, `pnpm run dev` starts the apps
  after PostgreSQL is available. Do not start duplicate servers on occupied ports.
- Restore/prepare the documented QA category, products and coupon through the
  approved local fixture workflow. A fresh clone alone does not contain a database.
  The preflight fails explicitly if services or fixture pages are unavailable;
  it never seeds or deletes data automatically. Prices and the coupon are
  subsequently checked against fixed independent expectations.
- Install workspace dependencies with `pnpm install --frozen-lockfile` at the
  repository root. Then, from `apps/storefront`, run
  `pnpm exec playwright install chromium` to download the matching browser.
- For the valid-login case, create ignored `apps/storefront/.env.test.local` with
  `QA_TEST_EMAIL` and `QA_TEST_PASSWORD` for an existing synthetic local customer.
  Never use production credentials. Missing credentials skip only that test, with
  an explicit reason; a skip is not a pass. Do not commit this file.

The target URL is deliberately fixed to localhost in `playwright.config.ts`.
This suite must not run against a production shop. Only Manual Payment is selected.
No real charge, delivery or email delivery is asserted.

## Run from apps/storefront

```bash
# List discovered tests without executing browser interactions.
pnpm exec playwright test --list

# Beginner's first test: one named test on desktop, with the browser visible.
pnpm exec playwright test home.spec.ts --project=desktop --grep "main heading" --headed

# Run the cart scenarios on desktop.
pnpm exec playwright test cart.spec.ts --project=desktop

# Run all 17 scenarios on all three viewport sizes (51 executions).
pnpm run test:e2e

# Open Playwright's interactive runner; choose and run a test yourself.
pnpm run test:e2e:ui

# Inspect the most recent HTML report.
pnpm run test:e2e:report
```

`--project` chooses a configured viewport. `--grep` filters test titles.
`--headed` makes the browser visible. Without it, tests run headless.
The UI/report commands stay running until stopped in the terminal with Ctrl+C.
The test suite does not start or stop application services itself.

## Learn from home.spec.ts

```ts
import { test, expect } from "@playwright/test"

test("TC-001: homepage displays the main heading", async ({ page }) => {
  await page.goto("/dk")
  await expect(
    page.getByRole("heading", { name: "Ecommerce Starter Template", exact: true })
  ).toBeVisible()
})
```

- `test` names a scenario; `page` is the fresh browser page for that test.
- `await` waits for an asynchronous operation before continuing.
- `goto` opens a path relative to the configured localhost base URL.
- `getByRole` locates a semantic UI element by its role and accessible name.
- `expect(...).toBeVisible()` is an assertion of the required outcome.
  Actions alone do not establish that a test passed.

Exercise: run the first test, temporarily change its expected heading to
`A heading that does not exist`, and run it again. Read the locator and assertion
error in the HTML report, then restore the correct heading. That deliberate failure
is a learning exercise, not a product defect. No deliberately failing exercise
has been added to the regression files.

## Files and coverage

| File | Automated scope |
| --- | --- |
| `home.spec.ts` | Home heading, menu open/close, missing product |
| `catalog.spec.ts` | Exact/nonmatching search, both price orders, exact category pagination membership |
| `products.spec.ts` | M/White selection with EUR 35 price and variant URL, stock-zero purchase control |
| `cart.spec.ts` | Empty/add/quantity/reload/remove flow, invalid and valid 10% coupon |
| `checkout.spec.ts` | Native required-field validation, address persistence, standard delivery, simulated order, confirmation reload |
| `account.spec.ts` | Invalid login and valid login/logout |
| `known-issues.spec.ts` | Customer Service destination and menu overflow checks |
| `support/shop.ts` | Shared product/cart actions; assertions still check fixed fixture values |
| `support/preflight.ts` | Read-only service and fixture-page prerequisites |

Manual TC-010 API inventory boundaries, TC-024 cross-account API authorization,
TC-026 country switching, the complete TC-025 footer-link set and the API portion
of TC-021 are not automated here. TC-021's UI confirmation reload is included.
Traceability labels refer to covered subsets, not full acceptance-criterion coverage.

Each test gets a new browser context, so cart and login cookies are isolated.
One worker and zero retries make the initial local dev run easier to follow and
preserve first-attempt failures. The suite uses web-first assertions to wait for
observable outcomes rather than fixed sleeps. It does not modify product code.

## Projects, known failures and reporting

- Desktop: Chromium, 1440 × 900 CSS px.
- Mobile: Chromium, 390 × 844 CSS px.
- Tablet: Chromium, 768 × 1024 CSS px.

These are desktop-browser viewport projects. They do not imply physical-device,
touch, mobile user-agent, WebKit/Safari, accessibility, performance or production-build
coverage. This initial run uses the existing development servers; a production-build
test environment can be prepared separately after review.

BUG-001 is marked `test.fail` on every project. BUG-002 is marked `test.fail` only
on the mobile project. Playwright expects those tests to fail until reviewed fixes
land; an unexpected pass fails the run and signals that the annotation needs review.
Expected failures remain open defects, not passing acceptance tests. In the initial
Playwright 1.64.1 run, the terminal printed `51 passed`, while actual JSON statuses
showed 47 passing test executions and 4 expected failures. Read the actual and expected
statuses together rather than interpreting the aggregate as acceptance approval. A zero process
exit code therefore does not mean every acceptance assertion passed. Inspect each
known-failure error message and any available trace to ensure the actual failure
matches the documented defect.
Desktop/tablet menu checks must pass normally.

The HTML report is in `playwright-report/`; JSON results and generated attachments
are in `test-results/`. Unexpected failures retain traces and screenshots. Known
expected failures may have only error messages/context rather than a trace or
screenshot; successful checkout screenshots are attached explicitly. Both directories
are ignored by Git. Reports/traces can contain filled QA credentials and session
data, so review and sanitize before sharing. Never publish raw authentication state.
For a saved trace, use `pnpm exec playwright show-trace <path-to-trace.zip>` locally.
This setup does not add a CI workflow or push changes automatically.

References: [Playwright writing tests](https://playwright.dev/docs/writing-tests),
[running tests](https://playwright.dev/docs/running-tests),
[annotations](https://playwright.dev/docs/test-annotations).
