# ADR 0016: Response instant from a successful save

## ADR

The SLA response instant is the earlier of the stored on-site time and the stored remote-diagnosis time.

## Decision

`onSiteAt` and `remoteDiagnosisCompletedAt` are the server time of the latest successful save of that status by the current assignee. A submit that never reaches the server stores neither timestamp nor photo. The next successful submit uses that later server time. With neither column set, there is no response instant. The result is `met` when the response instant is at most 86400 seconds after the clock start, and `breached` when it is later or the window has passed with no response instant.

## Why it matters

A failed submit on a roof with no signal must not set the warranty time. The recorded response is the save the server accepted.
