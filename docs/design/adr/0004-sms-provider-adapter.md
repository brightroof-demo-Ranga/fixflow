# ADR 0004: SMS provider adapter

## ADR

Outbound SMS goes through an adapter. The provider is unset.

## Decision

Each required send inserts one `Notification` in the same transaction as the request change. The adapter runs after that transaction commits. Kinds are `tracking_link`, `assigned`, `on_site`, and `remote_diagnosis`. Tests use an adapter that records the destination and body. A provider rejection leaves the saved request in place.

## Why it matters

The customer must get the tracking link, the assignment, and the on-site or remote-diagnosis update. The stories check that FixFlow recorded the send. Provider, sender id, and who pays remain open.
