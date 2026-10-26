# Test Basis and Traceability Register

Version: 1.1. Planning date: October 26, 2026 (Asia/Jakarta).
Related plan: [QA_TEST_PLAN.md](QA_TEST_PLAN.md).

## Authority and interpretation

The full criteria below remain subject to business review. On October 26, 2026, the portfolio owner explicitly authorized the **basic local acceptance baseline** and synthetic local fixtures for Phase 3. This accepts the concrete case-level expectations in the first manual suite, not every detailed edge case or a requirement approved by Medusa/client stakeholders.

Accepted subset: straightforward product discovery/navigation, selected variants, configured inventory boundaries, cart consistency, independently calculated fixture amounts, a single configured promotion, required checkout fields, supported DK delivery/manual payment, session behavior, and private account address/history isolation. Complex tax/discount policies, unsupported-country rules, guest-order capability restrictions, verification/transfer, responsive/cross-browser coverage, accessibility, and numeric performance budgets are not resolved by that approval.

Source classifications:

- **Documented feature:** the upstream README describes a capability, but not necessarily every edge case.
- **Implementation clue:** inspected code suggests behavior; this is not an independent correctness oracle.
- **Proposed quality criterion:** the QA project proposes a testable outcome for owner review.
- **External reference:** an applicable standard or documented protocol informs the evaluation.

For each formal case, resolve its specific expected behavior before assigning Pass/Fail. A scoped baseline acceptance does not resolve every open detail of its broader criterion. Exploratory checks can record observations while the criterion remains proposed. An observation inconsistent with an unapproved assumption is an investigation candidate, not automatically a product defect.

## Candidate acceptance criteria

| ID | Area / priority | Proposed observable acceptance criterion | Basis / decision still needed |
| --- | --- | --- | --- |
| AC-001 | Catalog / P2 | The selected category displays only products assigned to it; an empty result displays a usable empty state without a page failure. | README feature and proposed quality criterion. Confirm category hierarchy/inclusion rules against seeded fixtures. |
| AC-002 | Search and filters / P2 | For a controlled product set, a supported query and selected filters return the expected set; clearing filters restores the unfiltered set. | Store templates and search-refinement code. Confirm matching rules, combined-filter semantics, and numeric price boundaries. |
| AC-003 | Sorting and pagination / P2 | Controlled data follows the selected order; moving between pages neither omits nor repeats products within a stable result set. | Store template sets 12 hits per page. Confirm tie-breaking and whether pagination resets on filter changes; prepare more than 12 products. |
| AC-004 | Product variants / P1 | Selecting a valid size/color combination identifies that variant consistently in the displayed price, URL state where supported, and cart request; an unavailable combination cannot be submitted as another variant. | ProductActions implementation clue; README variant feature. Confirm defaults and unsupported-combination behavior. |
| AC-005 | Inventory / P1 | With inventory managed and backorders disabled, accepted quantity does not exceed sellable stock; zero-stock variants cannot create a purchasable cart line. | Inventory helper and proposed transaction invariant. Confirm reservations, backorders, stock-change timing, and API error contract. |
| AC-006 | Cart mutations / P1 | A successful add/update/remove is reflected in cart lines and quantities after reload in the same session; a rejected mutation leaves the last valid state intact and provides an error. | Cart data layer and proposed quality criterion. Confirm session lifetime, merge behavior, and supported quantity range; do not assume a universal limit of 10. |
| AC-007 | Monetary consistency / P1 | For a fixture with known prices, taxes, discounts, shipping, and currency rounding rules, displayed line totals and payable total match an independently calculated expected amount. | README commerce features and proposed quality criterion. Confirm inclusive/exclusive tax, discount order, rounding, and region rules before calculation. |
| AC-008 | Promotions / P1 | A configured eligible promotion produces the expected reduction; a rejected code does not change the payable total and produces understandable feedback. | README promotion feature and cart code. Confirm eligibility, expiry, stacking, and whether shipping discounts are included. |
| AC-009 | Address and delivery / P1 | Missing required address/contact fields prevent advancing with invalid data; a supported address provides applicable shipping options and preserves saved choices when navigating back. | Shipping-address and checkout code. Confirm required fields, country/postcode validation, billing rules, and applicable delivery methods. |
| AC-010 | Simulated checkout / P1 | Given valid prerequisites and the local manual/system provider, completing a cart creates an identifiable order with matching items/totals and an accessible confirmation. Failed completion shows an error without falsely claiming success. | Seed provider, payment-button code, and placeOrder implementation clues. Confirm payment readiness and backend completion contract; no real charges. |
| AC-011 | Repeat submission / P1 | Repeated completion of the same cart does not create duplicate orders; retries after a network interruption reconcile with the persisted backend state. | Proposed transaction-integrity criterion. Confirm idempotency/retry contract and distinguish reloading confirmation from creating a new cart. |
| AC-012 | Customer sessions / P1 | Valid synthetic credentials create a usable authenticated session; invalid credentials do not; after logout, authenticated account operations require a valid session again. | Customer data layer and README accounts. Confirm registration verification, password rules, session duration, and error disclosure policy. |
| AC-013 | Customer data ownership / P1 | Customer A cannot read or mutate customer B's private profile, addresses, or orders through ordinary account routes/API requests; invalid access does not expose private payloads. | Proposed privacy criterion. Confirm guest-order access and explicitly authorized order-transfer exceptions. Test only synthetic local accounts. |
| AC-014 | Region behavior / P2 | Changing to a supported country uses the intended region/currency and either updates the existing cart consistently or explains the required action. | README multi-region feature and updateRegion code. Confirm unsupported-country fallback, cart mismatch behavior, and address interactions. |
| AC-015 | Responsive navigation and information / P2 | The scoped purchasing flow remains usable at 1440×900 and 390×844; navigation, support, and policy links reach their intended local destinations without obscuring primary actions. | Proposed usability criterion and inspected navigation/routes. Confirm intended link destinations; treat P3 information content separately from task-blocking navigation. |
| AC-016 | Accessibility / P1 across core flow | Scoped full pages and complete purchasing/account processes satisfy each applicable WCAG 2.2 A/AA criterion, assessed with automated and manual evidence. Any untested criterion remains explicit. | WCAG 2.2 external reference. Agree page/state/process inventory and applicability before an assessment verdict. No whole-site claim from a sample. |
| AC-017 | Performance / P2 | A production-build baseline and comparison are reproducible; each agreed page/metric budget has a recorded verdict under matching settings. | Proposed measurement criterion and Lighthouse guidance. Numeric budgets are TBD after baseline review; no performance-pass claim until agreed. |
| AC-018 | Verification and order transfer / P2 conditional | Under the agreed local token/email setup, only the intended authorized party completes a valid transfer or verification; invalid/expired tokens do not grant access. | README order-transfer feature and verification routes. Confirm token lifetime, single-use rules, delivery setup, and ownership transitions before execution. |

## Traceability seed

The first [manual suite](test-cases/MANUAL_TEST_CASES.md) and [run report](reports/RUN-20261026-001/REPORT.md) now exist. The mapping below links actual cases and evidence while retaining pending broader requirements. Pass for a case does not mean the entire parent criterion is satisfied.

| Criterion | Related risk | Criterion status | Case design | Execution evidence |
| --- | --- | --- | --- | --- |
| AC-001 | RISK-005 | Local baseline subset accepted; full criterion pending | [Case definitions](test-cases/MANUAL_TEST_CASES.md): TC-002 | [RUN-20261026-001](reports/RUN-20261026-001/REPORT.md): Run recorded; scoped cases Pass |
| AC-002 | RISK-005 | Local baseline subset accepted; full criterion pending | [Case definitions](test-cases/MANUAL_TEST_CASES.md): TC-003, TC-004 | [RUN-20261026-001](reports/RUN-20261026-001/REPORT.md): Run recorded; scoped cases Pass |
| AC-003 | RISK-005, RISK-011 | Local baseline subset accepted; full criterion pending | [Case definitions](test-cases/MANUAL_TEST_CASES.md): TC-005, TC-006 | [RUN-20261026-001](reports/RUN-20261026-001/REPORT.md): Run recorded; scoped cases Pass |
| AC-004 | RISK-004 | Local baseline subset accepted; full criterion pending | [Case definitions](test-cases/MANUAL_TEST_CASES.md): TC-007, TC-012 | [RUN-20261026-001](reports/RUN-20261026-001/REPORT.md): Run recorded; scoped cases Pass |
| AC-005 | RISK-004 | Local baseline subset accepted; full criterion pending | [Case definitions](test-cases/MANUAL_TEST_CASES.md): TC-009, TC-010 | [RUN-20261026-001](reports/RUN-20261026-001/REPORT.md): Run recorded; scoped cases Pass |
| AC-006 | RISK-004, RISK-002 | Local baseline subset accepted; full criterion pending | [Case definitions](test-cases/MANUAL_TEST_CASES.md): TC-011–TC-015 | [RUN-20261026-001](reports/RUN-20261026-001/REPORT.md): Run recorded; scoped cases Pass |
| AC-007 | RISK-001 | Local baseline subset accepted; full criterion pending | [Case definitions](test-cases/MANUAL_TEST_CASES.md): TC-013, TC-017, TC-020 | [RUN-20261026-001](reports/RUN-20261026-001/REPORT.md): Run recorded; scoped cases Pass |
| AC-008 | RISK-001 | Local baseline subset accepted; full criterion pending | [Case definitions](test-cases/MANUAL_TEST_CASES.md): TC-016, TC-017 | [RUN-20261026-001](reports/RUN-20261026-001/REPORT.md): Run recorded; scoped cases Pass |
| AC-009 | RISK-002 | Local baseline subset accepted; full criterion pending | [Case definitions](test-cases/MANUAL_TEST_CASES.md): TC-018, TC-019 | [RUN-20261026-001](reports/RUN-20261026-001/REPORT.md): Run recorded; scoped cases Pass |
| AC-010 | RISK-002 | Local baseline subset accepted; full criterion pending | [Case definitions](test-cases/MANUAL_TEST_CASES.md): TC-020 | [RUN-20261026-001](reports/RUN-20261026-001/REPORT.md): Run recorded; scoped cases Pass |
| AC-011 | RISK-002 | Local baseline subset accepted; full criterion pending | [Case definitions](test-cases/MANUAL_TEST_CASES.md): TC-021 | [RUN-20261026-001](reports/RUN-20261026-001/REPORT.md): Run recorded; scoped cases Pass |
| AC-012 | RISK-003, RISK-013 | Local baseline subset accepted; full criterion pending | [Case definitions](test-cases/MANUAL_TEST_CASES.md): TC-022, TC-023 | [RUN-20261026-001](reports/RUN-20261026-001/REPORT.md): Run recorded; scoped cases Pass |
| AC-013 | RISK-003 | Local baseline subset accepted; full criterion pending | [Case definitions](test-cases/MANUAL_TEST_CASES.md): TC-024 | [RUN-20261026-001](reports/RUN-20261026-001/REPORT.md): Run recorded; scoped cases Pass |
| AC-014 | RISK-006 | Local baseline subset accepted; full criterion pending | [Case definitions](test-cases/MANUAL_TEST_CASES.md): TC-026 | [RUN-20261026-001](reports/RUN-20261026-001/REPORT.md): Run recorded; scoped cases Pass |
| AC-015 | RISK-007 | Local baseline subset accepted; full criterion pending | [Case definitions](test-cases/MANUAL_TEST_CASES.md): TC-001, TC-008, TC-025 | [RUN-20261026-001](reports/RUN-20261026-001/REPORT.md): Run recorded; TC-025 Fail |
| AC-016 | RISK-008 | Proposed | Not designed | Not Run |
| AC-017 | RISK-009, RISK-012 | Proposed | Not designed | Not Run |
| AC-018 | RISK-003, RISK-013 | Proposed | Not designed | Not Run |

## Assumptions and decision log

| ID | Open decision | Current disposition | Decision owner / due gate |
| --- | --- | --- | --- |
| DEC-001 | Detailed business acceptance rules | Basic local baseline accepted by owner on 2026-10-26; advanced rules above remain pending; no upstream/client sign-off | Portfolio owner with mentor support / before affected formal cases |
| DEC-002 | Dedicated synthetic accounts, inventory, promotion and pagination fixtures | Owner authorized 2026-10-26; 16 QA products, stock 0/1, coupon, and A/B accounts prepared without resetting old data; see run manifest | Portfolio owner / before affected execution |
| DEC-003 | Manual payment versus Stripe scope | Owner authorized simulated orders on 2026-10-26; manual/system exercised in first cycle; Stripe remains deferred | Portfolio owner / before checkout cases |
| DEC-004 | Email verification and transfer delivery | No real recipients; local token or email-sink approach undecided | Portfolio owner / before verification/transfer cases |
| DEC-005 | Exact browser versions and physical-device coverage | Planned browser matrix only; physical devices not committed | Portfolio owner / before run manifest |
| DEC-006 | Numeric performance budgets | TBD after baseline; no numeric promise | Portfolio owner / Phase 5 baseline review |
| DEC-007 | Accessibility page/state/process inventory | Proposed full purchasing/account scope; detailed inventory pending | Portfolio owner / Phase 6 readiness |
| DEC-008 | Calendar, effort estimates and paid-service budget | No agreed deadlines or paid services | Portfolio owner / before committing execution schedule |

For each resolved decision append the date, actual approver, rationale, criterion version, and affected case IDs. Use explicit statuses: Proposed, Accepted, Changed, Deferred, or Rejected. A deferred criterion remains visible with its risk; it is not marked Pass or silently removed from coverage.

## Evidence sources

- Upstream README inspected at the application commit recorded in the plan.
- `apps/storefront/src/modules/products/components/product-actions/index.tsx`
- `apps/storefront/src/lib/util/inventory.ts`
- `apps/storefront/src/lib/data/cart.ts` and `customer.ts`
- `apps/storefront/src/modules/cart/components/item/index.tsx`
- `apps/storefront/src/modules/store/templates/index.tsx`
- `apps/storefront/src/modules/store/components/store-refinements/attributes.ts`
- `apps/storefront/src/modules/checkout/components/shipping-address/index.tsx`
- `apps/storefront/src/modules/checkout/components/payment-button/index.tsx`
- `apps/backend/src/migration-scripts/initial-data-seed.ts`
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [Lighthouse variability guidance](https://github.com/GoogleChrome/lighthouse/blob/main/docs/variability.md)

No code observation in this register is a verified defect report.

## Phase 3 decision and execution record

The human owner explicitly replied “Yes” to local synthetic data and the basic portfolio acceptance baseline on 2026-10-26. This record paraphrases that authorization; it does not invent approval for remaining detailed rules. The concrete 26-case suite was prepared before execution. Results: 25 Pass, 1 Fail within the declared scope. See the run for all limitations and evidence. No criterion-wide completion percentage is claimed.
