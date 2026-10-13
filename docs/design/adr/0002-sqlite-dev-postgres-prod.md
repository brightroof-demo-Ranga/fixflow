# ADR 0002: SQLite in development and Postgres in production

## ADR

The database engine is the one named in `AGENTS.md`. The production host is unset.

## Decision

Prisma 7 maps the model in `docs/design/architecture.md`. Development uses SQLite. Production uses Postgres. No Postgres host is selected.

## Why it matters

Local tests run without a hosted database. Production still has a transactional store for requests, assignments, audit rows, and SLA results. The host is a paid-service choice and stays open.
