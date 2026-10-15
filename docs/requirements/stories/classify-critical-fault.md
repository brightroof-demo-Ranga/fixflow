---
jira: FIX-28
epic: Critical SLA
epic_key: FIX-14
status: draft
version: 2
last_synced: 2026-10-12
---

# Classify critical fault

As a dispatcher, I want critical faults flagged using the workshop definition, so that the 24-hour rule applies to the right jobs.

Workshop definition: system produces zero output, or any safety sign: smoke, burning smell, sparks, exposed wiring.

## Acceptance criteria

### AC1

Given I am a signed-in dispatcher creating or editing a request  
When I mark the request as critical and save  
Then the stored request is critical

### AC2

Given I am a signed-in dispatcher and the problem description states that the system produces zero output  
When I mark the request critical and save  
Then the save succeeds and the stored request is critical

### AC3

Given I am a signed-in dispatcher and the problem description includes at least one of: smoke, burning smell, sparks, exposed wiring  
When I mark the request critical and save  
Then the save succeeds and the stored request is critical

### AC4

Given a request is stored as not critical  
When the 24-hour critical SLA is evaluated  
Then that request is not recorded as a critical SLA breach

### AC5

Given I am a signed-in dispatcher and the problem description does not state zero output and does not include smoke, burning smell, sparks, or exposed wiring  
When I save the request without marking it critical  
Then the stored request is not critical
