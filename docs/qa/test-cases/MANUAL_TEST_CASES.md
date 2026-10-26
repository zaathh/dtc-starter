# Manual Test Cases — First Local QA Cycle

Suite version: 1.0. Created: October 26, 2026 (Asia/Jakarta).
Application baseline: `204130a32d80b704ab509069dcc1a2f8a61f51c1`; planning commit: `a5e33cc`.
Run: [RUN-20261026-001](../reports/RUN-20261026-001/REPORT.md).

The portfolio owner authorized synthetic local fixtures and the basic portfolio acceptance baseline on October 26, 2026. Expected results below apply to that local baseline, not upstream/client sign-off. Complex tax, promotion stacking, email delivery, and token-expiry policy remain outside this cycle. No test result is implied by this case specification.

Execution methods: interactive browser actions for UI checks; explicitly labeled, individually inspected HTTP requests for API checks. Temporary fixture preparation is not an automated regression suite. Playwright installation and automation remain Phase 4.

## Fixtures and isolation

- Dedicated namespace: `qa-20261026-001`; no existing products, accounts, orders, or carts are reset/deleted.
- Dedicated QA category and at least 13 individually priced products enable search, sorting and pagination checks without relying on undocumented tie-breaking.
- A variant product has Size S/M and Color Black/White with explicit EUR prices; use recorded variant IDs and an independently calculated expected subtotal.
- Separate zero-stock and one-stock variants use managed inventory with backorders disabled.
- One configured non-automatic percentage promotion fixture uses a unique code; unrelated promotion rules are not assumed.
- Synthetic customer accounts A/B and fictional DK addresses support local checkout and ownership checks. Real Stripe payments/email delivery are excluded.
- Final fixture names/IDs and actual prerequisites are recorded in the run manifest. Missing/failed prerequisites cause Blocked, not Pass.
- For monetary checks, use the fixture's actual configured tax/shipping/discount rules; block any expectation that cannot be independently established.

## Case specifications

Steps are ordered left to right. Each case has its own actual result in the run report; retries are retained rather than overwriting failures.

| ID | Criteria / risks | Priority | Preconditions | Steps | Expected result / oracle |
| --- | --- | --- | --- | --- | --- |
| TC-001 | AC-015 / RISK-007 | P2 | Local services healthy; anonymous browser session | Open home; inspect header/footer and primary links | Storefront loads with navigation, account/cart and category links; no task-blocking error page. |
| TC-002 | AC-001 / RISK-005 | P2 | Dedicated active QA category and known membership | Open QA category; inspect product membership | Displayed products belong to the QA category; expected fixture membership is preserved across its pages. |
| TC-003 | AC-002 / RISK-005 | P2 | Known unique QA product title indexed | Open catalog; search the unique title | Matching fixture appears and unrelated titles are excluded according to the simple exact-title fixture. |
| TC-004 | AC-002 / RISK-005 | P2 | Search page ready | Search an intentionally nonexistent run-specific token | No product matches; an understandable empty state is shown and the search remains usable. |
| TC-005 | AC-003 / RISK-005 | P2 | QA category/filter with distinct known prices | Select low-to-high; record order; select high-to-low | Displayed prices follow the requested order. Compare against independently recorded fixture prices, not API/UI agreement alone. |
| TC-006 | AC-003 / RISK-005, RISK-011 | P2 | More than 12 indexed products in controlled result set | Open page 1; record handles; open page 2; record handles | Expected result count is covered without repeated/omitted handles; page navigation remains within the selected result set. |
| TC-007 | AC-004 / RISK-004 | P1 | QA variant product available | Open product; choose M and White; inspect price and selected variant | M/White is selected, its fixture price is shown, and variant URL state identifies the selected variant where supported. |
| TC-008 | AC-015 / RISK-007 | P2 | Nonexistent product handle | Open `/dk/products/qa-20261026-001-missing` | A usable not-found state appears rather than a successful product page or server stack trace. |
| TC-009 | AC-005 / RISK-004 | P1 | Managed-inventory fixture with stock 0 and backorders disabled | Open product; inspect availability and purchase control | Product is marked unavailable and cannot be added as an available purchasable variant. |
| TC-010 | AC-005 / RISK-004 | P1 | Separate stock-1 fixture; unused test cart | Manually request quantity 2 through Store API; inspect response and cart | Request is rejected for insufficient sellable stock; cart does not contain quantity 2. Record the actual API status/error, without assuming an undocumented exact message. |
| TC-011 | AC-006 / RISK-002 | P1 | Anonymous browser session verified to have an empty cart | Open cart | Empty-state message and a path back to shopping are shown; no successful checkout is possible from an empty cart. |
| TC-012 | AC-004, AC-006 / RISK-004 | P1 | TC-007 selection; empty browser cart | Add M/White once; open full cart | Exactly the selected product/variant appears with quantity 1 and its expected unit price. |
| TC-013 | AC-006, AC-007 / RISK-001 | P1 | Browser cart contains only the selected fixture | Change quantity to 2; inspect line amount and subtotal | Quantity becomes 2 and line amount/subtotal equal twice the independently recorded fixture unit price; disclose any tax/shipping line separately. |
| TC-014 | AC-006 / RISK-004 | P1 | TC-013 valid cart state | Reload full cart page | Product, selected variant, quantity and valid amounts persist in the same session. |
| TC-015 | AC-006 / RISK-002 | P1 | Existing QA cart line | Remove QA item; inspect cart | Item disappears and cart returns to an accurate empty state. No unrelated user's cart is changed. |
| TC-016 | AC-008 / RISK-001 | P1 | Populated QA cart; known prior amounts | Apply nonexistent run-specific promotion code | No discount is applied; payable amounts remain correct and rejection feedback is understandable. |
| TC-017 | AC-007, AC-008 / RISK-001 | P1 | Known eligible QA percentage coupon; a single-price fixture | Apply coupon; inspect discount and totals | Discount matches the configured percentage and basis; payable total matches an independent calculation. No assumption about stacked/expired promotions. |
| TC-018 | AC-009 / RISK-002 | P1 | QA item in browser cart; no address | Open checkout; try advancing with required fields empty | User cannot advance as if valid; required-field feedback identifies missing information. |
| TC-019 | AC-009 / RISK-002 | P1 | Fixture cart; supported fictional DK address | Enter valid shipping/contact data; choose supported delivery; revisit address step | Address/delivery choices are usable and persisted; shipping cost agrees with configured fixture option. |
| TC-020 | AC-007, AC-010 / RISK-001, RISK-002 | P1 | Valid checkout prerequisites; local manual/system provider | Select test payment; review amounts; place order once | A single identifiable order confirmation is displayed with correct fixture items, quantities and amounts; no real payment is made. |
| TC-021 | AC-011 / RISK-002 | P1 | Completed cart/order ID from TC-020 or isolated API checkout | Repeat the same cart completion request; reload confirmation; compare persisted orders | Same cart does not create a second order; record whether API returns the original order or a documented refusal. |
| TC-022 | AC-012 / RISK-003 | P1 | Login page; synthetic email and wrong password | Submit invalid credentials | No authenticated account access is granted; an understandable error is displayed. |
| TC-023 | AC-012 / RISK-003 | P1 | Synthetic customer A with recorded valid credentials | Sign in through UI; inspect account; sign out; revisit account | A can access own account after login; after logout the account view requires authentication again. |
| TC-024 | AC-013 / RISK-003 | P1 | Synthetic A/B with independently prepared private records | Individually request A's private order/address as B and anonymously through ordinary Store routes | Unauthorized requests do not return A's private data or permit mutation; distinguish guest-order or explicitly authorized transfer exceptions. |
| TC-025 | AC-015 / RISK-007 | P2 | Storefront navigation available | Follow shipping, returns, terms, privacy, contact and account-help links | Each reaches its intended usable local destination; record each broken destination separately. |
| TC-026 | AC-014 / RISK-006 | P2 | Supported DK/FR countries in initial Europe region | Use country selector to switch DK→FR; inspect URL and currency; return to DK | Supported-country navigation remains usable with expected EUR region; no claim about unsupported countries or different currencies. |

## Deliberately deferred coverage

Detailed registration rules, verification/transfer token policy, promotion stacking/expiry, unsupported countries, stock concurrency beyond the isolated boundary, exhaustive browser/mobile coverage, WCAG evaluation, and performance measurements remain outside this first cycle. This is a bounded cycle, not proof of complete coverage of the entire plan. Any inability to complete an included P1 case is reported as Blocked/Not Run and prevents an unqualified cycle pass.
