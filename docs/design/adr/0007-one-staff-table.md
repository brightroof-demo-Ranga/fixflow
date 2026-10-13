# ADR 0007: One staff table

## ADR

Dispatcher, technician, and ops manager are three roles on one staff identity.

## Decision

`StaffUser.role` is exactly one of `dispatcher`, `technician`, or `ops_manager`. A technician in the data model is a staff user with the technician role. Assignments and audit rows point at that staff id.

## Why it matters

Each staff user has one role, and an assignment names a technician. The person who signed in is the person on the audit row.
