# Lighthouse setup attempt — RUN-LH-20261027-001

Disposition: **Incomplete — runner URL-validation assumption corrected.** This attempt is retained for traceability and is not the complete baseline.

Mobile home and catalog measurements completed before the product navigation appended its normal selected-variant `v_id` query parameter. The original guard required an exact URL match, so it stopped even though Lighthouse reported no runtime error and remained on the expected product route. The partial manifest, raw product result, and earlier reports were retained. The runner now accepts only the expected route/query parameters plus the normal product variant parameter.

No sample was discarded because of its performance score. All medians and the 24-measurement baseline are from the subsequent [complete RUN-LH-20261027-002](../RUN-LH-20261027-002/REPORT.md), using the corrected guard consistently. No application fix or new functional defect is inferred from this tooling error.
