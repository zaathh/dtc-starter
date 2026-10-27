# Accessibility Baseline — RUN-A11Y-20261027-003

Date: October 27, 2026, Asia/Jakarta. Result: automated scope completed with
findings; manual assessment partial. **WCAG conformance is not established.**
No product fixes, release acceptance or owner manual confirmation of this run.

## Environment and scope

Local production build at `http://localhost:8000/dk`, backend on localhost:9000.
Application checkout `1df2ae398512f9c70cbd3790711b8df3aa7d6443`, branch
`test/accessibility-baseline`, build ID `frzRcUQusiOSY97UXUJYw`.
The build was generated in Phase 5; no application source change was made for this
assessment. Node 24.4.1, Playwright 1.64.1, Chromium 156.0.8078.4,
`@axe-core/playwright`/axe-core 4.14.0. Full metadata: [MANIFEST.json](MANIFEST.json).

Nineteen states each at 1440×900 and 390×844: home, open menu, catalog,
empty search, product, selected variant, empty/filled/invalid-coupon cart,
checkout address/required-field error/delivery/payment/review, confirmation,
account login/error/signed-in/signed-out. Guest purchase and existing-customer
sign-in/out were traversed. Registration/recovery/admin/real payments are excluded.
Viewport coverage is Chromium emulation, not physical-device verification.

Tags: `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`.
No rule suppression, node exclusion, best-practice or AAA-rule inclusion.
The tags do not automate every A/AA criterion, including WCAG 2.2 A requirements.

## Actual automated results

- 38/38 primary scans completed; all 38 contained at least one violation.
- Eight distinct axe rule IDs; 169 rule occurrences and 289 node occurrences.
  These are repeated observations, **not 169 or 289 unique bugs**.
- Nine incomplete rule occurrences remain Needs Review.
- Two additional settled-menu axe scans are retained separately and excluded
  from those primary totals. Both retained contrast and image-alt findings.
- Two isolated synthetic guest orders completed with manual payment, each €45
  (€35 item + €10 shipping). No real payment, email delivery verification or
  production system was involved. Existing data was not reset.

| Rule | Primary scan occurrences | Primary node occurrences |
| --- | ---: | ---: |
| button-name | 18 | 24 |
| color-contrast | 27 | 51 |
| label | 12 | 40 |
| link-name | 38 | 90 |
| nested-interactive | 32 | 34 |
| target-size | 32 | 40 |
| select-name | 8 | 8 |
| image-alt | 2 | 2 |

[SUMMARY.json](SUMMARY.json) contains reproducible aggregation. Original axe JSON
retains violations, incomplete, passes and inapplicable rules. Each primary scan
has an accessibility snapshot and full-page screenshot in [automated](automated/).
Native accessibility text is retained verbatim; four lines in three manual `.txt`
files contain original trailing spaces. They are evidence, not code-formatting defects.
Seven actionable groups, including one manual focus finding, are documented in
[FINDINGS.md](../../accessibility/FINDINGS.md). Target size remains review-only.

## Manual/browser and supplemental observations

AI operated the in-app browser at 1280×720 using native keyboard interactions.
This is not a claim of execution by a human tester. [Manual observations](manual/OBSERVATIONS.json)
and screenshots show:

- Menu opens with Enter, closes with Escape and returns focus to Menu.
- Menu has no visible keyboard focus; the quantity select also lacks a visible
  indicator. Product radio labels and Add to cart did display focus treatment.
- Radio arrow keys select M/White at €35; keyboard activation adds it to cart.
- Native select keyboard interaction eventually updates quantity to 2 and total
  to €70. Earlier intermediate snapshots show pending state; the completed
  snapshot is the final observation, not a separate failure.
- Cart has consecutive parent-button/child-link tab stops and unnamed delete/
  quantity controls. The QA-created line was removed; Cart (0) was verified.

An isolated headed Chromium account page was observed at native browser 200%
zoom and reset to 100% afterward; [screenshot](manual/native-zoom-200.jpg) and
[browser tree](manual/native-zoom-200.txt) are retained. Full-page usability at
200% was not verified, so WCAG 1.4.4 remains Not Tested at whole-criterion scope.

[Supplemental observations](supplemental/OBSERVATIONS.json) contain programmatic
probes on home/catalog/product/account at 320px, with and without line-height 1.5,
paragraph spacing 2em, letter spacing .12em and word spacing .16em. All eight
measurements had document width 320px and no measured out-of-viewport controls.
Screenshots are retained. This does not prove absence of all clipping/overlap or
cover the complete checkout process. Empty-email submission focused the input,
with native `valueMissing` and “Please fill out this field.” recorded.

VoiceOver activation/spoken output could not be verified through the available
interaction surface. An accessibility-tree snapshot is not a screen-reader test.
No assistive-technology pass or change to OS VoiceOver settings is claimed.

## Criterion coverage and limitations

The [55-criterion matrix](../../accessibility/WCAG22_MATRIX.md) records six
demonstrated criterion failures and 49 Not Tested dispositions at whole-criterion
scope. Partial probes are documented within those dispositions. No criterion is
passed solely because axe passed or found an inapplicable rule.

All findings remain open. Complete keyboard-only purchase/login, screen-reader
announcements and broader manual criterion coverage are outstanding. The scoped
baseline is usable for reviewed fixes; the full manual accessibility assessment
is not finished. Performance improvements or whole-site WCAG 2.2 AA compliance
are not claimed.

Earlier runs [001](../RUN-A11Y-20261027-001/REPORT.md) and
[002](../RUN-A11Y-20261027-002/REPORT.md) are incomplete due to runner assumptions;
their counts are excluded. Production invalid-coupon feedback included React
error #441; the complete runner scans that observed error state without approving
its wording. See manifest observations and the separate follow-up in findings.

## Reproduction and next gate

See [runner guide](../../../../apps/storefront/tests/accessibility/README.md).
Repeat against a matching local production build and prepared synthetic fixtures,
using a new run ID. Exit code 2 means completed scans with findings, not setup
failure. Local development serving is restored after this assessment.
Fixes require the separately authorized Phase 7; no automatic push/merge is included.
