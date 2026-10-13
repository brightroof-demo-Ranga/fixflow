# ADR 0006: Database-backed staff session

## ADR

Staff sign-in is a session in this application. No identity provider is selected.

## Decision

A successful sign-in sets an httpOnly cookie to an unguessable session id. The database stores a hash of that id, the staff user, and an expiry. Sign-out deletes the session. A staff route with no session returns the sign-in challenge and no request data. Password, magic link, and SSO remain open. SSO is not selected.

## Why it matters

Assign and update stay limited to a signed-in dispatcher, technician, or ops manager, and sign-out ends that access. The session stands before BrightRoof chooses a sign-in factor.
