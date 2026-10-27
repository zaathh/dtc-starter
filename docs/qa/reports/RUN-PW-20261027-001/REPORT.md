# Initial Playwright Execution — RUN-PW-20261027-001

**Disposition: Executed with known defects.** The runner exited successfully, but four acceptance assertions failed as expected because BUG-001 and BUG-002 remain open. This is not all-acceptance-tests-passed or release approval.

## Manifest

- Recorded October 27, 2026, Asia/Jakarta. Runner UTC start: `2026-10-27T02:20:29.032Z`; duration: 120.1 seconds. This is elapsed runner time, not total setup effort.
- Playwright Test 1.64.1, downloaded Chromium 156.0.8078.4, Node 24.4.1, pnpm 10.11.1, macOS local environment. Existing Next.js and Medusa development services on localhost ports 8000/9000; existing dedicated PostgreSQL database.
- Branch `test/playwright-setup`, parent `f541920`; application source baseline `204130a`. The automation files were uncommitted at execution; refer to the branch diff rather than treating the parent as the test-code revision.
- Executor: AI QA assistant. The owner's earlier manual confirmation is retained in the manual reports and is not attributed as execution of these new scripts.
- One worker, zero retries, isolated browser context per test, English locale, Asia/Jakarta timezone. Projects use desktop 1440 × 900, mobile 390 × 844 and tablet 768 × 1024 CSS px. No physical devices, touch emulation, WebKit/Firefox or production-build coverage claimed.

## Actual counts

| Project | Actual pass | Expected failure | Unexpected failure |
| --- | --- | --- | --- |
| desktop | 16 | 1 | 0 |
| mobile | 15 | 2 | 0 |
| tablet | 16 | 1 | 0 |
| Total | 47 | 4 | 0 |

There were 17 scenarios × 3 projects = 51 executions, zero skips and zero flaky results. This count is not the 26-case manual suite denominator. Some manual cases are combined, some checks are additional, and API/country/full-footer coverage remains manual.

Playwright 1.64.1 printed `51 passed` because all executions matched their declared expected statuses. The JSON actual statuses instead show **47 passed and 4 failed**, with all four failures annotated as expected. Both representations are retained transparently in [RESULTS.json](RESULTS.json).

## Known-failure review

- BUG-001: all three Customer Service cases failed because Page not found remained visible after following the account link. The failures occurred at the intended destination assertion, not during setup.
- BUG-002: mobile menu check failed with expected width ≤390 and actual width 398. Desktop and tablet menu checks passed.
- Open issues were not fixed or waived. Expected-failure annotations require review when a fix makes these tests unexpectedly pass.

## Setup attempts and corrections

- First desktop iteration, excluding known issues: 8 passed / 7 unexpected failures. Five failures came from clicking sr-only radios covered by visible labels, one from an ambiguous Account locator, and one from the stale development module state described below.
- Second desktop iteration: 13 passed / 2 unexpected failures. A delete-button test ID was not forwarded to the DOM, so the locator was scoped to the existing product row and its button. The remaining blank 404 page was independently diagnosed as a Next.js module-factory mismatch after pnpm relinked its optional Playwright peer.
- An intermediate full-suite run was stopped to correct the environment. Its incomplete output is not counted as a completed run. Restarting only the local storefront resolved the stale module state; no application source, cache directories, or product configuration were changed to hide failures.
- The final complete run above includes all cases with retries disabled. Earlier failed iterations are setup/debugging history, not new product defects. Known product failures remain explicitly reported.
- Dependency installation emitted peer/deprecation warnings. The package-manager-generated lockfile includes Playwright and peer-resolution changes; it was not hand-edited.

## Data, artifacts and checks

- Existing QA category/products, explicit EUR prices, 10% coupon and synthetic local customer were reused. New isolated carts and simulated guest orders were created. No existing records were reset/deleted, real payment made, or delivery/email verified.
- Final checkout completed on all three sizes. EUR 35 − EUR 3.50 + EUR 10 shipping + EUR 0 tax = **EUR 41.50**, retained on confirmation reload.
- Raw HTML/JSON reports and private credentials remain ignored locally; any generated traces/screenshots are also ignored. Expected failures may have only error messages/context. Traces may contain credentials/session data and are not published here. Only selected synthetic checkout screenshots and a sanitized summary are included. Expected-failure messages were inspected and are retained without credentials in the summary.
- ESLint for the added configuration/tests passed with zero warnings. A targeted TypeScript check of those files passed. These checks are not a claim that the entire repository lint/build/test suite passed.
- [Learning and execution guide](../../../../apps/storefront/tests/e2e/README.md)

## Per-execution results

| Project | Test | Actual outcome |
| --- | --- | --- |
| desktop | TC-022: invalid login does not grant account access | Pass |
| desktop | TC-023: valid login and logout change account access | Pass |
| mobile | TC-022: invalid login does not grant account access | Pass |
| mobile | TC-023: valid login and logout change account access | Pass |
| tablet | TC-022: invalid login does not grant account access | Pass |
| tablet | TC-023: valid login and logout change account access | Pass |
| desktop | TC-011–015: cart supports add, quantity, reload, and removal | Pass |
| desktop | TC-016/017: invalid coupon is rejected and valid coupon calculates 10 percent | Pass |
| mobile | TC-011–015: cart supports add, quantity, reload, and removal | Pass |
| mobile | TC-016/017: invalid coupon is rejected and valid coupon calculates 10 percent | Pass |
| tablet | TC-011–015: cart supports add, quantity, reload, and removal | Pass |
| tablet | TC-016/017: invalid coupon is rejected and valid coupon calculates 10 percent | Pass |
| desktop | TC-003: exact-title search returns only the expected product | Pass |
| desktop | TC-004: unmatched search displays an empty state | Pass |
| desktop | TC-005: category prices follow both sort directions | Pass |
| desktop | TC-002/006: category pagination covers the exact fixture membership | Pass |
| mobile | TC-003: exact-title search returns only the expected product | Pass |
| mobile | TC-004: unmatched search displays an empty state | Pass |
| mobile | TC-005: category prices follow both sort directions | Pass |
| mobile | TC-002/006: category pagination covers the exact fixture membership | Pass |
| tablet | TC-003: exact-title search returns only the expected product | Pass |
| tablet | TC-004: unmatched search displays an empty state | Pass |
| tablet | TC-005: category prices follow both sort directions | Pass |
| tablet | TC-002/006: category pagination covers the exact fixture membership | Pass |
| desktop | TC-018: required address fields prevent empty checkout submission | Pass |
| desktop | TC-019–021: local simulated checkout retains address and order confirmation | Pass |
| mobile | TC-018: required address fields prevent empty checkout submission | Pass |
| mobile | TC-019–021: local simulated checkout retains address and order confirmation | Pass |
| tablet | TC-018: required address fields prevent empty checkout submission | Pass |
| tablet | TC-019–021: local simulated checkout retains address and order confirmation | Pass |
| desktop | TC-001: homepage displays the main heading | Pass |
| desktop | TC-001: navigation menu opens and closes | Pass |
| desktop | TC-008: missing product provides a usable not-found page | Pass |
| mobile | TC-001: homepage displays the main heading | Pass |
| mobile | TC-001: navigation menu opens and closes | Pass |
| mobile | TC-008: missing product provides a usable not-found page | Pass |
| tablet | TC-001: homepage displays the main heading | Pass |
| tablet | TC-001: navigation menu opens and closes | Pass |
| tablet | TC-008: missing product provides a usable not-found page | Pass |
| desktop | TC-025 / BUG-001: Customer Service should reach a usable destination | Expected failure |
| desktop | RSP-001 / BUG-002: open navigation menu stays within viewport | Pass |
| mobile | TC-025 / BUG-001: Customer Service should reach a usable destination | Expected failure |
| mobile | RSP-001 / BUG-002: open navigation menu stays within viewport | Expected failure |
| tablet | TC-025 / BUG-001: Customer Service should reach a usable destination | Expected failure |
| tablet | RSP-001 / BUG-002: open navigation menu stays within viewport | Pass |
| desktop | TC-007: M/White selects the EUR 35 variant | Pass |
| desktop | TC-009: stock-zero product cannot be added | Pass |
| mobile | TC-007: M/White selects the EUR 35 variant | Pass |
| mobile | TC-009: stock-zero product cannot be added | Pass |
| tablet | TC-007: M/White selects the EUR 35 variant | Pass |
| tablet | TC-009: stock-zero product cannot be added | Pass |

## Selected evidence

[desktop-order-confirmation.png](evidence/desktop-order-confirmation.png)

[mobile-order-confirmation.png](evidence/mobile-order-confirmation.png)

[tablet-order-confirmation.png](evidence/tablet-order-confirmation.png)
