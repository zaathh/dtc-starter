# Local Lighthouse performance baseline

This runner measures a production build served on **localhost only**. It does not
deploy the shop or change application behavior. Lighthouse is pinned in the
storefront dev dependencies; the existing Playwright Chromium binary is reused.
The runner resolves the Puppeteer dependency supplied by that pinned Lighthouse
package to retain ownership of the measured page for post-audit checks.

## Prerequisites and commands

Run these commands from `apps/storefront` after the workspace dependencies and
Playwright Chromium have been installed. The local PostgreSQL/Medusa services and
the synthetic fixtures documented in the initial manual run must already exist.
The ignored `.env.local` supplies the local backend URL and publishable key.
No account password or real payment provider is required for these measurements.

```bash
# Compile an optimized local production build.
pnpm run build

# Stop the existing storefront dev server first so port 8000 is free.
# Keep Medusa/PostgreSQL running. This command stays active in its terminal.
NODE_ENV=production pnpm exec next start --hostname 127.0.0.1 --port 8000

# In a second terminal, run the measured baseline with a new unique ID.
pnpm run test:performance RUN-LH-20261027-003
```

The run directory must not already exist: earlier attempts are never overwritten.
Choose a different sequence/date for another run. A failed prerequisite stops the
run, marks the manifest incomplete and retains partial artifacts; it is not a Pass.
The matching production build manifest asset is checked before measurement to
guard against accidentally using the development server.

Optional tooling checks use private output outside the repository and are excluded
from baseline counts:

```bash
node tests/performance/run-baseline.mjs RUN-LH-20261027-000 --pilot
node tests/performance/run-baseline.mjs RUN-LH-20261027-000 --pilot-checkout
```

After measurement, stop `next start` with Ctrl+C and restart the ordinary local
storefront with `pnpm run dev`. The performance runner itself does not stop/start
application services. It closes only the fresh Chromium contexts and temporary
browser profiles it created. QA carts remain in the local database; no data is
reset/deleted. Checkout is loaded at the address step and no order is placed.

## Measurement protocol

| Setting | Protocol |
| --- | --- |
| Pages | `/dk`, `/dk/store`, `/dk/products/t-shirt`, populated `/dk/checkout?step=address` |
| Profiles | Installed Lighthouse built-in mobile and desktop configurations |
| Repetitions | Three per page/profile: 24 measurements, sequential round → profile → page |
| Browser | Fresh temporary Chromium profile for each measurement; version recorded |
| Cache | Browser HTTP cache cleared before measurement; application page warmed outside Chromium just before each measurement; server/backend caches not reset |
| Session | Anonymous. Checkout alone receives a fresh QA M/White ×1 cart and cache cookie |
| Storage reset | Enabled for public pages; disabled for checkout to preserve its prepared cookies. Fresh profile still prevents carry-over between runs |
| Checkout data | Existing QA fixture, EUR 35, no address/discount/delivery/payment; no product image by fixture design |
| Category | Performance only; accessibility and other category scores are not assessed here |
| Throttling | Lighthouse simulated throttling with built-in profile defaults; exact resolved values retained in each JSON report |
| Aggregation | Independent median per metric/score across all three samples, with raw reports retained |

This mobile emulation differs from the Playwright functional viewport matrix.
Read the installed configuration and the saved `configSettings` rather than
assuming Lighthouse defaults never change. Mobile/desktop scores use different
profiles and should not be compared as measurements under identical conditions.

The runner records commit/branch, build ID, lockfile hash, Node/Lighthouse/browser
versions, CPU/memory/power observation, load snapshots, page state and timestamps.
The existing build configuration skips TypeScript build validation; a successful
production build is not proof of a full typecheck or production readiness.

## Reading results

Output is in `docs/qa/reports/<run-id>/` at the repository root:

- `MANIFEST.json`: protocol, machine/environment, per-run values and medians.
- `raw/<profile>-<page>-<round>.html`: complete local Lighthouse HTML report.
- Matching `.json`: the original Lighthouse result, including settings, warnings
  and diagnostic estimates.
- Matching `.png`: post-audit verification capture after Lighthouse restores the
  browser viewport (800 × 600 in this run), not the measurement viewport. The
  heading and known EUR 35 checkout cart are checked after the audit.
- Original measured full-page captures are embedded in each JSON under
  `fullPageScreenshot`. The completed baseline also includes unchanged extracted
  `*-measured.webp` copies for convenient review at the actual profile width.

Metrics: FCP and LCP report render milestones; CLS measures unexpected layout
shifts during this navigation; TBT measures time blocked by long main-thread tasks;
Speed Index describes visual progress. Millisecond values and unitless CLS must not
be mixed. TBT is not INP, and a navigation CLS result does not cover all later user
interactions. A performance score is a weighted lab summary, not a whole-site QA
score or a guarantee of real-user experience.

Use all samples and report variability. Estimated audit savings are hypotheses to
verify in the later fix/retest phases, not promised speed improvements. Baseline
collection alone establishes neither a performance budget nor a performance Pass.
No numeric budget is silently adopted by this runner.

These localhost lab results omit internet latency to a deployed app server. Seeded
product images can still come from external asset hosts; their actual requests and
failures are retained in the reports. The starter homepage and the synthetic
checkout fixture do not represent every production shop/page or image-heavy cart.
Other desktop applications, server caches, power changes and background load are
not fully controlled; retain the environment records when interpreting variation.

Review HTML/JSON and screenshots for secrets/private data before publication.
Reports must remain local; do not upload them to an online viewer automatically.
No CI workflow, application optimization, accessibility assessment, or remote
publication is performed by this command.

References: [Lighthouse](https://github.com/GoogleChrome/lighthouse),
[score variability](https://github.com/GoogleChrome/lighthouse/blob/main/docs/variability.md).
