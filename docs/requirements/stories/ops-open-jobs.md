---
jira: FIX-30
epic: Operations reporting
epic_key: FIX-15
status: draft
version: 2
last_synced: 2026-10-12
---

# Ops open jobs

As an ops manager, I want to see open jobs, so that I know what is going on.

A request is listed only when its status is neither completed nor cancelled.

## Acceptance criteria

### AC1

Given I am signed in as an ops manager  
When I open the open-jobs view  
Then I see every request whose status is neither completed nor cancelled, and each row shows request id, customer phone, system ID, the current assignee’s name if there is an assignee, and whether the request is critical

### AC2

Given a request has status completed  
When I open the open-jobs view  
Then that request is not listed

### AC3

Given I am signed in as a technician, or I am a customer using a tracking link  
When I open the open-jobs view  
Then I do not see the list of every open job

### AC4

Given a request has status cancelled  
When I open the open-jobs view  
Then that request is not listed

### AC5

Given an open request was reassigned from technician A to technician B  
When I open the open-jobs view  
Then that row shows technician B as the assignee and does not show technician A as the assignee
