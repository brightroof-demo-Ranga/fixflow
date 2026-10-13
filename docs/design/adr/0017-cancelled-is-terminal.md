# ADR 0017: Cancelled requests stay cancelled

## ADR

A dispatcher cancellation is a terminal state.

## Decision

From Not assigned, Assigned, On site, or Remote diagnosis completed, a signed-in dispatcher may set `cancelledAt`. No transition leaves Cancelled. Assign and technician update on a cancelled request leave the row unchanged. Open jobs omit it. The tracking page shows Cancelled. There is no customer cancel route. Reopen stays disallowed until a story allows it.

## Why it matters

After the customer no longer wants the visit, dispatch and field updates stop, and the job leaves the open-jobs list.
