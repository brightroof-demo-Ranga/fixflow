---
jira: FIX-24
epic: Field updates
epic_key: FIX-12
status: draft
version: 2
last_synced: 2026-10-12
---

# Attach photos

As a customer or technician, I want to attach photos, so that the fault is clearer.

## Acceptance criteria

### AC1

Given I am logging a request as a customer (phone + system ID, no account)  
When I attach one image file and submit a valid request  
Then the stored request includes that photo and a signed-in dispatcher can open it

### AC2

Given I am a signed-in technician updating a job assigned to me, and the device can reach the server  
When I attach one image file and save the update  
Then the stored request includes that photo and a signed-in dispatcher can open it

### AC3

Given I submit a valid request or a valid assigned-technician update with no photo  
When it is saved  
Then the request or update is stored

### AC4

Given a photo is stored on a request  
When a signed-in dispatcher, the technician assigned to that job, or an ops manager opens the request  
Then that person is shown the photo

### AC5

Given a photo is stored on a request whose assignee is technician A  
When technician B, who is not the assignee, opens the request  
Then technician B is not shown that photo

### AC6

Given I am the assigned technician and the browser cannot reach the server  
When I attach an image and submit an update  
Then that image is not stored on the request

## Open questions

- Is a photo required for critical faults?
- Max number of photos, max file size, and allowed types were not specified. AC1 and AC2 assume one file the product accepts as an image.
- May dispatchers attach photos when logging on behalf?
- May the customer see photos on the tracking link?
