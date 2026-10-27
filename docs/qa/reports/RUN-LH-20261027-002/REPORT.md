# Lighthouse Performance Baseline — RUN-LH-20261027-002

Disposition: **Baseline recorded; performance acceptance/budgets not established.** All 24 planned measurements completed. These are local laboratory results from a production build, not real-user field data or a whole-site QA score. No optimization or performance-pass claim is made.

## Scope and method

- Date: October 27, 2026, Asia/Jakarta; UTC interval `2026-10-27T05:49:40.556Z` to `2026-10-27T05:52:51.662Z`. Elapsed interval is not a billable effort estimate.
- Application commit: `a51eb82f37e2bcdde494692fc608451efbffeca8`. Branch: `test/performance-baseline`; build ID `frzRcUQusiOSY97UXUJYw`. The runner, Lighthouse dependency and reports were working-tree changes during execution; their fingerprints are in [EXECUTION_CONTEXT.json](EXECUTION_CONTEXT.json) and [MANIFEST.json](MANIFEST.json).
- Lighthouse 13.5.0; Node v24.4.1; Chromium `156.0.8078.4`. Existing pnpm 10.11.1 and local Medusa/PostgreSQL backend. Source app configuration was not optimized.
- `next build` succeeded; [BUILD.txt](BUILD.txt) retains the log, including the middleware deprecation warning and skipped TypeScript build validation from existing configuration. Production was served on loopback port 8000, replacing the local dev server temporarily.
- Four pages: starter home `/dk`, default catalog `/dk/store`, seeded image-bearing product `/dk/products/t-shirt`, and anonymous checkout `/dk/checkout?step=address` with a QA M/White ×1 cart at EUR 35. The product normally appends a selected-variant URL parameter; actual requested/final URLs are retained.
- Mobile profile: 412 × 823 CSS px, DPR 1.75; desktop: 1350 × 940 CSS px, DPR 1. Exact throttling/user-agent/profile settings are in every raw JSON. These profiles differ from the functional Playwright viewport projects.
- Three rounds; each round runs mobile then desktop, home → catalog → product → checkout. Sequential fresh Chromium profile per measurement; browser HTTP cache cleared. Page/server route warmed by a separate HTTP request immediately before each measurement; server/backend caches not reset.
- Public pages use Lighthouse storage reset. Checkout disables storage reset to preserve prepared cart/cache cookies; it still starts from a fresh browser profile. Six baseline QA carts created; no address/payment/order submitted. Fixture thumbnail intentionally absent in checkout. No login credentials are used.
- Performance category only. Scores and each metric are independent medians of all three samples. A representative report is chosen by nearest median LCP; its other metrics need not equal their separate medians.
- Machine/power/load observations are recorded in the manifest. Other desktop apps, thermal state, power changes and external asset-network conditions are not fully controlled. Local app-server latency omits internet/CDN/deployed-server effects.

## Median metrics

| Profile | Page | Score /100 | FCP (s) | LCP (s) | CLS | TBT (ms) | Speed Index (s) |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| mobile | home | 100 | 0.76 | 1.67 | 0.000 | 16.0 | 0.76 |
| mobile | catalog | 75 | 0.76 | 1.67 | 1.014 | 38.0 | 1.06 |
| mobile | product | 80 | 0.91 | 5.40 | 0.000 | 46.0 | 1.68 |
| mobile | checkout | 93 | 0.76 | 1.83 | 0.000 | 299.5 | 0.76 |
| desktop | home | 100 | 0.21 | 0.37 | 0.000 | 0.0 | 0.21 |
| desktop | catalog | 60 | 0.21 | 2.93 | 0.651 | 0.0 | 1.24 |
| desktop | product | 92 | 0.25 | 1.88 | 0.000 | 0.0 | 0.69 |
| desktop | checkout | 100 | 0.21 | 0.42 | 0.000 | 0.0 | 0.21 |

FCP/LCP/Speed Index are shown in seconds; TBT is milliseconds; CLS is unitless. TBT is not INP. These are navigation measurements, not complete interaction coverage. A high starter-home score does not establish the performance of a richer storefront.

## Variability and representative reports

| Profile | Page | Score range | LCP range (s) | CLS range | TBT range (ms) | Representative |
| --- | --- | --- | --- | --- | --- | --- |
| mobile | home | 98–100 | 1.53–2.31 | 0.000–0.000 | 12.0–33.5 | [HTML](raw/mobile-home-2.html), [JSON](raw/mobile-home-2.json), [measured screenshot](raw/mobile-home-2-measured.webp) |
| mobile | catalog | 75–76 | 1.53–1.82 | 1.014–1.014 | 23.5–51.0 | [HTML](raw/mobile-catalog-1.html), [JSON](raw/mobile-catalog-1.json), [measured screenshot](raw/mobile-catalog-1-measured.webp) |
| mobile | product | 78–83 | 4.76–6.05 | 0.000–0.000 | 43.0–49.0 | [HTML](raw/mobile-product-2.html), [JSON](raw/mobile-product-2.json), [measured screenshot](raw/mobile-product-2-measured.webp) |
| mobile | checkout | 91–94 | 1.82–1.97 | 0.000–0.000 | 276.5–339.5 | [HTML](raw/mobile-checkout-2.html), [JSON](raw/mobile-checkout-2.json), [measured screenshot](raw/mobile-checkout-2-measured.webp) |
| desktop | home | 100–100 | 0.30–0.47 | 0.000–0.000 | 0.0–0.0 | [HTML](raw/desktop-home-1.html), [JSON](raw/desktop-home-1.json), [measured screenshot](raw/desktop-home-1-measured.webp) |
| desktop | catalog | 57–62 | 2.73–2.94 | 0.651–0.651 | 0.0–0.0 | [HTML](raw/desktop-catalog-1.html), [JSON](raw/desktop-catalog-1.json), [measured screenshot](raw/desktop-catalog-1-measured.webp) |
| desktop | product | 91–92 | 1.87–1.99 | 0.000–0.000 | 0.0–0.0 | [HTML](raw/desktop-product-1.html), [JSON](raw/desktop-product-1.json), [measured screenshot](raw/desktop-product-1-measured.webp) |
| desktop | checkout | 100–100 | 0.32–0.51 | 0.000–0.000 | 0.0–0.0 | [HTML](raw/desktop-checkout-3.html), [JSON](raw/desktop-checkout-3.json), [measured screenshot](raw/desktop-checkout-3-measured.webp) |

## Evidence-backed findings and proposed next investigations

1. **PERF-001 — Catalog layout stability.** CLS is nonzero across the complete sample set. The layout-shifts audit identifies moved nodes, including the footer. This establishes observed shifts, not the root cause. Investigate reserved space/loading transitions and verify a targeted change later.
2. **PERF-002 — Product rendering/image delivery.** Product LCP and image-delivery/unused-JavaScript diagnostics warrant investigation. Image audit savings are Lighthouse estimates, not achieved reductions. Inspect request discovery, responsive sizing and delivery before selecting a small fix.
3. **PERF-003 — Mobile checkout main-thread work.** TBT and long-task diagnostics indicate a candidate for profiling on mobile. The same synthetic checkout is lightweight and has no product image; do not generalize this to all production carts.

These are scoped performance findings, separate from functional BUG-001 and BUG-002. No additional functional bug, severity assignment, closed defect or improvement percentage is inferred. Proposed investigations remain Phase 7 work after review; no performance budget was silently adopted.

## Diagnostic excerpts

| Profile / page | Audit | Actual diagnostic | Estimated metric savings |
| --- | --- | --- | --- |
| mobile / home | unused-javascript | Est savings of 82 KiB | {"FCP": 0, "LCP": 0} |
| mobile / home | render-blocking-insight | Est savings of 140 ms | {"FCP": 150, "LCP": 150} |
| mobile / catalog | layout-shifts | 2 layout shifts found | {"CLS": 1.014} |
| mobile / catalog | image-delivery-insight | Est savings of 2,540 KiB | {"FCP": 0, "LCP": 0} |
| mobile / catalog | unused-javascript | Est savings of 45 KiB | {"FCP": 0, "LCP": 0} |
| mobile / catalog | render-blocking-insight | Est savings of 140 ms | {"FCP": 150, "LCP": 150} |
| mobile / product | image-delivery-insight | Est savings of 3,343 KiB | {"FCP": 0, "LCP": 1100} |
| mobile / product | unused-javascript | Est savings of 79 KiB | {"FCP": 0, "LCP": 350} |
| mobile / product | render-blocking-insight | Est savings of 140 ms | {"FCP": 150, "LCP": 0} |
| mobile / product | lcp-discovery-insight | LCP request discovery | {"LCP": 0} |
| mobile / checkout | unused-javascript | Est savings of 292 KiB | {"FCP": 0, "LCP": 0} |
| mobile / checkout | render-blocking-insight | Est savings of 140 ms | {"FCP": 150, "LCP": 150} |
| desktop / home | unused-javascript | Est savings of 82 KiB | {"FCP": 0, "LCP": 0} |
| desktop / home | render-blocking-insight | Render-blocking requests | {"FCP": 0, "LCP": 0} |
| desktop / catalog | layout-shifts | 1 layout shift found | {"CLS": 0.651} |
| desktop / catalog | image-delivery-insight | Est savings of 2,586 KiB | {"FCP": 0, "LCP": 1750} |
| desktop / catalog | unused-javascript | Est savings of 45 KiB | {"FCP": 0, "LCP": 0} |
| desktop / catalog | render-blocking-insight | Render-blocking requests | {"FCP": 0, "LCP": 0} |
| desktop / catalog | lcp-discovery-insight | LCP request discovery | {"LCP": 0} |
| desktop / product | image-delivery-insight | Est savings of 3,370 KiB | {"FCP": 0, "LCP": 650} |
| desktop / product | unused-javascript | Est savings of 79 KiB | {"FCP": 0, "LCP": 0} |
| desktop / product | render-blocking-insight | Render-blocking requests | {"FCP": 0, "LCP": 0} |
| desktop / product | lcp-discovery-insight | LCP request discovery | {"LCP": 0} |
| desktop / checkout | unused-javascript | Est savings of 292 KiB | {"FCP": 0, "LCP": 0} |
| desktop / checkout | render-blocking-insight | Render-blocking requests | {"FCP": 0, "LCP": 0} |

Estimated audit savings may overlap and must not be summed into a promised gain. Only controlled before/after measurements can demonstrate improvements. Mobile and desktop scores use different scoring/emulation profiles, so they are not directly equivalent tests.

## Warnings, setup history and data boundaries

- Lighthouse run warnings: **0** across 24 runs. HTTP request failures found in network audit tables: **0**. See [SUMMARY.json](SUMMARY.json) for the recorded details; absence here is not a complete network/security audit.
- Two early home pilot attempts failed in runner post-audit validation because Lighthouse closes tabs it creates itself. Supplying an owned Puppeteer page resolved this. One desktop-home pilot and one mobile-checkout pilot then completed; private pilot artifacts remain outside the repository and are excluded from baseline medians.
- [RUN-LH-20261027-001](../RUN-LH-20261027-001/MANIFEST.json) is explicitly incomplete. It stopped when the product appended its normal `v_id` parameter. Its partial raw artifacts are retained; the guard was corrected, then this complete run started with a new ID. Samples were not discarded based on score. The initial partial run is not mixed into the 24-run baseline.
- The source application, image settings, styles, middleware and business logic were not changed to improve these results. No actual optimization or post-fix comparison has been performed.
- Full raw HTML/JSON and screenshots are preserved, not uploaded to an online Lighthouse viewer. Only local synthetic data is used. No real payment, deployment or production application interaction occurred.
- The temporary production server was stopped and the development server restored after collection; storefront HTTP 200 was confirmed. Restoration details are recorded in execution context.

## Reading and rerunning

[Runner and learning guide](../../../../apps/storefront/tests/performance/README.md) explains commands and prerequisites. The baseline depends on the documented existing local fixtures; a new clone alone does not prepare a database. Raw reports, protocol/machine settings and independent median calculations should be retained for a later matching comparison.

Phases 6–8 remain pending. This stage records performance evidence only; it does not establish WCAG conformance, security clearance, release acceptance, or field performance.

Screenshot provenance: the `*-measured.webp` files are extracted unchanged from each original LHR `fullPageScreenshot` and use the measured profile width (412/1350 CSS px). The separate `*.png` files were captured during post-audit DOM verification after Lighthouse reset emulation to 800 × 600; they are not evidence of the measurement viewport. Raw JSON retains both the profile settings and original screenshot data.
