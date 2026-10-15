# ADR 0021: Assigned technician marks completed

## ADR

The assigned technician marks a job completed from On site or Remote diagnosis completed.

## Decision

That save stores status completed and `completedAt` at the server time of the successful save. No other role can. Open jobs exclude a request whose status is `completed`. Average time to resolve reads `completedAt`.

## Why it matters

The reports need this status. Technician-update AC11 names the person who may record it.
