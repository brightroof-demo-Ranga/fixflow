# ADR 0014: Ungranted actions are refused

## ADR

The API allows an action when a story says that role succeeds. Every other role is refused.

## Decision

A refused call writes nothing and returns none of the data the acceptance criterion withholds. That covers a technician assigning or cancelling, a signed-out on-behalf create, and the open-jobs and report routes for a technician or a tracking customer. Ops-manager assign, on-behalf create, and cancel stay refused while those stories leave the role unset. Saves of On site or Remote diagnosis completed by a dispatcher or an ops manager stay refused on the same basis.

## Why it matters

Several permission cells are still open. Allowing them would give assign, cancel, or the full job list to a role the workshop has not confirmed.
