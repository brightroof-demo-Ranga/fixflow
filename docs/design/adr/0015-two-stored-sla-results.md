# ADR 0015: Two stored SLA results

## ADR

The create-timestamp result and the original-contact result are both stored. Writing one leaves the other as it was.

## Decision

`createTimestampResult` is `met`, `breached`, or null from `createdAt` and a window of 86400 seconds. `originalContactResult` uses `originalContactAt` with the same window, and only when that timestamp is stored and the request is critical. A non-critical request records neither result as a critical breach. A cancelled critical request with no response timestamp records neither met nor breached. Timestamps are UTC instants. The breach report lists critical requests whose `createTimestampResult` is `breached`. Average time to resolve is the mean of `completedAt - createdAt` for completions inside the chosen period, and it is a separate figure.

## Why it matters

Ops can show the 24-hour result from the FixFlow create time, and the result from the original WhatsApp or call time when a dispatcher entered one. The workshop has not said which clock the contract uses.
