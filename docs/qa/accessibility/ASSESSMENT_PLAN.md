# Scoped WCAG 2.2 A/AA Assessment Plan

Authorized October 27, 2026. Target: local Medusa storefront, with existing
synthetic QA fixtures and the local manual/system payment provider only.

## Inventory and execution

Six core areas: home/navigation, catalog/search, product selection, cart,
guest checkout and account sign-in/out. Automated states are home, menu open,
catalog, unmatched search, product, selected variant, empty/filled cart, invalid
coupon, checkout address and required-field error, delivery, payment, review,
order confirmation, account login/error/signed-in/signed-out. This is 19 states
at desktop 1440 × 900 and mobile 390 × 844: 38 planned axe scans.

Use the existing production build locally to omit development UI. Record build
ID, app commit, dependency versions, browser/viewport, tags, synthetic records,
raw results, screenshots and limitations. Restore development serving afterward.
Each viewport has an isolated browser context and a separate simulated guest order.
No real credentials, charges, email delivery or production systems are involved.

The initial complete-process scope is guest purchase and customer login/logout.
Registration, verification, account recovery/transfer, admin and real payments
are outside this run. Do not generalize their accessibility from sampled states.

## Automated and manual responsibilities

Use the installed axe WCAG A/AA tag families through 2.2. Do not suppress failing
rules or exclude product nodes. Preserve violations, incomplete checks, passes and
inapplicable rules. An inapplicable axe rule is not automatically an inapplicable
WCAG criterion. Best-practice/AAA rules are outside the tagged scan scope.

Follow with observed keyboard interactions, menu/Escape/focus return, product
selection, cart controls, form labels/errors, focus visibility/obscuration, target
measurements, narrow reflow, text spacing/zoom where observable, and assistive
technology checks where available. Distinguish programmatic probes from manual
browser interactions. An accessibility tree alone is not a screen-reader test.

## Verdict and evidence rules

- Map applicable WCAG 2.2 A/AA criteria to Pass (declared subset), Fail, Not Tested
  or Not Applicable with a rationale/evidence link. Partial checks do not pass a
  whole criterion; keep untested remainder explicit.
- Confirm automatic findings against the rendered DOM and task impact before
  creating a defect. Group repeated instances by actual underlying issue without
  converting node/rule occurrences into unique bug counts.
- Treat axe incomplete checks as Needs Review, not automatic failure or pass.
- Record VoiceOver/zoom gaps honestly if they cannot be observed; do not claim
  all criteria tested or WCAG conformance from the scan.
- No product fixes are made during this baseline. Findings remain open for the
  separately authorized fix stage; no severity/risk waiver is assumed.

References: [WCAG 2.2](https://www.w3.org/TR/WCAG22/),
[WAI quick reference](https://www.w3.org/WAI/WCAG22/quickref/),
[Playwright accessibility testing](https://playwright.dev/docs/accessibility-testing).
