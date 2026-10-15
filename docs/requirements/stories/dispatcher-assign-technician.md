---
jira: FIX-21
epic: Dispatch and assign
epic_key: FIX-11
status: in-progress
version: 3
last_synced: 2026-10-12
---

# Dispatcher assign technician

As a dispatcher, I want to assign a technician, so that someone owns the job.

## Acceptance criteria

### AC1

Given I am signed in as a dispatcher and a request has no technician  
When I assign a technician who has the technician role  
Then that technician is the only assignee, and the request stores an assignment timestamp of that save

### AC2

Given I am signed in as a dispatcher and the request’s assignee is technician A  
When I assign technician B, who has the technician role and is not A  
Then technician B is the only assignee, technician A is not the assignee, and the assignment timestamp is the time of this save

### AC3

Given I am signed out, or I am signed in as a technician  
When I try to assign a technician  
Then the assignee is unchanged

### AC4

Given I am signed in as a dispatcher and at least one staff user has the technician role  
When I open the list of people I can assign  
Then every person in that list has the technician role, and the list has no customer phone numbers or system IDs

### AC5

Given I am signed in as a dispatcher  
When I try to assign a staff user whose role is dispatcher or ops manager  
Then the assignee is unchanged

### AC6

Given the request status is cancelled  
When I, as a signed-in dispatcher, try to assign a technician  
Then the assignee is unchanged and the status remains cancelled

### AC7

Given I am signed in as a dispatcher and a request has no technician  
When I assign a technician who has the technician role and I save an expected arrival timestamp with that assignment  
Then that technician is the only assignee, and the request stores that expected arrival timestamp

### AC8

Given I am signed in as a dispatcher, the request’s assignee is technician A, and the request stores an expected arrival timestamp  
When I assign technician B, who has the technician role and is not A, and I save a different expected arrival timestamp  
Then the request stores the expected arrival timestamp from this save

### AC9

Given I am signed in as a dispatcher and exactly 12 staff users have the technician role  
When I open the list of people I can assign  
Then the list contains those 12 users and no one else
