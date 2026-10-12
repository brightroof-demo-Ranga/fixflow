---
jira: FIX-19
epic: Capture service requests
epic_key: FIX-10
status: draft
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

## Open questions

- AC9 stores a submit that omits name, site address, email, and photo, so those fields are not required. Whether the form still shows name and site address was not confirmed.
- How is system ID validated against the ~2,000 systems? AC6 stores a new request when 2000 distinct system IDs already exist. It does not check the new id against a registry.
- AC7 uses 1 December 2026, the workshop pilot date, so a submit on that date is not rejected. AC10 uses 30 November 2026 so a submit on the day before December is not rejected. The email did not name either civil date. Timezone for those dates is still open, as for AC4 and AC12.
- AC8 checks that a valid customer submit is stored with no Google Sheet and no WhatsApp API. AC11 also stores that submit when email delivery is unavailable, and no email is sent. No budget amount was stated.
- Critical vs standard at submit time vs dispatcher review (see classify-critical-fault).
- AC4 covers Saturday and Sunday. AC12 covers Monday through Friday. Neither AC names a timezone.
- AC5 keeps both requests so a second submit is not dropped. Whether the form should warn or block a matching open request was not decided.
