---
jira: FIX-20
epic: Capture service requests
epic_key: FIX-10
status: draft
version: 4
last_synced: 2026-10-12
---

# Dispatcher log on behalf

As a dispatcher, I want to enter WhatsApp and phone requests on the customer’s behalf, so that existing channels still work.

## Acceptance criteria

### AC1

Given I am signed in as a dispatcher  
When I submit a phone number, a system ID, a problem description, and a source of WhatsApp or phone  
Then a request is stored with those values and a unique request id, and no customer account is created

### AC2

Given I saved that on-behalf request  
When a dispatcher assigns it, the assigned technician updates it, and an ops manager opens open jobs while it is not completed and not cancelled  
Then the assign succeeds, the technician update succeeds, and the request is listed on the open-jobs view

### AC3

Given I am signed out, or I am signed in as a technician  
When I try to create an on-behalf request  
Then no request is stored

### AC4

Given I am signed in as a dispatcher  
When I save an on-behalf request with source WhatsApp or source phone  
Then the stored request records that source, and the source is not “customer form”

### AC5

Given an open request already exists for phone number P and system ID S (not completed and not cancelled)  
When I, as a signed-in dispatcher, save another on-behalf request with phone number P and system ID S  
Then a second request is stored with a different request id, and the first request is unchanged

### AC6

Given I am signed in as a dispatcher and the application clock is a Saturday or a Sunday  
When I submit one on-behalf request with source WhatsApp and a second with source phone, each with a phone number, a system ID, and a problem description  
Then each request is stored with its own request id and create timestamp, the WhatsApp submit records source WhatsApp, the phone submit records source phone, and neither response is a rejection for being outside office hours

### AC7

Given I am signed in as a dispatcher and the application clock is a Monday, Tuesday, Wednesday, Thursday, or Friday  
When I submit one on-behalf request with source WhatsApp and a second with source phone, each with a phone number, a system ID, and a problem description  
Then each request is stored with its own request id and create timestamp, the WhatsApp submit records source WhatsApp, the phone submit records source phone, and neither response is a rejection for being outside office hours

### AC8

Given I am signed in as a dispatcher, and no WhatsApp API and no hotline API are available  
When I submit one on-behalf request with source WhatsApp and a second with source phone, each with a phone number, a system ID, and a problem description  
Then each request is stored with its own request id and the source I submitted, and FixFlow creates no request from an inbound WhatsApp or hotline event

### AC9

Given I am signed in as a dispatcher  
When I submit an on-behalf request with a phone number, a system ID, a problem description, a source of WhatsApp or phone, and an original contact timestamp  
Then the request stores that original contact timestamp and a create timestamp as two separate values

### AC10

Given I am signed in as a dispatcher  
When I submit an on-behalf request with a phone number, a system ID, a problem description, and a source of WhatsApp or phone, and I omit an original contact timestamp  
Then the request is stored with a unique request id and a create timestamp, and no original contact timestamp is stored
