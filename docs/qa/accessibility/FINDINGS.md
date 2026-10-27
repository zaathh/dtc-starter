# Accessibility Findings — Local Baseline

Run: [RUN-A11Y-20261027-003](../reports/RUN-A11Y-20261027-003/REPORT.md).
All findings are open. These are seven actionable groups, not seven proven root
causes or a count of all individual defects. Repeated instances are retained in raw
axe results. Severity/priority proposals require owner triage. No product fix or
risk acceptance is included. AI performed this assessment; owner verification of
earlier functional tests does not establish human verification of these findings.

## A11Y-001 — Form controls lack associated accessible names

Proposed S2 / D1; WCAG 1.3.1 and 4.1.2.
Open `/dk/account`: Password is visible but the input has no id/associated label,
ARIA name or meaningful placeholder. Open a QA cart and checkout: quantity and
country selects and several address inputs also fail naming checks.
Expected: each control exposes its visible purpose programmatically.
Actual: axe `label`/`select-name` and rendered DOM identify unnamed controls;
visual labels alone are insufficient. This increases uncertainty for assistive
technology users; task completion with VoiceOver has not been tested.

Evidence: [password](../reports/RUN-A11Y-20261027-003/automated/desktop-account-login.json),
[checkout](../reports/RUN-A11Y-20261027-003/automated/desktop-checkout-address.json),
[cart DOM](../reports/RUN-A11Y-20261027-003/manual/cart-control-labels.json).
Candidate shared component: `apps/storefront/src/modules/common/components/input/index.tsx`;
select instances need separate review.

## A11Y-002 — Icon buttons expose no action name

Proposed S2 / D1; WCAG 4.1.2.
Inspect account password visibility, cart delete and product accordion controls.
Expected: an accessible name describes each action, including its context/state.
Actual: SVG-only controls have no accessible text, label or title; axe reports
`button-name`. The actual cart accessibility tree contains an unnamed button.
Do not infer a screen reader's exact spoken output from this tree.

Evidence: [account](../reports/RUN-A11Y-20261027-003/automated/desktop-account-login.json),
[product](../reports/RUN-A11Y-20261027-003/automated/desktop-product.json),
[cart tree](../reports/RUN-A11Y-20261027-003/manual/keyboard-cart-quantity-completed.txt).

## A11Y-003 — Logo/thumbnail links lack discernible names

Proposed S3 / D2; WCAG 2.4.4 and 4.1.2.
Tab to footer Medusa/Next.js logo links or inspect the cart thumbnail link.
Expected: the link purpose is available without relying on recognizing its image.
Actual: focusable anchors contain no accessible text/name; axe `link-name`
appears in all 38 primary scans. Footer authorship links must be preserved when fixed.

Evidence: [home raw result](../reports/RUN-A11Y-20261027-003/automated/desktop-home.json)
and [cart raw result](../reports/RUN-A11Y-20261027-003/automated/desktop-cart-filled.json).

## A11Y-004 — Interactive elements are nested

Proposed S3 / D2; WCAG 4.1.2.
On desktop, Tab through Account and Cart. Expected: distinct actions have valid
semantics and predictable focus. Actual: Cart is a focusable anchor inside a
popover button; the keyboard interaction reached both consecutively. axe also
flags nested controls in checkout delivery/payment; inspect each before fixing.
Exact assistive-technology consequences remain untested.

Evidence: [Cart button](../reports/RUN-A11Y-20261027-003/manual/keyboard-header-cart-button.txt),
[Cart link](../reports/RUN-A11Y-20261027-003/manual/keyboard-header-cart-link.txt),
[delivery raw result](../reports/RUN-A11Y-20261027-003/automated/desktop-checkout-delivery.json).

## A11Y-005 — Menu flag lacks alternative/decorative semantics

Proposed S3 / D2; WCAG 1.1.1.
Open Menu and inspect the Denmark flag beside the country text. Expected: meaningful
images have alternatives; redundant decorative images have appropriate empty
alternative/presentation semantics. Actual: the `img` has neither alt nor an
accessible name/presentational role. Determine decorative intent before choosing
the fix; do not add redundant announcements blindly.

Evidence: [stable desktop menu](../reports/RUN-A11Y-20261027-003/supplemental/stable-menu-1440.json)
and [screenshot](../reports/RUN-A11Y-20261027-003/supplemental/stable-menu-1440.png).

## A11Y-006 — Normal text does not meet minimum contrast

Proposed S3 / D2; WCAG 1.4.3.
Inspect Add Promotion Code(s), invalid-login feedback and small menu country/footer
text after its transition completes. Expected: normal-size text contrast at least
4.5:1. Actual examples: blue `#3b82f6` on white is approximately 3.68:1;
pink `#f43f5e` on white approximately 3.67:1; stable menu white on `#818389`
approximately 3.79:1. axe truncates some displayed ratios to 3.67/3.78.
These are text contrast findings, not a pass/fail assessment of every UI color.

Evidence: [cart](../reports/RUN-A11Y-20261027-003/automated/desktop-cart-filled.json),
[login error](../reports/RUN-A11Y-20261027-003/automated/desktop-account-error.json),
[stable menu recheck](../reports/RUN-A11Y-20261027-003/supplemental/stable-menu-1440.json).

## A11Y-007 — Some keyboard focus indicators are invisible

Proposed S2 / D1; WCAG 2.4.7.
From a fresh home page, press Tab to Menu. Expected: a visible focus indicator.
Actual: focus-visible is true but outline is transparent and there is no box
shadow or visible change. The observed quantity select also had a transparent
outline/no box shadow when keyboard-focused. Product radio labels and Add to cart
did display focus treatment; this finding is not generalized to every control.

Evidence: [Menu screenshot](../reports/RUN-A11Y-20261027-003/manual/keyboard-menu-focused.jpg),
[focus styles](../reports/RUN-A11Y-20261027-003/manual/OBSERVATIONS.json),
[quantity screenshot](../reports/RUN-A11Y-20261027-003/manual/keyboard-cart-quantity-completed.jpg).

## Needs review and separate follow-up

- `target-size`: 40 node occurrences in 32 primary scans. Review WCAG 2.5.8
  spacing/equivalent-target exceptions and overlapping nested controls before
  confirming an independent defect. Do not count every sub-24px target as a failure.
- Nine axe incomplete rule occurrences remain Needs Review. Preserve their raw
  reasons; do not convert them into passes or confirmed defects.
- Invalid coupon feedback in the local production build exposed React error #441
  instead of useful business wording. This is recorded in the manifest, not
  accepted as expected feedback or added to the previous manual bug count.
  Reproduce and triage separately before changing application behavior.
- VoiceOver announcements, full keyboard-only checkout, all states at zoom/reflow/
  text spacing, orientation and other criterion-level gaps remain open in the matrix.

### A11Y-004 keyboard follow-up

[RUN-A11Y-20261027-008](../reports/RUN-A11Y-20261027-008/REPORT.md) links four
incomplete development-mode navigation attempts and completed separate checkout/
account keyboard tasks. Header Cart Enter did not navigate, and a bounded Tab
traversal after the popover route did not reach checkout. Investigate this with
production-build reproduction and a focused event/focus trace. Do not promote it
to a confirmed keyboard trap or close the nested-interaction finding based on
the direct-URL workaround.
