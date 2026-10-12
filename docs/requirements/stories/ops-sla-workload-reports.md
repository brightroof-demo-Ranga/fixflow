---
jira:
epic: Operations reporting
epic_key:
status: draft
version: 2
last_synced:
---

# Ops SLA and workload reports

As an ops manager, I want SLA breaches, average time to resolve, and jobs per technician per week, so that we see duration and overload.

A week is Monday 00:00:00 through Sunday 23:59:59 in the report timezone. Tests set that timezone. Which real-world timezone BrightRoof uses is still open.

A job counts for a technician in that week only when that technician is the current assignee and the current assignment timestamp falls in the week. A reassigned job counts for the new assignee only.

## Acceptance criteria

### AC1

Given I am signed in as an ops manager and at least one critical request is recorded as SLA breached  
When I open the SLA report  
Then each of those breached request ids is listed, and a critical request recorded as neither met nor breached (including a cancelled request under the SLA story) is not listed as breached

### AC2

Given I am signed in as an ops manager and I choose a period by start instant and end instant  
And at least one request has a completed timestamp inside that period  
When I open the average time-to-resolve report  
Then the value shown equals the arithmetic mean of (completed timestamp minus create timestamp) for requests whose completed timestamp is inside the period, and requests outside the period are excluded

### AC3

Given I am signed in as an ops manager and the report timezone is set  
When I open jobs per technician for one Monday–Sunday week in that timezone  
Then every staff user with the technician role is listed with a count, the count matches the current-assignee rule above, and a technician with no such jobs shows 0

### AC4

Given I am signed in as a technician, or I am a customer using a tracking link  
When I open these reports  
Then I do not see the SLA breach list, the average time to resolve, or the jobs-per-technician counts

### AC5

Given a job was assigned to technician A and then reassigned to technician B, and B’s assignment timestamp falls in the selected week  
When I open jobs per technician for that week  
Then the job is included in B’s count and is not included in A’s count

### AC6

Given I choose a period that contains no completed timestamps  
When I open the average time-to-resolve report  
Then the report shows 0 completed requests and does not show an average computed from requests outside that period

## Open questions

- Default period when the ops manager has not chosen one?
- Week timezone is configured in the test and in production; the customer has not named it.
- Is a request “resolved” only when status becomes completed, or also at on-site or remote diagnosis? AC2 uses the completed timestamp only.
- May dispatchers open these reports? AC4 does not deny them.
