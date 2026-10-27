# Playwright Pre-publication Revalidation — RUN-PW-20261027-002

Disposition: **Executed with known defects; ready to publish as a scoped QA checkpoint.** No release acceptance, defect fix, security clearance or whole-application pass is claimed.

- Date: October 27, 2026, Asia/Jakarta. Runner UTC start: `2026-10-27T03:58:28.356Z`; duration: 124.8 seconds; exit code 0.
- Local Next.js/Medusa development services passed preflight. Same fixture namespace and Chromium projects as the [initial run](../RUN-PW-20261027-001/REPORT.md).
- Known-failure annotations were moved after successful page/navigation/measurement prerequisites so those setup errors are not silently accepted as known defects.
- One worker, zero retries, fresh context per test. Three additional simulated local guest orders completed; no database reset, real payment or production application interaction.
- Test scripts were in the working tree based on `f541920` when executed and are included in the publication commit. No app source changed.

| Project | Actual pass | Expected failure | Unexpected |
| --- | --- | --- | --- |
| desktop | 16 | 1 | 0 |
| mobile | 15 | 2 | 0 |
| tablet | 16 | 1 | 0 |
| Total | 47 | 4 | 0 |

The 51 execution records and sanitized failure messages are in [RESULTS.json](RESULTS.json). No test was skipped or flaky. Runner output `51 passed` means all expected statuses matched, not that all acceptance assertions passed. BUG-001 remained visible as Page not found on all three projects; BUG-002 measured 398 px document width against 390 px mobile viewport. Both remain open.

[Phase 1–4 audit and limitations](../PHASES-1-4-AUDIT-20261027.md) · [Run/learning instructions](../../../../apps/storefront/tests/e2e/README.md)

Raw reports, traces, credentials and the deliberate learning failure are excluded from publication. Selected screenshots below contain synthetic checkout data only.

[desktop-order-confirmation.png](evidence/desktop-order-confirmation.png)

[mobile-order-confirmation.png](evidence/mobile-order-confirmation.png)

[tablet-order-confirmation.png](evidence/tablet-order-confirmation.png)
