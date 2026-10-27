# QA Risk Register

Version: 1.1. Assessment date: October 26, 2026 (Asia/Jakarta).
Related plan: [QA_TEST_PLAN.md](QA_TEST_PLAN.md).

## Assessment method

These are potential adverse outcomes, not discovered bugs. Scores are provisional planning judgments from feature complexity, consequences, and known setup constraints. They are not measured probabilities, production incident rates, or proof that a failure exists.

- Likelihood: 1 = limited exposure/simple path; 2 = plausible; 3 = several interacting states; 4 = substantial setup/coordination uncertainty; 5 = repeatedly observed risk occurrence. No likelihood 5 is assigned without evidence.
- Impact: 1 = negligible; 2 = minor inconvenience; 3 = meaningful degradation/delay; 4 = core task blocked or materially incorrect; 5 = private-data exposure or severe integrity loss.
- Score = likelihood × impact. High: 10–25; Medium: 5–9; Low: 1–4. Any impact-5 product risk receives P1 treatment even if its score is below 10.
- Product High → P1, Medium → P2, Low → P3, subject to task dependencies and documented owner override. Project-risk ratings prioritize mitigation, not application test-case counts.

The portfolio owner is accountable for disposition. The AI mentor supports analysis and execution; no independent stakeholder assessment is implied. Reassess after exploratory findings, data/configuration changes, or a scope change.

## Initial risks and treatment

| ID | Type | Potential adverse outcome | L | I | Score / level | Rationale for initial assessment | Planned treatment / owner | Current disposition |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| RISK-001 | Product | Incorrect prices, rounding, taxes or discounts produce an incorrect payable total | 3 | 4 | 12 High | Multiple monetary rules interact; the purchasing consequence is substantial | Independent known-value fixtures and API/UI reconciliation; portfolio owner | Open; treatment planned |
| RISK-002 | Product | Checkout loses state, blocks valid completion, or creates duplicate orders on retry | 3 | 4 | 12 High | Multi-step flow, asynchronous payment/session state and retry handling | Happy/negative/state-transition checks with persisted order verification; portfolio owner | Open; treatment planned |
| RISK-003 | Product | A session or transfer boundary exposes another customer's private data | 2 | 5 | 10 High | Ownership boundaries span account and order routes; impact is severe | Synthetic accounts A/B, unauthenticated checks and explicit transfer exceptions; portfolio owner | Open; treatment planned |
| RISK-004 | Product | Selected variant or requested quantity disagrees with stock/cart state | 3 | 4 | 12 High | Options, inventory flags, cart updates and stock changes interact | Boundary fixtures and inventory/backorder decision table; portfolio owner | Open; treatment planned |
| RISK-005 | Product | Search, filters, sorting or pagination hide or repeat expected products | 2 | 3 | 6 Medium | Query state and indexed catalog data may diverge | Controlled catalog with independent expected sets/order; portfolio owner | Open; treatment planned |
| RISK-006 | Product | Region changes leave inconsistent country, currency or cart state | 2 | 3 | 6 Medium | Region selection affects several storefront states | Region-transition checks; monetary errors also covered by RISK-001; portfolio owner | Open; treatment planned |
| RISK-007 | Product | Responsive navigation or broken supporting links prevent product discovery/help | 2 | 3 | 6 Medium | Several layouts and link destinations are involved | Desktop/mobile navigation and information-route inventory; portfolio owner | Open; treatment planned |
| RISK-008 | Product | Keyboard or assistive-technology users cannot complete a core task | 3 | 4 | 12 High | Forms, variant controls, popovers and checkout create interaction boundaries | Applicable WCAG A/AA matrix, axe, keyboard, zoom and VoiceOver checks; portfolio owner | Open; treatment planned |
| RISK-009 | Product | Loading/layout instability or blocking work degrades the purchasing experience | 2 | 3 | 6 Medium | Framework rendering and external images affect loading; no metrics exist yet | Controlled production-build baseline and evidence-led optimization; portfolio owner | Open; treatment planned |
| RISK-010 | Project | Implementation-derived expectations create false-positive or circular tests | 3 | 4 | 12 High | Separate business acceptance criteria have not been supplied | Review proposed ACs, record oracles/assumptions, use independent expected totals; portfolio owner | Open; proposed criteria recorded |
| RISK-011 | Project | Insufficient or shared fixtures block boundaries or contaminate results | 4 | 3 | 12 High | Four initial products cannot exercise pagination; QA accounts/stock fixtures are pending | Namespaced reproducible fixtures; no destructive reset without permission; portfolio owner | Open; prerequisites pending |
| RISK-012 | Project | Development mode, cache or machine differences produce misleading performance comparisons | 3 | 3 | 9 Medium | Current server uses development mode; production baseline not prepared | Fixed build/tool/run manifest, repeated runs and raw reports; portfolio owner | Open; mitigation planned for Phase 5 |
| RISK-013 | Project | Unconfigured payment/email/admin dependencies block conditional scenarios | 4 | 3 | 12 High | Stripe/admin/email setup remains absent or undecided | Manual-provider scope, synthetic accounts and local delivery decisions; portfolio owner | Open; prerequisites pending |
| RISK-014 | Project | Uncommitted/generated files or changing tools make evidence hard to reproduce | 3 | 3 | 9 Medium | Startup generated files exist; QA documents are not committed yet | Explicit staged-file review and commit/dirty-diff manifest for each run; portfolio owner | Open; change-control rules documented |

## Review and residual risk

At each phase boundary, record any change to score, supporting evidence, treatment completion, and residual exposure. Do not mark a risk Closed merely because a planned test exists. A passing test reduces uncertainty for its scope; it does not demonstrate that the risk has disappeared.

Risk acceptance requires the actual owner's dated decision, reason, affected scope, and follow-up. No risk has been accepted on behalf of the owner in this initial register.

| Review date | Risk ID | New evidence | Previous → revised rating | Treatment / residual risk | Owner decision |
| --- | --- | --- | --- | --- | --- |
| Pending | None yet | No formal execution evidence | Not reassessed | Initial planning register only | Pending |

## First-cycle evidence update — October 26, 2026

Initial scores above are retained as historical planning judgments; no measured probability or recalculated residual score is claimed. [RUN-20261026-001](reports/RUN-20261026-001/REPORT.md) adds the following observations:

| Risks | Actual evidence / treatment progress | Residual limitation |
| --- | --- | --- |
| RISK-001 | Fixture cart arithmetic and a 10% code matched the independently calculated UI order total of EUR 41.50 | Complex tax, stacking and rounding policies remain untested |
| RISK-002 | Manual-payment UI order completed; one API cart completed twice returned the same order ID and had one persisted order link | Concurrency and network-interruption scenarios remain untested |
| RISK-003 | A/B address read/update and private order-history checks isolated the tested data; login/logout checks passed | Guest order-by-ID is intentionally capability-accessible; full authorization audit remains outside scope |
| RISK-004 | M/White selection, quantity/reload/removal, stock-0 UI and stock-1 over-quantity API checks passed | Backorders and stock races are not covered |
| RISK-005 | Simple search/no-match, category sorting and 12+4 pagination checks passed | Combined filters and all catalog modes remain untested |
| RISK-006 | DK→FR navigation within EUR region was usable | Populated-cart and different-currency transitions remain untested |
| RISK-007 | BUG-001 reproduced the account Customer Service link reaching a 404 in two UI attempts | Defect remains open; severity S3 / priority D2 are proposed, not an owner waiver |
| RISK-011 | 16 namespaced QA products, stock fixtures, coupon and synthetic accounts were added without resetting existing data | Data is retained locally; cleanup/reuse needs an explicit fixture decision |
| RISK-013 | Manual/system payment exercised; no real payment or email delivery verified | Admin/email/Stripe-dependent scope remains conditional |
| RISK-014 | Actual run records source commits, dirty tracked diff, environment and fixture manifests | Phase 3 changes remain local/uncommitted; publication and independent review have not occurred |

RISK-008 accessibility and RISK-009/RISK-012 performance remain unassessed until their planned phases. No risk is closed or accepted merely because scoped checks passed.

## Publication and automation checkpoint — October 27, 2026

Phase 3 documentation and evidence were published in commit `f541920` through draft PR #2, stacked on test-plan PR #1. The owner reported manual verification of the initial cases and the mobile/tablet follow-up; this is owner-reported confirmation, not observed execution evidence. Historical first-cycle status statements above are retained as dated snapshots.

The [Phase 1–4 audit](reports/PHASES-1-4-AUDIT-20261027.md) links the initial critical-flow Playwright suite and its latest validation. BUG-001 remains open, and BUG-002 adds a reproduced minor mobile menu overflow. Expected-failure annotations do not close either issue or establish risk acceptance. No residual risk score is recalculated without evidence. Broader API automation, database bootstrap portability, browser engines, CI, performance, accessibility and detailed business rules remain declared gaps.
