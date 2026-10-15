---
jira: FIX-25
epic: Customer status
epic_key: FIX-13
status: draft
version: 4
last_synced: 2026-10-12
---

# Customer tracking link

As a customer, I want a tracking link (no account), so that I know when someone is coming.

## Acceptance criteria

### AC1

Given a request was logged (by the customer or by a dispatcher) with a phone number and a system ID  
When the request is created  
Then a tracking link exists that opens that request with no sign-in

### AC2

Given I am signed out and I open a valid tracking link  
When the request has an assignee and has neither an on-site timestamp nor a remote-diagnosis-completed timestamp  
Then the page shows status Assigned, the current assignee’s name, and the request id, and it has no account-creation control

### AC3

Given I do not have the tracking link issued for a request  
When I open a URL that only substitutes another request id  
Then the response does not include that other customer’s phone number, system ID, or status

### AC4

Given I am a customer with a valid tracking link  
When I open it  
Then I am not asked to create an account

### AC5

Given I am signed out and I open a valid tracking link  
When the request has no assignee, no on-site timestamp, and no remote-diagnosis-completed timestamp, and it is not cancelled  
Then the page shows the request id and status Not assigned

### AC6

Given the assignee changed from technician A to technician B  
When I open the valid tracking link while signed out  
Then the page shows technician B as the current assignee and does not show technician A as the current assignee

### AC7

Given the request has an on-site timestamp, a remote-diagnosis-completed timestamp, or both  
When I open the valid tracking link while signed out  
Then the page shows On site if that timestamp is the later of the two present timestamps, otherwise Remote diagnosis completed

### AC8

Given the request status is cancelled  
When I open the valid tracking link while signed out  
Then the page shows status Cancelled and does not show status Assigned, On site, or Remote diagnosis completed

### AC9

Given I am signed out and I open a valid tracking link  
When the request has an assignee and an expected arrival timestamp, and it has neither an on-site timestamp nor a remote-diagnosis-completed timestamp  
Then the page shows that expected arrival timestamp, to the second

### AC10

Given I am signed out and I open a valid tracking link  
When the request has an assignee, has no expected arrival timestamp, and has neither an on-site timestamp nor a remote-diagnosis-completed timestamp  
Then the page shows status Assigned, the current assignee’s name, the request id, and the text "no arrival time"
