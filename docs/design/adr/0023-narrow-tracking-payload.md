# ADR 0023: Narrow tracking payload

## ADR

A valid tracking link returns the fields the tracking story names.

## Decision

`GET /api/track/{token}` returns the request id, the status, the current assignee’s name when there is one, and the expected arrival to the second or the text `no arrival time`. The body includes no phone number, system id, or photo.

## Why it matters

The customer can see whether someone is coming, and who, without an account. The payload stays limited to what that page must show.
