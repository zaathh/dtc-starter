# Test Execution / Completion Report Template

Template only — no test execution is asserted. Use this for a session report or final cycle summary and identify which it is.

## Run manifest

- Report type / run ID: [Session or Completion; RUN-YYYYMMDD-###]
- Started / ended at: [timestamps with timezone]
- Actual executor and reviewer: [identify human/AI roles; do not claim independent review if absent]
- Plan/test-basis version: [commit or reviewed document version]
- Tested revision: [frontend/backend commits, sanitized working-tree differences, lockfile identity]
- Environment: [OS, runtime, browser/tool versions, viewport/device, region/currency, locale/timezone]
- Server mode and endpoints: [development/production and local URLs]
- Test data / session / cache state: [fixture IDs and setup; no secret values]
- Included scope: [case-set IDs/version; applicable criteria and risks]
- Excluded or deferred scope: [IDs, rationale, owner/date]
- Entry check: [service health, account/data readiness, reviewed oracle, evidence location]

## Results

Use the latest valid outcome per included case. Keep raw retries as separate attempts. Blocked is not executed; Not Applicable requires a reason. A template placeholder is never a zero-result test run.

| Case ID | Criterion / risk | Test priority | Expected source | Outcome | Evidence / defect / blocker | Actual revision |
| --- | --- | --- | --- | --- | --- | --- |
| [actual ID] | [linked IDs] | [P1–P3] | [reviewed oracle] | [Not Run / Pass / Fail / Blocked / Not Applicable] | [links and rationale] | [commit] |

| Summary measure | Actual value / explicit denominator |
| --- | --- |
| Included applicable cases | [count and case-set reference] |
| Pass / Fail / Blocked / Not Run | [actual counts] |
| Not Applicable / formally deferred | [counts and reasons, reported separately] |
| Execution progress | [(Pass + Fail) / applicable included cases] |
| Pass rate among executed | [Pass / (Pass + Fail)] |
| P1 status counts and progress | [same formulas restricted to P1] |
| Designed criterion coverage | [accepted criteria with reviewed cases / all accepted in-scope criteria] |
| Open findings | [counts by severity and disposition; unique defects only] |

Use N/A with an explanation for an empty denominator. Never present a high pass rate without unexecuted/blocked counts. Do not compute coverage from proposed criteria as though they were accepted.

## Interpretation and completion decision

- Main verified outcomes: [evidence-backed findings]
- New or changed risks: [risk-register links and rationale]
- Blockers, deviations, flaky behavior and limitations: [actual facts]
- Confirmation/regression work: [fixed revision, original failure, retest evidence and gaps]
- Exit-gate assessment: [each relevant gate and actual evidence]
- Overall disposition: [In Progress / Passed within declared scope / Completed with exceptions / Incomplete / Blocked]
- Owner acceptance of exceptions: [actual decision/date, or Pending; no implicit waiver]
- Next actions and owners: [concrete follow-up]

## Performance / accessibility attachments, when applicable

- Performance: [production build, page/state, device/profile, tool version, CPU/network settings, cache policy, all run artifacts, per-metric median, agreed budget verdict, and variability]
- Accessibility: [page/state/process inventory, applicable A/AA criteria, automated findings, manual keyboard/zoom/VoiceOver results, criterion dispositions and limitations]
- Artifact location and retention: [accessible links, expiry if relevant, sanitization review]

A performance section without measurements is Not measured. An accessibility section without manual coverage must not imply full WCAG conformance. CI status covers only the configured checks on its recorded revision.
