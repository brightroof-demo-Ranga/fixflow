# ADR 0009: Repeat intake creates a new request

## ADR

The same phone and system id may have more than one open request.

## Decision

A second submit for a phone and system id that already has a request which is not completed and not cancelled inserts a new `ServiceRequest` with its own id and `createdAt`. The earlier request stays as it was.

## Why it matters

A later report for the same rooftop keeps its own id, create time, and tracking link. The first job remains available to assign and update.
