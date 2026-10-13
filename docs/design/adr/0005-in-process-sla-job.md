# ADR 0005: In-process SLA job

## ADR

One evaluator applies the 24-hour rules. A timer in the Next.js server runs it when no one saves the request.

## Decision

The API calls the evaluator inside the transaction that saves a response timestamp, a cancellation, or a change to `critical`. About once a minute, a background job calls the same function for critical requests that can still move from an empty result to breached. The job writes no on-site or remote-diagnosis timestamp. Tests call the evaluator with a chosen clock. A hosted scheduler is not selected.

## Why it matters

A critical fault can breach after 24 hours with no technician update. The breach report stays empty if the result is computed only on the next staff save.
