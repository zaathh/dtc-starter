# Phase 1–4 Checkpoint Audit

Recorded: October 27, 2026 (Asia/Jakarta).
Disposition: **Ready to publish the scoped QA checkpoint, with known defects and declared coverage gaps.** This is not an unqualified cycle pass, a production release approval, a security audit, or certification.

## Phase-level assessment

| Phase | Evidence reviewed and current checks | Checkpoint assessment |
| --- | --- | --- |
| 1 — Local setup | Upstream README and MIT license; current Node 24.4.1/pnpm 10.11.1; local service/fixture preflight succeeded; browser checkout persisted synthetic orders. Application environment is documented in the [manual run](RUN-20261026-001/REPORT.md). | Existing local environment works for the selected checks. Installation/migration was not repeated or a new database created during this audit. No production-build or security-pass claim. |
| 2 — Plan | [Version 1.3 plan](../QA_TEST_PLAN.md), [test basis](../TEST_BASIS.md), [risk register](../RISK_REGISTER.md), report templates and the owner-approved basic baseline. Updated stale Phase 4/directory status and linked actual artifacts. | Planning artifacts present; detailed business requirements and broader acceptance decisions remain pending. |
| 3 — Manual execution | [26 cases](../test-cases/MANUAL_TEST_CASES.md), [initial execution](RUN-20261026-001/REPORT.md), [mobile/tablet follow-up](RUN-20261026-002/REPORT.md), original evidence and owner-reported verification. Counts validated against JSON: 25 Pass / 1 Fail for the functional suite; supplemental layout check is separate. | Bounded execution complete with defects. Owner confirmation is documented, not misattributed to captured AI evidence. API business checks exist as manual HTTP evidence. |
| 4 — Initial automation | Playwright Test 1.64.1, seven spec files, 17 scenarios × three Chromium viewport projects; [guide](../../../apps/storefront/tests/e2e/README.md). [Fresh pre-publication run](RUN-PW-20261027-002/REPORT.md) after known-failure annotation review. | Initial critical-flow suite implemented and executed: 47 actual passes, four expected failures, zero unexpected failures/skips/flaky results. Not an exhaustive automation or browser matrix. |

## Fresh automated results

| Project | Actual pass | Expected failure | Unexpected failure |
| --- | --- | --- | --- |
| Desktop — 1440 × 900 | 16 | 1 | 0 |
| Mobile — 390 × 844 | 15 | 2 | 0 |
| Tablet — 768 × 1024 | 16 | 1 | 0 |
| Total | 47 | 4 | 0 |

The runner exited 0 and printed `51 passed`, meaning all declared expected statuses matched. Four actual acceptance tests still failed. BUG-001 reproduces on three sizes; BUG-002 reproduces on mobile. These are **two unique defects**, not four distinct bugs. Failure messages were reviewed against the documented symptoms. No fix or post-fix retest is claimed.

Known-failure annotations now apply after page/navigation/measurement prerequisites succeed. A setup failure before that point is an ordinary unexpected failure. The deliberate wrong-heading learning exercise was restored, verified passing, and kept outside published regression evidence; it is not a product defect.

## Publication checks performed

- MIT license bytes and storefront author credits match the existing baseline. Upstream README content is retained with an added English QA entry point.
- No changes to `apps/backend` or `apps/storefront/src` were introduced. The existing startup-generated `next-env.d.ts` change and generated storefront `AGENTS.md`/`CLAUDE.md` files are excluded from this QA publication.
- ESLint for the added config/tests passed with zero warnings. Targeted TypeScript checking of those files passed. No whole-repository build/lint or production validation is claimed.
- Markdown links, JSON case/result counts, screenshot dimensions, known-secret scans and the final staged path scope were checked before commit.
- `.env`, `.env.local`, `.env.test.local`, raw Playwright reports/results/traces and auth-state folders are Git-ignored and excluded. Only reviewed synthetic-data screenshots and sanitized summaries are published.
- The lockfile was updated by pnpm for the exact Playwright dev dependency and its peer resolution. Existing dependency/deprecation warnings were recorded; no dependency security clearance is implied.
- No application production systems were tested or modified. The test target is fixed to localhost and checkout selects only the local Manual Payment provider.

## Declared limitations and next work

- The suite needs the documented local database fixtures and synthetic credentials. A fresh clone does not automatically seed those records; the guide states this prerequisite. No reset/destructive bootstrap is performed.
- API stock limits, repeat cart completion and cross-account authorization have manual evidence; their full business API automation remains deferred. Country switching and the full footer-link set are also not automated.
- Firefox/WebKit, physical devices, touch/virtual-keyboard behavior, landscape/orientation, CI and production-build verification are not completed. No QA CI badge or workflow is added.
- Performance/Lighthouse, accessibility/axe/manual WCAG assessment, reviewed product fixes, and final regression/case study remain Phases 5–8. None is implied by passing UI tests.
- BUG-001 and BUG-002 remain open with proposed classifications. Publishing this checkpoint does not approve residual risk or close those defects.

## Branch and review flow

Publish `test/playwright-setup` as a draft PR based on `test/manual-qa`. The manual branch is based on `docs/qa-test-plan`; PR #1 and PR #2 are still awaiting review. Review/merge the parent PRs in order and retarget dependants as appropriate. No merge or production deployment is authorized by this checkpoint publication.
