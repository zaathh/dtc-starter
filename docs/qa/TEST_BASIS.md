# Test Basis and Traceability Register

Version: 1.0. Planning date: October 26, 2026 (Asia/Jakarta).
Related plan: [QA_TEST_PLAN.md](QA_TEST_PLAN.md).

## Authority and interpretation

All criteria below are **Proposed — pending review**. They are project-specific candidate expectations, not requirements approved by Medusa or a client. The user's request to improve documentation authorizes drafting these criteria; it does not constitute approval of every proposed business rule.

Source classifications:

- **Documented feature:** the upstream README describes a capability, but not necessarily every edge case.
- **Implementation clue:** inspected code suggests behavior; this is not an independent correctness oracle.
- **Proposed quality criterion:** the QA project proposes a testable outcome for owner review.
- **External reference:** an applicable standard or documented protocol informs the evaluation.

For each criterion, resolve the stated decision before formal Pass/Fail testing. Exploratory checks can record observations while the criterion remains proposed. An observation inconsistent with an unapproved assumption is an investigation candidate, not automatically a product defect.

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

This is a planning register, not a test execution matrix. No detailed test cases or formal runs exist yet. In Phase 3, replace the case/run placeholders with actual IDs and links; preserve one-to-many relationships.

| Criterion | Related risk | Criterion status | Case design | Execution evidence |
| --- | --- | --- | --- | --- |
| AC-001 | RISK-005 | Proposed | Not designed | Not Run |
| AC-002 | RISK-005 | Proposed | Not designed | Not Run |
| AC-003 | RISK-005, RISK-011 | Proposed | Not designed | Not Run |
| AC-004 | RISK-004 | Proposed | Not designed | Not Run |
| AC-005 | RISK-004 | Proposed | Not designed | Not Run |
| AC-006 | RISK-004, RISK-002 | Proposed | Not designed | Not Run |
| AC-007 | RISK-001 | Proposed | Not designed | Not Run |
| AC-008 | RISK-001 | Proposed | Not designed | Not Run |
| AC-009 | RISK-002 | Proposed | Not designed | Not Run |
| AC-010 | RISK-002 | Proposed | Not designed | Not Run |
| AC-011 | RISK-002 | Proposed | Not designed | Not Run |
| AC-012 | RISK-003, RISK-013 | Proposed | Not designed | Not Run |
| AC-013 | RISK-003 | Proposed | Not designed | Not Run |
| AC-014 | RISK-006 | Proposed | Not designed | Not Run |
| AC-015 | RISK-007 | Proposed | Not designed | Not Run |
| AC-016 | RISK-008 | Proposed | Not designed | Not Run |
| AC-017 | RISK-009, RISK-012 | Proposed | Not designed | Not Run |
| AC-018 | RISK-003, RISK-013 | Proposed | Not designed | Not Run |

## Assumptions and decision log

| ID | Open decision | Current disposition | Decision owner / due gate |
| --- | --- | --- | --- |
| DEC-001 | Detailed business acceptance rules | Proposed criteria above; not upstream/client-approved | Portfolio owner with mentor support / before affected formal cases |
| DEC-002 | Dedicated synthetic accounts, inventory, promotion and pagination fixtures | Not prepared by Phase 2; preserve existing user data | Portfolio owner / before affected execution |
| DEC-003 | Manual payment versus Stripe scope | Manual/system proposed for local end-to-end flow; Stripe deferred | Portfolio owner / before checkout cases |
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
