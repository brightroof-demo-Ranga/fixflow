# ADR 0010: Assignment history

## ADR

Each assign and reassign appends a row. One row is current.

## Decision

A new `Assignment` stores the technician, the dispatcher, `assignedAt`, and `expectedArrivalAt` when the dispatcher sent one. The previous current row receives `supersededAt`. The current assignee is the row with an empty `supersededAt`. Reassignment leaves status and the response timestamps unchanged. The weekly jobs-per-technician count includes the job only for the current assignee, and only when that row’s `assignedAt` falls in the selected Monday–Sunday week.

## Why it matters

After a reassignment, tracking, open jobs, and the audit log name the new technician. The weekly workload count leaves the job off the previous technician.
