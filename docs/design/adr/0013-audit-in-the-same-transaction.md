# ADR 0013: Audit rows for staff changes

## ADR

Staff create, assign, update, and cancel write an audit row with the change.

## Decision

Those four actions insert `AuditLog` in the same transaction as the request change. The row stores the request id, the staff actor, the action, and the time. An assignment also stores the new technician and, on reassignment, the previous technician. A customer self-log writes no audit row until a story names that actor.

## Why it matters

Warranty proof needs the staff member and the time for who created, assigned, updated, or cancelled the request. The ops manager can read that history for one request.
