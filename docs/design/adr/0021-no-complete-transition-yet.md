# ADR 0021: No complete transition yet

## ADR

`completed` is a status the reports read. No role may set it until a story names who does.

## Decision

Open jobs exclude a request whose status is `completed`. Average time to resolve reads `completedAt`. The lifecycle has no transition into Completed, and the API has no complete route.

## Why it matters

The reports need this status, and no acceptance criterion names the person who may record it. The API waits for that story.
