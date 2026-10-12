---
jira:
epic: Platform
epic_key:
status: draft
version: 2
last_synced:
---

# Roles and permissions

As an ops manager, I want distinct roles (dispatcher, technician, ops manager), so that each person only does their job.

Customers have no accounts (workshop).

## Acceptance criteria

### AC1

Given I am signed in as an ops manager and a staff user exists  
When I view that user  
Then their role is exactly one of: dispatcher, technician, ops manager

### AC2

Given I am signed in as a technician  
When I try to assign a technician to a request  
Then the assignee is unchanged

### AC3

Given I identify with phone number and system ID as a customer  
When I use customer intake or a tracking link  
Then I am not required to have a staff account or a customer account

### AC4

Given I am signed in as a dispatcher  
When I open on-behalf create and technician assign  
Then both controls are present, and a valid on-behalf create and a valid assign both succeed

### AC5

Given I am signed in as a technician and the request assignee is technician A  
When I try to change the assignee to a different technician  
Then the assignee remains technician A

## Open questions

- May an ops manager also assign, reassign, and log on behalf, or only view reports and audit?
- Who creates and changes staff roles?
- Exact permission matrix beyond AC2–AC5 is not in the workshop.
