# ADR 0018: Dispatcher sets the critical flag

## ADR

Critical is a boolean on the request. It is not a status and not a keyword rule.

## Decision

`critical` stays false until a signed-in dispatcher marks it on create or on a later edit. The public form has no critical field. Saving the flag re-runs the SLA evaluator. A true value applies the 24-hour rules. A false value leaves both SLA result columns empty.

## Why it matters

The warranty clock applies to the jobs a dispatcher classifies as critical. A job left unmarked must not appear as a critical breach.
