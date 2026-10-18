---
jira: FIX-19
epic: Capture service requests
epic_key: FIX-10
status: in-progress
version: 4
last_synced: 2026-10-12
---

# Customer log request

As a customer, I want to log a problem with phone number and system ID, so that the job is not lost.

## Acceptance criteria

### AC1

Given I am a customer without an account  
When I submit a service request with a phone number, a system ID, and a problem description  
Then a request is stored with those values, a unique request id, and a create timestamp

### AC2

Given I omit phone number or system ID  
When I try to submit  
Then no request is stored, no request id is issued, and the screen names each missing field

### AC3

Given I submitted a valid request  
When I look at the confirmation  
Then the confirmation shows the request id for that stored request

### AC4

Given a phone number, a system ID, and a problem description  
When I submit while the application clock is a Saturday or a Sunday  
Then the request is stored with a unique request id and a create timestamp, and the response is not a rejection for being outside office hours

### AC5

Given a stored request already exists for phone number P and system ID S, and that request is not completed and not cancelled  
When I submit another request with phone number P, system ID S, and a problem description  
Then a second request is stored with a different request id and its own create timestamp, and the first request is unchanged

### AC6

Given 2000 stored requests already exist and each has a distinct system ID  
When I submit a service request with a phone number, a system ID that is not one of those 2000, and a problem description  
Then the request is stored with those values, a unique request id, and a create timestamp

### AC7

Given a phone number, a system ID, and a problem description  
When I submit while the application clock is 1 December 2026  
Then the request is stored with a unique request id and a create timestamp, and the response is not a rejection for that calendar date

### AC8

Given I am a customer without an account, and no Google Sheet and no WhatsApp API are available  
When I submit a service request with a phone number, a system ID, and a problem description  
Then the request is stored with a unique request id and a create timestamp

### AC9

Given I am a customer without an account  
When I submit a phone number, a system ID, and a problem description, and I omit name, site address, email address, and photo  
Then the request is stored with a unique request id and a create timestamp, and the response is not a rejection for those omitted fields

### AC10

Given a phone number, a system ID, and a problem description  
When I submit while the application clock is 30 November 2026  
Then the request is stored with a unique request id and a create timestamp, and the response is not a rejection for that calendar date

### AC11

Given I am a customer without an account, and no Google Sheet, no WhatsApp API, and no email delivery are available  
When I submit a service request with a phone number, a system ID, and a problem description  
Then the request is stored with a unique request id and a create timestamp, and no email is sent

### AC12

Given a phone number, a system ID, and a problem description  
When I submit while the application clock is a Monday, Tuesday, Wednesday, Thursday, or Friday  
Then the request is stored with a unique request id and a create timestamp, and the response is not a rejection for being outside office hours

## Behavior

A customer with no account logs a problem at `/requests/new`. The form submits phone, system ID, and description to `POST /api/requests`. There is no session.

A valid submit stores a `ServiceRequest` with source `customer_form`, a new request id, and `createdAt` from the application clock. The confirmation shows that request id. The create response also returns a tracking token once; the database stores only its SHA-256 hash.

Phone and system ID are required. An empty phone number or system ID stores nothing, issues no request id, and the screen names each missing field. Name, site address, email, and photo may be absent. A second open request for the same phone and system ID is a new row, and the first row stays as it was. A system ID that is not already stored is accepted.

The route does not call a Google Sheet, a WhatsApp API, or email. It does not reject a weekend, a weekday, 30 November 2026, or 1 December 2026.

If the submit does not reach the server, or the server does not accept it and does not name a missing field, the screen stays on the form and shows "The request was not submitted. Try again." It does not name the phone number, system ID, or problem description as missing.
