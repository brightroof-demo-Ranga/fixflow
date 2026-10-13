# ADR 0012: Hashed tracking token

## ADR

The public tracking URL carries a random secret. The database stores the hash.

## Decision

Create generates a 256-bit token, stores its SHA-256 hash, and returns the raw token in the create response and the create SMS. The public path is `/track/{token}`. Lookup hashes the path token. A URL that only substitutes another request id matches no hash and returns no phone, system id, or status.

## Why it matters

The customer opens the job with no account. The link must not be a guessable request id.
