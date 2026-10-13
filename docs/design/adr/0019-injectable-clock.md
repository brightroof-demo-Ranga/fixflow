# ADR 0019: One injectable clock

## ADR

Create times, status times, and the SLA job share one clock that tests can replace.

## Decision

The application clock supplies `createdAt`, `assignedAt`, `cancelledAt`, `onSiteAt`, `remoteDiagnosisCompletedAt`, and the `now` the evaluator compares. Tests may set it to a Saturday, a weekday, 30 November 2026, 1 December 2026, or a moment past 86400 seconds.

## Why it matters

Weekend intake and the 24-hour boundary are acceptance criteria with named instants. A clock the test sets makes those results repeatable.
