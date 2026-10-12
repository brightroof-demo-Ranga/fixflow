---
jira: FIX-18
epic: Platform
epic_key: FIX-9
status: draft
version: 2
last_synced: 2026-10-12
---

# Audit log

As an ops manager, I want an audit log of who created, assigned, and updated a request, so that we can prove what happened.

## Acceptance criteria

### AC1

Given a signed-in dispatcher creates a request on a customer’s behalf  
When the request is saved  
Then an audit entry records the request id, the dispatcher’s staff identity, the action “created”, and a timestamp

### AC2

Given a signed-in dispatcher assigns a technician to a request that has no assignee  
When the assignment is saved  
Then an audit entry records the request id, the dispatcher’s staff identity, the action “assigned”, the technician identity, and a timestamp

### AC3

Given a signed-in technician updates a request  
When the update is saved  
Then an audit entry records the request id, the technician’s staff identity, the action “updated”, and a timestamp

### AC4

Given I am signed in as an ops manager and a request has create, assign, and update entries  
When I open the audit history for that request  
Then each of those entries is visible and each shows its timestamp

### AC5

Given a request is assigned to technician A  
When a signed-in dispatcher assigns technician B  
Then an audit entry records the request id, the dispatcher’s staff identity, the action “assigned”, technician B’s identity, technician A’s identity as the previous assignee, and a timestamp

### AC6

Given a signed-in dispatcher cancels a request  
When the cancellation is saved  
Then an audit entry records the request id, the dispatcher’s staff identity, the action “cancelled”, and a timestamp

## Open questions

- Does a customer self-log create an audit row with actor “customer” (phone + system ID) rather than a staff user?
- How long are audit records kept?
- Can dispatchers and technicians read the audit log, or only ops managers?
- AC4 does not require a sort direction. Oldest-first versus newest-first was not specified.
