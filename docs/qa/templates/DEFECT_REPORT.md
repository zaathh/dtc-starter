# Defect Report Template

Template only — not an observed defect. Replace placeholders with actual evidence; do not publish invented examples as results.

## Identification

- Defect ID: [BUG-###]
- Title: [specific failure and affected user task]
- Reported by / role: [actual author and any AI assistance]
- Observed at: [ISO timestamp and timezone]
- Status: [New / Triaged / In Progress / Ready for Retest / Reopened / Closed / alternate disposition]
- Severity and impact rationale: [S1–S4, affected users/tasks, scope of harm]
- Fix priority and rationale: [D1–D3, actual owner decision]

## Context and test basis

- Related criteria, risks and test cases: [IDs and links]
- Run ID / phase / technique: [actual execution context]
- Expected-behavior source: [reviewed criterion, API contract, or documented requirement]
- Criterion status / uncertainty: [Accepted, or explain why this remains an investigation candidate]
- Application revision: [frontend/backend commit plus relevant sanitized uncommitted differences]
- Environment: [OS, browser/version, viewport/device, region/currency, locale/timezone, build mode]
- Preconditions and synthetic fixture IDs: [account roles, cart, inventory, provider and data state]

## Reproduction

1. [exact action and input]
2. [next action]
3. [observable failure]

- Expected result: [independently justified behavior]
- Actual result: [what was actually observed]
- Reproduction frequency: [observed failures / attempts and conditions; unknown if not repeated]
- Workaround: [verified workaround, or Not evaluated]
- User/business impact: [concrete consequence]
- Sanitized evidence: [screenshots, video, request/response, logs and timestamps]
- Possible cause: [optional hypothesis, explicitly not a verified root cause]

## Triage and resolution

- Triage owner/date: [actual review]
- Disposition and rationale: [confirmed defect / needs information / duplicate with link / change request / not a defect / deferred]
- Proposed or implemented fix: [PR/commit; distinguish proposal from merged change]
- Affected regression scope: [reasoned selection]
- Residual risk or deferral: [actual owner decision, date and follow-up]

## Confirmation and closure

- Retest run and revision: [IDs and exact commits]
- Retest steps/outcomes and evidence: [actual results]
- Regression results and gaps: [links, counts and untested areas]
- Closure/reopen decision and author/date: [actual decision]

Do not close an issue as fixed on a developer statement alone. Retain original failure evidence and all meaningful retest attempts. Remove credentials and personal/session data before publication.
