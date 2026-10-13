# ADR 0011: Status precedence

## ADR

`status` is a stored projection of cancellation, completion, the response timestamps, and the current assignment.

## Decision

The value is `cancelled` when `cancelledAt` is set; otherwise `completed` when `completedAt` is set; otherwise `on_site` or `remote_diagnosis_completed`, whichever of those two timestamps is later; otherwise `assigned` when a current assignment exists; otherwise `not_assigned`. Each change appends a `StatusEvent`. A later save of the same response status replaces that timestamp column. The other response timestamp stays.

## Why it matters

Tracking, the technician’s job, and open jobs read one status. When both response times exist, the page shows the later one, and the job stays on the open list until it is completed or cancelled.
