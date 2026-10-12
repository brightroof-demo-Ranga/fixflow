---
jira: FIX-22
epic: Dispatch and assign
epic_key: FIX-11
status: draft
version: 1
last_synced: 2026-10-12
---

# Cancel request

As a dispatcher, I want to cancel an open request when the customer no longer wants the visit, so that we stop dispatching that job.

The workshop did not define cancellation. These ACs are a working rule so the edge case has a pass/fail. Confirm them before build.

## Acceptance criteria

### AC1

Given I am signed in as a dispatcher and the request status is neither completed nor cancelled  
When I cancel the request  
Then the status is cancelled and the request stores a cancelled timestamp of that save

### AC2

Given the request status is cancelled and I am the assigned technician  
When I try to save an update  
Then the update is not saved and the status remains cancelled

### AC3

Given the request status is cancelled  
When a signed-in ops manager opens the open-jobs view  
Then the request is not listed

### AC4

Given I am signed out, or I am signed in as a technician  
When I try to cancel a request  
Then the status is unchanged

### AC5

Given the request status is cancelled  
When a signed-in dispatcher tries to assign a technician  
Then the assignee is unchanged and the status remains cancelled

## Open questions

- Can the customer cancel from the tracking link with no dispatcher? These ACs do not add that control. The tracking page only shows status Cancelled after a dispatcher cancel.
- Does cancelling a critical request with no on-site or remote-diagnosis timestamp count as an SLA breach? The SLA story AC6 says no until warranty owners confirm.
- Can a cancelled request be reopened?
- May an ops manager cancel?
- Is a cancellation note required?
