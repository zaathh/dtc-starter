# Keyboard Task Follow-up — RUN-A11Y-20261027-008

October 27, 2026. Result: selected keyboard tasks completed with explicit task-entry
navigation bypasses. This is not a pass of the complete product-to-order path.

## Method and actual results

AI-authored Playwright automation used Tab, Enter, Space and arrow keys, plus typed
text. No pointer clicks, locator fill, forced focus or selectOption were used.
Chromium 156.0.8078.4, desktop 1440×900, local development server; source checkout
`fc7dafa1b05f02c1dd886724f8d96d0ee8be0155`. The test runner was newly authored
on that checkout. See [manifest](MANIFEST.json) and [runner hash review](VERIFICATION.json).
No results are added to the production baseline's 38 axe scans.

- Starting at the QA product URL: radio arrow selection chose M/White at €35;
  keyboard activation added one item.
- Cart was opened by direct URL as a new task entry. This bypasses the observed
  header navigation problem and does not pass that segment.
- From Cart: keyboard reached checkout. Empty-address submission returned focus
  to the required first-name input. Keyboard typing and native country selection
  populated fictional data, and shipping/manual-payment/review were traversed.
- One simulated guest order confirmed at €45 (€35 item + €10 shipping).
- Account URL was opened as another task entry. Existing synthetic-account login
  and logout completed through keyboard events.

Evidence: `product-added`, `cart-after-escape`, `required-address-error`,
`checkout-review`, `order-confirmation`, `account-signed-in`, and
`account-signed-out` PNG/snapshot pairs. Synthetic email/address/order references
are test data. No real payment, production system, database reset or account
creation was involved.

## Navigation barriers and limitations

Attempts [004](../RUN-A11Y-20261027-004/REPORT.md),
[005](../RUN-A11Y-20261027-005/REPORT.md),
[006](../RUN-A11Y-20261027-006/REPORT.md), and
[007](../RUN-A11Y-20261027-007/REPORT.md) remain incomplete. Enter on the nested
header Cart link did not navigate; the popover action provided another route,
but subsequent bounded Tab traversal did not reach checkout, even after an Escape
attempt. These development-mode observations strengthen the need to investigate
A11Y-004. They do not establish an inescapable trap, root cause or production-build
reproduction. A direct Cart task entry did reach checkout.

No screen-reader output, physical mobile device, full focus visibility/obscuration
review, or whole-criterion keyboard compliance is established. The WCAG matrix
remains six demonstrated failures and 49 whole-criterion Not Tested dispositions;
partial keyboard evidence has expanded without claiming a complete pass.

## Reproduce

From `apps/storefront`, with the local dev server/backend, prepared QA fixtures
and ignored synthetic credentials:

```bash
pnpm exec node tests/accessibility/run-keyboard-flow.mjs RUN-A11Y-YYYYMMDD-NNN
```

The default path tests header navigation and may stop with evidence. To assess
Cart-to-checkout and account tasks separately, use a fresh run ID and append
`--direct-cart-entry`. This option deliberately bypasses product-to-Cart navigation;
it must not be used to claim that segment passed. Each run has an isolated browser
context; completed runs create a simulated local order. New output directories
are required and never overwritten.
