---
jira: FIX-23
epic: Field updates
epic_key: FIX-12
status: in-progress
version: 4
last_synced: 2026-10-15
---

# Technician update job

As a technician, I want to update a job from my phone, so that office and customer see progress.

## Acceptance criteria

### AC1

Given I am signed in as a technician, the job is assigned to me, and the viewport is 390 CSS pixels wide  
When I open that job  
Then the On site control and the Remote diagnosis completed control are both visible, and saving each status succeeds

### AC2

Given I am signed in as the assigned technician and the device can reach the server  
When I save status On site and the save succeeds  
Then the request stores status On site and an on-site timestamp equal to the server time of that successful save

### AC3

Given I am signed in as the assigned technician and the device can reach the server  
When I save status Remote diagnosis completed and the save succeeds  
Then the request stores status Remote diagnosis completed and a remote-diagnosis-completed timestamp equal to the server time of that successful save

### AC4

Given the job is not assigned to me  
When I try to update it as a technician  
Then the update is not saved and the assignee is unchanged

### AC5

Given I am technician A and a dispatcher has reassigned the job from me to technician B  
When I try to save an update  
Then the update is not saved and the assignee remains technician B

### AC6

Given I am signed in as the assigned technician and the browser cannot reach the server  
When I submit status On site or status Remote diagnosis completed  
Then the request gains no on-site timestamp and no remote-diagnosis-completed timestamp from that attempt

### AC7

Given an offline submit did not succeed (AC6)  
When the browser can reach the server and I submit the same status again  
Then the request stores that status with a timestamp of this successful save, not the time of the failed attempt

### AC8

Given the request status is cancelled  
When I, as the assigned technician, try to save an update  
Then the update is not saved and the status remains cancelled

### AC9

Given I am signed in as a technician, at least one request is assigned to me, and the viewport is 390 CSS pixels wide  
When I open my jobs  
Then every request assigned to me is listed with its request id, and a request assigned only to another technician is not listed

### AC10

Given I am technician A and a dispatcher has reassigned a request from me to technician B  
When I open my jobs while signed in as technician A, with the viewport 390 CSS pixels wide  
Then that request id is not listed

### AC11

Given I am signed in as the assigned technician, the device can reach the server, and the status is On site or Remote diagnosis completed  
When I save status completed and the save succeeds  
Then the request stores status completed and a completed timestamp equal to the server time of that successful save
