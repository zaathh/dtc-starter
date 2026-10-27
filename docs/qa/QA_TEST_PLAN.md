# QA Test Plan — Medusa DTC Starter

Status: Version 1.4 — local manual, responsive, initial critical-flow automation and a scoped Lighthouse baseline linked. Detailed business criteria, coverage gaps and performance budgets remain pending; no release acceptance is implied.
Planning date: October 26, 2026 (Asia/Jakarta).
Upstream: https://github.com/medusajs/dtc-starter
Portfolio fork: https://github.com/zaathh/dtc-starter
Inspected application commit: `204130a32d80b704ab509069dcc1a2f8a61f51c1`.

Document owner: portfolio owner (`zaathh`). Preparation/review support: AI QA mentor; no independent human review is claimed.

Companion documents: [Test basis and traceability](TEST_BASIS.md), [Risk register](RISK_REGISTER.md), [execution report template](templates/TEST_EXECUTION_REPORT.md), and [defect report template](templates/DEFECT_REPORT.md).

## 1. Purpose and reporting boundaries

Demonstrate a reproducible QA process through test planning, test cases, execution evidence, defect reports, automation, performance baselines, accessibility assessments, reviewed fixes, and regression testing.

Medusa created the application. Portfolio contributions consist of the QA work and changes actually performed. Preserve the upstream MIT license, copyright notices, and credits.

This document describes intended coverage, not passing results. A feature's presence in source code does not establish that it works correctly. Expected behavior inferred solely from implementation is provisional and must be reviewed before being used as a defect-reporting criterion.

## 2. Environment observed during exploration (Phase 2 snapshot)

| Component | Known condition |
| --- | --- |
| Operating system | macOS on Apple Silicon |
| Runtime | Node.js 24.4.1; pnpm 10.11.1 |
| Application | Medusa 2.22.0; Next.js 16.3.8; storefront React 19.0.5 |
| Storefront | `http://localhost:8000`, development mode |
| Backend / admin | `http://localhost:9000` / `http://localhost:9000/app` |
| Database | PostgreSQL 15.17; dedicated loopback instance on port 15432; database `medusa_dtc_qa` |
| Initial data | Four products and one region; default storefront country `dk`; EUR displayed on the inspected product |
| Payments | Manual/system provider in seed data; Stripe has not been configured |
| Accounts | No local admin or dedicated QA customer account has been created by this work |
| Exploration browser | In-app browser; exact browser version has not yet been recorded |

Local environment files are ignored by Git. Published evidence must exclude credentials, session tokens, personal data, and secret values.

Before Phase 2, Next.js startup modified `apps/storefront/next-env.d.ts` and generated storefront `AGENTS.md` and `CLAUDE.md` files. Record relevant working-tree differences alongside the tested commit when executing tests.

## 3. Exploration actually performed

- The storefront returned HTTP 200 and the backend `/health` endpoint returned `OK` at the start of Phase 2.
- The home page exposed navigation, search, account, cart, category, and policy links.
- The Shirts category displayed a Medusa T-Shirt priced at EUR 10.00.
- The product page displayed S/M/L/XL size choices, Black/White color choices, images, an In stock status, and an Add to cart button. Individual variant interactions were not formally tested.
- The cart panel in the exploration session displayed zero items and an empty-cart message.
- The account page displayed email/password fields, Sign in, and Join us. No registration or login form was submitted.
- The All products page exposed search and sorting controls. Search results, filter behavior, and sorting accuracy have not been formally tested.
- Routes and components for checkout, profiles, addresses, order history, account verification, and order transfers were found in source code; these flows were not executed.

No order was created during this exploration. At the end of Phase 2, no verified defect, Lighthouse report, axe result, or Playwright execution result had been produced. The later Phase 3 record is linked below.

## 4. Sources of expected behavior

Use agreed requirements and acceptance criteria first, followed by the README and official documentation, then API contracts. Treat implementation behavior as a provisional design clue rather than an independent specification.

No separate business requirements specification was identified during this inspection. Detailed validation and store policies must be clarified while designing Phase 3 test cases. Record assumptions explicitly.

For example, inspected product code adds the selected variant with quantity 1. The inventory helper considers a variant available when inventory is not managed, backorders are allowed, or inventory quantity is positive. These observations inform scenario design; they are not passing results or confirmation that the business rules are correct.

## 5. Risk-based scope

P1 denotes high impact on purchasing, transaction values, or account privacy. P2 covers important product-discovery and usability behavior. P3 covers supporting information. These are test priorities, not defect severity ratings. The [risk register](RISK_REGISTER.md) adds explicit likelihood/impact estimates and treatment. Its numbers are planning judgments, not measured failure rates.

| Area | Priority | Planned focus |
| --- | --- | --- |
| Products and variants | P1 | Selected variant, price, availability, and invalid combinations |
| Cart | P1 | Add/update/remove, totals, refresh persistence, sessions, and valid/invalid promotions |
| Checkout and orders | P1 | Addresses, countries within the selected region, shipping, simulated payment, totals, confirmation, and repeated submissions |
| Accounts and authorization | P1 | Registration, login/logout, sessions, and ownership of profiles, addresses, and orders |
| Inventory | P1 | Zero/one/normal stock, quantity boundaries, backorders, and stock changes before checkout |
| Catalog and search | P2 | Categories, matching/no-result searches, sorting, price/option filters, and pagination |
| Regions | P2 | Country selection, applicable prices/currency, and cart consistency after region changes |
| Navigation and responsive layout | P2 | Menus, links, loading/error/empty states, and desktop/mobile layouts |
| Information pages | P3 | Contact, shipping, returns, terms, privacy, and link consistency |
| Verification and order transfer | P2, conditional | Valid/invalid tokens, recipient access, and expiry according to confirmed contracts |
| Administration | Conditional | Admin access and test-data preparation; broader CRUD coverage requires an account and agreed scope |

Accessibility and performance coverage span these areas, prioritizing navigation and the purchasing flow.

## 6. Initial exclusions

- Production systems, third-party public demos, real financial transactions, and messages to real recipients.
- Comprehensive security audits, penetration testing, load/stress testing, and accessibility certification claims.
- Live Stripe payments, real fulfillment, email delivery, and external services that have not been configured.
- UCP/MCP commerce endpoints for agentic checkout: found in the routes, deferred from the initial storefront scope.
- Claims that the whole application is defect-free or conforms fully to WCAG 2.2 AA based only on sampled pages.

## 7. Test data and prerequisites

With user approval, prepare two synthetic customer accounts A/B for ownership checks, a local admin account, fictional addresses for supported countries, valid/invalid promotions, and variants with zero/one/normal stock. Use `.test` email addresses and no real personal or payment data.

The four initial products cannot exercise pagination because the catalog configures 12 products per page. Additional reproducible data is required to test page boundaries.

Verification and transfer testing require a decision on local test tokens or an email sink. Do not send mail to real recipients. Do not reset or drop a database containing user work without explicit approval. Record prerequisites and data changes for each run.

## 8. Approach and phase sequence

### Phase 3 — Manual QA

Write detailed test cases before formal execution. Cover positive/negative paths, equivalence partitions, boundary values, and state transitions. Record expected and actual results with evidence for each case.

### Phase 4 — Critical-flow automation

After installation approval, configure Playwright and automate understood priority flows. Initial candidates are catalog → variant → cart → simulated checkout, login/logout, and key empty/error states. Tests must use reproducible data and avoid order dependencies.

Planned browser matrix: Chromium desktop as primary, then Firefox and WebKit when available through Playwright. Proposed viewports: 1440×900 and 390×844. Record exact versions and unavailable-browser gaps. Mobile emulation must not be reported as physical-device testing.

### Phase 5 — Performance baseline

Run Lighthouse against a production build served locally, covering home, catalog, product, and a populated checkout state. Record the commit, date, browser/Lighthouse versions, viewport, CPU/network throttling, cache state, session state, test data, and machine conditions.

Plan three runs per page for mobile and desktop profiles. Preserve all HTML/JSON reports and report medians per metric. Capture available FCP, LCP, CLS, TBT, Speed Index, and performance scores. TBT is not INP; lab measurements must not be described as real-user field data.

Establish the baseline and proposed improvement budgets from actual measurements. Compare before/after results under the same documented conditions and discuss variability. Do not invent scores or promise an improvement percentage before measurement.

### Phase 6 — Accessibility assessment

Combine axe with manual evaluation of applicable WCAG 2.2 Level A and AA criteria within the agreed scope. Planned manual coverage includes keyboard operation, focus order/visibility/obscuration, dialogs, labels/errors/status announcements, contrast, target size, zoom/reflow, authentication, and macOS VoiceOver.

Record criteria as passed, failed, not tested, or not applicable, with evidence or rationale. Automated results alone do not establish WCAG conformance; sampled-page findings do not establish whole-site conformance.

### Phase 7 — Reviewed fixes

Select reproducible issues, propose small changes, obtain permission before modifying application code or configuration, and retain upstream licensing and credits.

### Phase 8 — Retest and case study

Retest fixes, run regression checks, repeat performance measurements under equivalent conditions, and write a case study with clear attribution, evidence, and reporting boundaries.

## 9. Entry, pause, and exit criteria

Begin formal execution after reviewing scope and expected results, confirming local service health, preparing required accounts/data, and establishing test cases and evidence storage. Mark cases Blocked when prerequisites are missing.

Pause affected checks if services are unavailable, test data interferes with other work, or results cannot be reproduced. Investigate and record the cause before resuming.

Apply the following gates separately:

- **Phase 2 documentation complete:** scope, environment, risks, ownership, proposed test basis, reporting rules, and unresolved decisions are recorded. This does not approve every proposed business criterion.
- **Formal execution ready:** the particular case has a reviewed oracle, reproducible data, available dependencies, and a recorded environment. Pending requirements may be investigated exploratorily, but must not receive a formal Pass/Fail verdict against an unapproved business assumption.
- **Unqualified cycle pass:** every in-scope P1 case has a latest valid Pass on the final tested revision; no P1 case is Not Run, Blocked, or excluded without a documented scope decision; all reported failures are triaged; no open S1/S2 defect remains; fixes and affected regressions are retested. Report all lower-priority outcomes and gaps.
- **Completion with exceptions:** if time, environment, or accepted residual risk prevents the pass gate, issue a completion report explicitly labeled **Completed with exceptions**, **Incomplete**, or **Blocked**, as appropriate. A waiver never converts a failed, blocked, or unexecuted case to Pass. Record the owner's decision, date, scope, impact, and follow-up.
- **Performance assessment complete:** baseline and comparison artifacts exist under matching conditions, agreed budgets have a verdict, and variability/limitations are disclosed. Missing budgets or measurements preclude a performance-pass claim.
- **Accessibility assessment complete:** all applicable A/AA criteria within the declared pages and complete processes have an evidence-backed disposition; unresolved findings and untested criteria remain visible. A scoped assessment is not whole-site certification.

These are project-defined gates, not universal ISTQB thresholds or authorization for a production release.

## 10. Reporting and portfolio evidence

Test-case statuses: Not Run, Pass, Fail, Blocked, and Not Applicable. Each execution records date, commit, browser/viewport, data, expected/actual results, and evidence links. Maintain traceability from requirement/area → test case → defect → fix → retest.

Defect reports include a summary, reproduction steps, expected/actual behavior, environment, justified severity, reproduction frequency, and sanitized screenshots/video/logs. Unreproduced inspection findings remain investigation candidates.

Planned repository structure:

- `docs/qa/QA_TEST_PLAN.md`
- `docs/qa/TEST_BASIS.md`
- `docs/qa/RISK_REGISTER.md`
- `docs/qa/templates/` for reusable report forms
- `docs/qa/test-cases/`
- `docs/qa/bug-reports/`
- `docs/qa/reports/` for execution, performance, and accessibility summaries

The implemented automation is in `apps/storefront/tests/e2e/`, with configuration in `apps/storefront/playwright.config.ts`. Detailed manual cases, defect reports and execution artifacts are present in the directories above. See the [Playwright guide](../../apps/storefront/tests/e2e/README.md) and [Phase 1–4 checkpoint audit](reports/PHASES-1-4-AUDIT-20261027.md). Templates alone do not count as execution evidence.

Use English for repository documentation, test descriptions, defect reports, and portfolio content. Mentoring conversations may remain in Indonesian.

Use task branches and reviewed pull requests to separate QA work from the main branch. Commit/push and GitHub Actions setup are separate actions; no published QA badge or workflow is claimed here. Attribute existing upstream tests to their authors and identify newly authored QA work.

## 11. References

- [Upstream README](https://github.com/medusajs/dtc-starter#readme) and the local root `AGENTS.md`.
- `apps/storefront/src/modules/products/components/product-actions/index.tsx`
- `apps/storefront/src/lib/util/inventory.ts`
- `apps/storefront/src/lib/data/cart.ts` and `customer.ts`
- `apps/storefront/src/modules/store/templates/index.tsx`
- `apps/storefront/src/modules/checkout/` and `apps/storefront/src/app/`
- `apps/backend/src/migration-scripts/initial-data-seed.ts`
- [ISTQB CTFL v4.0.1](https://istqb.org/wp-content/uploads/2024/11/ISTQB_CTFL_Syllabus_v4.0.1.pdf): sections 1.4.4, 5.1, 5.2, 5.3, 5.4, and 5.5 inform the approach.
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [Lighthouse score variability](https://github.com/GoogleChrome/lighthouse/blob/main/docs/variability.md)

## 12. Phase 2 outcome and open decisions

The feature map, test priorities, environment, data limitations, test approach, completion criteria, and evidence plan have been documented. The user authorized saving this English version in the repository. No formal Phase 3–8 testing has been performed as part of this planning work.

Phase 3 update: dedicated data/accounts have been prepared and the first bounded manual cycle is recorded in [RUN-20261026-001](reports/RUN-20261026-001/REPORT.md). Pending work includes detailed acceptance rules, broader coverage and performance budgets after baseline measurement. The mentor explains decisions and reasoning; answering quizzes is not a prerequisite for progress.


## 13. Governance, responsibility, and review

| Responsibility | Accountable decision-maker | Preparation / execution support |
| --- | --- | --- |
| Portfolio scope and acceptance assumptions | Portfolio owner (`zaathh`) | AI mentor explains tradeoffs and drafts criteria |
| Test design and execution | Portfolio owner | AI mentor assists; identify the actual executor in each record |
| Defect triage and local fixes | Portfolio owner | AI mentor investigates and proposes changes |
| Scope deferrals and residual-risk acceptance | Portfolio owner | AI mentor documents impact; cannot silently accept risk |
| Publication and PR merge | Portfolio owner | AI mentor prepares reviewable artifacts within authorized scope |

This is an individual learning project, not a staffed product team. No upstream product-owner approval, external client acceptance, independent reviewer, or production release authority is implied. AI review is assistance, not independent human sign-off. In a client engagement, replace these roles with the named stakeholders and their actual authority.

Review approach: check criteria for ambiguity, traceability for gaps, and evidence for reproducibility before calling an item complete. Record review comments and dispositions. Notify the owner immediately about a suspected data exposure or environment-destructive action; restrict investigation to synthetic local data and do not publish sensitive evidence.

## 14. Delivery sequence, estimates, and communication

The eight agreed phases are milestone gates. Continue to the next phase only on the user's instruction. Within a phase, review the current artifacts before expanding scope.

| Milestone | Output | Depends on | Planning status |
| --- | --- | --- | --- |
| Phase 2 planning revision | Plan, risk/test-basis registers, report templates | Read-only exploration | Documents prepared; business decisions pending |
| Phase 3 manual QA | Detailed cases, run records, findings | Case-level readiness | Manual and mobile/tablet follow-ups recorded; BUG-001 and BUG-002 remain open with proposed classifications |
| Phase 4 automation | Critical-flow tests and run instructions | Understood flows, tool approval and prepared local fixtures | Initial Chromium suite implemented: 17 scenarios × 3 viewport sizes; API/country/full-footer automation and Firefox/WebKit/CI remain deferred |
| Phase 5 performance | Reproducible baseline artifacts | Production build, controlled setup | Scoped 24-measurement mobile/desktop Lighthouse baseline recorded; budgets and optimization comparison pending |
| Phase 6 accessibility | Automated and manual scoped assessment | Tool approval, agreed page/process scope | Not started |
| Phase 7 fixes | Small reviewed changes and targeted checks | Verified issues, change approval | Not started |
| Phase 8 completion | Retest, regression, comparisons, case study | Earlier artifacts | Not started |

No deadline, paid-service budget, or time commitment has been agreed. Before Phase 3 execution, break the selected scope into tasks and estimate optimistic/likely/pessimistic effort with the owner; re-estimate after the first representative cases. Do not invent a delivery date or treat an estimate as actual effort. Prefer existing local tools; obtain approval for new dependencies, configuration, or paid services.

Communication: provide progress at each working session and each phase boundary, and when a blocker changes the plan. The report includes scope completed, actual outcomes, unresolved risks, deviations, and next actions. Public repo content is English; mentoring is Indonesian. Do not post to upstream issues or contact third parties without explicit instructions.

## 15. Test levels, design, and practical execution rules

Use system/UI and API integration checks for purchasing flows. Existing upstream unit/integration tests can support diagnosis and regression, but record what was actually run and preserve authorship. Add targeted lower-level checks when they reduce risk; do not substitute a large UI suite for every test level or duplicate trivial implementation details.

Map techniques to risks: equivalence partitions and boundary values for quantities/validation; decision tables for inventory/backorder and address/payment readiness; state transitions for cart/checkout/session behavior; exploratory charters for usability and unexpected interactions. API response and UI agreement are useful checks but not an independent oracle when both can share the same calculation defect.

Use deterministic account/data identifiers per run. Record browser locale, timezone, region/currency, viewport, exact browser version, network conditions, and whether caches are cold/warm. Capture frontend and backend revisions if they diverge. Stop a case when a prerequisite fails; do not label downstream steps Pass.

For network/API and duplicate-submit checks, define timeout, retry, and expected persistence semantics before asserting a defect. Never hide failures by repeatedly rerunning until green: retain the first failure, subsequent attempts, and a flaky-test classification when appropriate.

## 16. Defect classification and lifecycle

These scales are local conventions for this project, not mandated industry-wide labels.

| Severity | Impact definition | Example of impact, not a discovered defect |
| --- | --- | --- |
| S1 Critical | Cross-account sensitive-data exposure, destructive data corruption, or widespread inability to use the application | Customer A can read customer B's private order |
| S2 High | Core purchasing flow blocked or transaction materially incorrect without a reasonable workaround | Checkout cannot complete with supported valid data |
| S3 Medium | Feature degraded with a reasonable workaround; core purchasing remains usable | A filter fails while direct navigation remains available |
| S4 Low | Minor presentation/content issue with no material task impact | Nonessential spacing inconsistency |

Fix priority is separate: D1 address before the next acceptance cycle; D2 address in the next planned fix batch; D3 backlog/defer with rationale. The owner selects priority based on impact, likelihood, exposure, dependencies, and effort. Accessibility severity depends on the affected task and user impact; it is not automatically cosmetic.

Lifecycle: **New → Triaged → In Progress → Ready for Retest → Closed**. Failed confirmation testing returns the issue to **Reopened**. Alternate dispositions: **Needs Information**, **Deferred**, **Duplicate** (link the original), **Not a Defect** (state the oracle/rationale), and **Change Request**. Deferring a defect does not close it as fixed.

Close only after confirmation testing on an identified revision and relevant regression checks have evidence. Keep reproduction frequency as an observed fraction with sample size, never an invented probability. Use [the defect template](templates/DEFECT_REPORT.md).

## 17. Traceability, monitoring, and denominators

Use stable identifiers: `AC-###` for acceptance criteria, `RISK-###` for risks, `TC-###` for cases, `RUN-YYYYMMDD-###` for runs, and `BUG-###` for findings. Proposed AC IDs live in [TEST_BASIS.md](TEST_BASIS.md); cases and executions will be linked in Phase 3. Do not assign fictional test or bug IDs to imply completed work.

At each run, define the included case set and retain its membership. Count the latest valid outcome per included case separately from raw attempts. Report Not Applicable and formally deferred scope with reasons rather than silently removing them.

- **Designed coverage:** accepted in-scope criteria linked to at least one reviewed case / all accepted in-scope criteria. Proposed criteria are disclosed separately.
- **Execution progress:** (Pass + Fail) / (Pass + Fail + Blocked + Not Run) for the run's applicable included cases. Blocked is not executed.
- **Pass rate among executed cases:** Pass / (Pass + Fail), displayed alongside execution progress and all status counts.
- **P1 progress:** the same counts restricted to P1; no unqualified cycle pass with a blocked/unexecuted P1 case.
- **Defect view:** unresolved findings by severity, priority, and disposition; distinguish unique bugs from duplicate reports.

If the denominator is zero, display **N/A — no eligible items**, not 0% or 100%. No current percentage is reported because cases and formal runs do not exist. Every phase summary records deviations, untested scope, and residual risk; use [the execution report template](templates/TEST_EXECUTION_REPORT.md).

## 18. Configuration, evidence, and change control

Current working branch: `docs/qa-test-plan`. Documentation is local and uncommitted until a commit is explicitly made; a branch name alone does not isolate uncommitted files. When committing, select the intended files explicitly and review the staged diff. Keep startup-generated changes out of a documentation PR unless separately reviewed.

For each tested revision, record the commit and any uncommitted patch or configuration differences with secrets removed, plus lockfile/tool versions and test-data state. Do not claim evidence for a later revision merely because a prior revision passed. Log baseline changes and rerun affected checks.

Store evidence by run ID with filenames linked from reports. Retain initial failures, retests, relevant sanitized logs/screenshots, and original performance reports. Review artifacts for secrets before publication. Keep large/raw artifacts outside Git when appropriate, but ensure report links are accessible and disclose retention/expiry. Never claim CI or a public report exists before it has been published and verified.

Changes to acceptance criteria, scope, environment, or budgets require a dated decision with rationale and affected cases. Fixes must link to a verified issue, a targeted check, and regression evidence. Commit, push, PR creation, and merge remain separate authorized actions.

## 19. Practices alignment and revision record

This is a project-specific adaptation of professional testing practices, informed by ISTQB and W3C references. It is not an ISTQB certification, ISO/IEC/IEEE 29119 compliance assessment, or proof of WCAG conformance. No organization-wide test policy exists for this portfolio; this document supplies local conventions.

| Guidance area | Project implementation |
| --- | --- |
| Test basis and traceability | TEST_BASIS.md and section 17 |
| Planning and resources | Sections 2, 5–9, 13–15 |
| Risk analysis and treatment | RISK_REGISTER.md |
| Monitoring and completion | Sections 9, 14, 17 and execution report template |
| Configuration management | Section 18 |
| Defect management | Section 16 and defect report template |

| Version | Date | Change | Review status |
| --- | --- | --- | --- |
| 1.0 | 2026-10-26 | Initial plan and limited exploration record | User authorized saving; detailed business assumptions unresolved |
| 1.1 | 2026-10-26 | Added governance, risk scoring, test basis, measurable gates, lifecycle, reporting templates, and change control | Prepared at user request; proposed criteria/estimates are not business sign-off |
| 1.2 | 2026-10-26 | Linked the owner-approved local baseline, scoped manual run, evidence, and open defect | Phase 3 execution complete; no whole-application acceptance or waiver |

## 20. First manual execution record

On October 26, 2026 the owner approved synthetic local fixture changes and a basic acceptance baseline. [The 26-case manual suite](test-cases/MANUAL_TEST_CASES.md) was written before execution. [RUN-20261026-001](reports/RUN-20261026-001/REPORT.md) records 25 Pass and 1 Fail, with all 17 included P1 cases passing their scoped checks. [BUG-001](bug-reports/BUG-001-customer-service-link-404.md) remains open. This is not a whole-application acceptance result, a performance assessment or a WCAG conformance claim.

Version 1.2, dated 2026-10-26: linked actual first-cycle evidence and the owner's limited acceptance/data authorization; no application fix or risk waiver implied. This is the historical 1.2 snapshot; the subsequent Phase 4 update is below.

## Phase 4 checkpoint update — October 27, 2026

The owner approved Playwright setup and test creation, then requested an audit and GitHub publication. The initial [automated run](reports/RUN-PW-20261027-001/REPORT.md) recorded 47 passing executions and four expected failures across 51 executions, without skips or unexpected failures. A fresh pre-publication audit is recorded in [PHASES-1-4-AUDIT-20261027](reports/PHASES-1-4-AUDIT-20261027.md). Known-failure annotations apply only after page/navigation/measurement prerequisites succeed.

The suite depends on the explicitly documented local fixtures and ignored synthetic credentials. It is not a one-command database bootstrap from a fresh clone. Business API checks remain recorded manual evidence, not automated coverage. Cross-browser testing, CI, production-build verification, performance and accessibility have not been completed. This is the historical Phase 4 checkpoint; the subsequent Phase 5 baseline update is below.

| Version | Date | Change | Review status |
| --- | --- | --- | --- |
| 1.3 | 2026-10-27 | Linked responsive and initial Playwright results, current file locations and checkpoint limitations | User requested audit/publication; defects remain open, no release waiver |

## Phase 5 baseline update — October 27, 2026

The owner approved Lighthouse installation, a local performance runner and temporary production serving. [RUN-LH-20261027-002](reports/RUN-LH-20261027-002/REPORT.md) contains 24 completed measurements: four pages × mobile/desktop profiles × three rounds, with original HTML/JSON, screenshots, independent medians, ranges, machine settings and warning records. The prior [RUN-LH-20261027-001](reports/RUN-LH-20261027-001/REPORT.md) remains explicitly incomplete due to a runner URL-validation assumption; it is not mixed into the baseline. Pilot artifacts remain private and excluded.

The measurements show repeatable catalog layout shift, product LCP/image-delivery investigation candidates and mobile checkout main-thread work. These are scoped local lab findings, not performance budget acceptance, achieved improvements, real-user field data or new functional bug counts. Application source/configuration was not optimized. The production server was stopped and the development storefront restored. Accessibility, reviewed fixes, matching before/after comparison and final case study remain future stages.

| Version | Date | Change | Review status |
| --- | --- | --- | --- |
| 1.4 | 2026-10-27 | Linked the scoped local Lighthouse baseline, exact protocol and declared limits | Owner authorized measurement; no performance budget, optimization or release approval implied |
