---
jira: FIX-29
epic: Critical SLA
epic_key: FIX-14
status: draft
version: 3
last_synced: 2026-10-12
---

# SLA 24-hour response

As an ops manager, I want recorded on-site or remote-diagnosis time within 24 hours of the request, so that we can prove the warranty.

Workshop: respond means a technician is on site, or has completed a remote diagnosis, within 24 hours of the request.

Working clock for these ACs: start time is the request’s FixFlow create timestamp. A response is on time when the earlier of the on-site timestamp and the remote-diagnosis-completed timestamp, if either exists, is at most 86400 seconds after create. This matches the PRD assumption and is not a workshop answer.

## Acceptance criteria

### AC1

Given a critical request that is not cancelled  
When an on-site timestamp or a remote-diagnosis-completed timestamp exists  
And the earlier of those timestamps is at most 86400 seconds after the create timestamp  
Then the request is recorded as SLA met

### AC2

Given a critical request that is not cancelled  
When more than 86400 seconds have passed since the create timestamp  
And there is no on-site timestamp and no remote-diagnosis-completed timestamp  
Then the request is recorded as SLA breached

### AC3

Given a critical request that is recorded as SLA met or SLA breached  
When I am signed in as an ops manager and I open that request  
Then I can see the create timestamp, the on-site timestamp if present, the remote-diagnosis-completed timestamp if present, and the result met or breached

### AC4

Given a non-critical request  
When more than 86400 seconds pass without an on-site timestamp and without a remote-diagnosis-completed timestamp  
Then it is not recorded as a critical-fault SLA breach

### AC5

Given a critical request that is not cancelled  
When the earlier response timestamp is more than 86400 seconds after the create timestamp  
Then the request is recorded as SLA breached and is not recorded as SLA met

### AC6

Given a critical request is cancelled and has no on-site timestamp and no remote-diagnosis-completed timestamp  
When more than 86400 seconds have passed since the create timestamp  
Then the request is not recorded as SLA met and is not recorded as SLA breached

### AC7

Given a critical request that is not cancelled and that stores an original contact timestamp  
When the earlier of the on-site timestamp and the remote-diagnosis-completed timestamp, if either exists, is at most 86400 seconds after the original contact timestamp  
Then the request records original-contact result met, and the SLA met or SLA breached value defined from the create timestamp is unchanged

### AC8

Given a critical request that is not cancelled and that stores an original contact timestamp  
When more than 86400 seconds have passed since the original contact timestamp  
And there is no on-site timestamp and no remote-diagnosis-completed timestamp  
Then the request records original-contact result breached, and the SLA met or SLA breached value defined from the create timestamp is unchanged

### AC9

Given a critical request records an original-contact result and an SLA result from the create timestamp  
When I am signed in as an ops manager and I open that request  
Then I can see the original contact timestamp, the create timestamp, the original-contact result, and the create-timestamp result

### AC10

Given a critical request has no original contact timestamp  
When the SLA result is evaluated  
Then no original-contact result is recorded

### AC11

Given a critical request that is not cancelled and that stores an original contact timestamp  
When the earlier of the on-site timestamp and the remote-diagnosis-completed timestamp is more than 86400 seconds after the original contact timestamp  
Then the request records original-contact result breached, and the SLA met or SLA breached value defined from the create timestamp is unchanged
