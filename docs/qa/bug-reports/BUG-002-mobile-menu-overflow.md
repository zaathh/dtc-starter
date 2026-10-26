# BUG-002 — Mobile navigation menu exceeds viewport width by 8 px

Status: **New — reproduced; owner triage pending**.
Reporter/executor: AI QA assistant, local responsive follow-up.
Proposed severity: **S4 (Minor)**. Proposed fix priority: **D3**. No task-blocking impact observed.

## Environment

Local development storefront, unchanged application baseline; desktop Codex in-app browser with a 390 × 844 CSS px viewport override. Not a physical-device or Safari finding.

## Reproduction

1. Open `http://localhost:8000/dk` at 390 × 844.
2. Open Menu.
3. Read document scrollWidth and the open panel bounding rectangle after animation.
4. Close Menu and compare document width.

Expected: opening the navigation panel keeps its bounds within the viewport and does not enlarge the document horizontally.

Actual: viewport 390, document scrollWidth 398; menu panel left 8, right 398, width 390. A later read showed transform none and the same bounds. Closing restored document scrollWidth 390. At 768 × 1024 the open menu did not overflow the document: width 768, panel right 391.

Impact: 8 px horizontal layout overflow on the tested narrow viewport. Menu actions remained usable. No claim about physical touch scrolling, inaccessible content, WCAG conformance, or other breakpoints.

## Evidence

- [Open menu geometry](../reports/RUN-20261026-002/evidence/mobile-menu-geometry.json)
- [Closed menu geometry](../reports/RUN-20261026-002/evidence/mobile-menu-closed-geometry.json)
- [Tablet comparison](../reports/RUN-20261026-002/evidence/tablet-menu-geometry.json)
- [Recheck screenshot](../reports/RUN-20261026-002/evidence/mobile-menu-overflow-recheck.jpg)
- [Execution report](../reports/RUN-20261026-002/REPORT.md)

No fix, source-level root cause, post-fix retest, or owner risk acceptance is claimed.

## Owner-reported manual confirmation

The owner subsequently reported checking the mobile and tablet cases manually and confirmed agreement with the findings. No additional screenshots, exact device/browser details, or per-step log were supplied. This is confirmation of the finding, not a fix retest; status remains open.
