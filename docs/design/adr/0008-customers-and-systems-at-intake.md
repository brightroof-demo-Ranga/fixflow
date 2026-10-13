# ADR 0008: Customers and systems created at intake

## ADR

A phone number and a system id become rows when a request first uses them.

## Decision

`Customer` is unique on phone. `System` is unique on the system id string. Intake creates a missing row. A system id that is not already stored is accepted. Name, site address, and email may be empty.

## Why it matters

A valid submit needs a phone, a system id, and a description, including for a system id FixFlow has not seen before.
