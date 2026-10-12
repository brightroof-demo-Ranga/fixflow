---
jira:
epic: Customer status
epic_key:
status: draft
version: 4
last_synced:
---

# SMS notify customer

As a customer, I want SMS updates, so that I do not have to call the hotline.

An outbound SMS is testable as a recorded send to a destination number with a body. Provider delivery receipts stay an open question.

## Acceptance criteria

### AC1

Given a request is created with a phone number  
When the request is saved  
Then one outbound SMS is recorded to that phone number and the body contains the tracking link for that request id

### AC2

Given a request has no assignee  
When a dispatcher assigns a technician and the assignment is saved  
Then one outbound SMS is recorded to the customer phone number and the body contains "assigned"

### AC3

Given on-site or remote diagnosis completed is recorded on the request  
When that update is saved  
Then one outbound SMS is recorded to the customer phone number, and the body contains "on site" when that was the update, or "remote diagnosis" when that was the update

### AC4

Given a request is created with a phone number and without an email address  
When the request is saved  
Then the outbound SMS in AC1 is still recorded

### AC5

Given the customer was already sent the assignment SMS for technician A  
When a dispatcher assigns technician B and that assignment is saved  
Then one new outbound SMS is recorded to the customer phone number after that save, and the body contains "assigned"

### AC6

Given two requests are saved for the same phone number  
When each create is processed  
Then two outbound SMS messages are recorded, and each body contains the tracking link for a different request id

### AC7

Given a request has no assignee  
When a dispatcher assigns a technician, saves an expected arrival timestamp with that assignment, and the assignment is saved  
Then one outbound SMS is recorded to the customer phone number, and the body contains "assigned" and that expected arrival timestamp, to the second

### AC8

Given a request has no assignee  
When a dispatcher assigns a technician, does not save an expected arrival timestamp, and the assignment is saved  
Then one outbound SMS is recorded to the customer phone number, and the body contains "assigned" and "no arrival time"

## Open questions

- SMS provider, sender id, and what happens when the provider rejects a number were not specified. These ACs check that FixFlow recorded the send.
- Exact SMS copy was not specified beyond the facts named in AC1–AC3, AC5, AC7, and AC8. Display timezone for the expected arrival timestamp in AC7 is unspecified. AC7 passes when the body contains that stored instant, to the second. AC8 passes when the body contains "no arrival time".
- Should the assignment SMS name the technician?
- Should cancellation send an SMS? Not in these ACs.
- Email remains optional. AC4 passes with no email address on the request; it does not forbid a later email channel.
