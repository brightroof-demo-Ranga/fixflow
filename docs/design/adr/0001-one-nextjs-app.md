# ADR 0001: One Next.js application

## ADR

The customer UI, the staff UI, and the HTTP API are one Next.js application.

## Decision

Pages live in `src/app`. Route handlers live in `src/app/api`. Customer pages require no session. Staff pages require a signed-in session and show only that role’s actions. Technician pages are laid out for a 390 CSS pixel viewport. The UI language is English.

## Why it matters

Technicians update jobs from a phone browser, and customers open a tracking link with no account. The screen and the save share one session check and one clock.
