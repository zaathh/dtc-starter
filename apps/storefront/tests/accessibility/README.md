# Local Accessibility Assessment

This suite uses Playwright to prepare page states, then injects axe-core to inspect
their rendered accessibility properties. It records evidence rather than fixing
the product or claiming full WCAG compliance.

## Prerequisites and commands

Use pnpm 10.11.1 and the existing local PostgreSQL/Medusa fixture setup. Follow the
[E2E guide](../e2e/README.md) for ignored synthetic credentials and QA products.
No fresh-database bootstrap or production target is provided.

From `apps/storefront`, after approval of local runtime changes:

```bash
pnpm run build
pnpm exec next start --hostname 127.0.0.1 --port 8000
```

Build creates the local production bundle; start serves it without development
overlays. Stop an existing server on port 8000 first. Keep backend:9000 running.
Do not print or commit environment values. Then, in another terminal:

```bash
pnpm run test:accessibility RUN-A11Y-YYYYMMDD-NNN
pnpm exec node tests/accessibility/run-supplemental.mjs RUN-A11Y-YYYYMMDD-NNN
```

Replace the placeholder with a fresh date/sequence. The first command executes
19 states at two viewport sizes and writes a new report directory. It creates two
synthetic guest orders with manual payment; repeat only in this authorized local
test workflow. It signs in/out with the existing synthetic account. The second
command adds two settled-menu rechecks plus 320px/text-spacing/native-validation
probes; it does not replace manual visual or assistive-technology review.
Both commands refuse to overwrite their output directory. An existing build ID
must match the served production bundle for the primary command.

Primary exit codes: 0 = scans completed without violations; 2 = completed with
violations; 1 = incomplete/setup error. None establishes WCAG conformance. Inspect
the manifest status rather than interpreting every nonzero exit as infrastructure
failure. Restore local development serving after stopping the production server:

```bash
pnpm exec next dev --hostname 127.0.0.1 --port 8000
```

## Reading and learning from results

Open a raw `automated/*.json`: `violations` requires investigation; `incomplete`
requires manual review; `passes` and `inapplicable` refer to axe rules, not all
requirements of a WCAG criterion. Each rule includes affected HTML, selectors,
failure reasons and a help URL. Screenshots/snapshots show the captured state.
Do not count repeated nodes as unique bugs or suppress findings to obtain green.

The runner records tool versions, build ID, application commit, runner hash,
viewport, URL, original axe results and simulated order references. It is local
Chromium coverage only. Full keyboard, screen-reader, text-resize, orientation,
complete-process and criterion-level manual checks remain necessary.

The [current baseline](../../../../docs/qa/reports/RUN-A11Y-20261027-003/REPORT.md)
and [criterion matrix](../../../../docs/qa/accessibility/WCAG22_MATRIX.md) distinguish
completed scans from outstanding manual coverage.

Optional learning exercise: open `desktop-account-login.json`, find the `label`
rule and compare its selector with the visible Password field. Record what the
user sees and what the programmatic label exposes. Do not change the app yet.

References: [Playwright accessibility testing](https://playwright.dev/docs/accessibility-testing),
[axe-core](https://github.com/dequelabs/axe-core),
[W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/).

## Keyboard task follow-up

[RUN-A11Y-20261027-008](../../../../docs/qa/reports/RUN-A11Y-20261027-008/REPORT.md)
adds keyboard-event execution of selected desktop tasks. The report preserves
incomplete header navigation attempts and explains direct-URL task-entry bypasses.
Use `run-keyboard-flow.mjs` as documented there; it is development-mode evidence,
not another axe baseline or a complete keyboard/assistive-technology pass.
