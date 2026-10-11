<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# FixFlow – agent brief

## What this is

Service request and technician dispatch app for BrightRoof Solar.
Roles: customer, dispatcher, technician, ops manager.

## Stack

Next.js + TypeScript, Tailwind, Vitest (unit tests in `src/`), Playwright (browser tests in `tests/`).
Database: Prisma 7 with SQLite in dev and Postgres in production. Install `prisma@7` and `@prisma/client@7`, not the latest pre-release.

## Commands

- `npm run dev` | `npm run lint` | `npm test` | `npm run e2e`

## Traceability conventions (always follow)

- Jira space key: FIX. Every change belongs to a work item.
- Branch: `FIX-<n>-short-kebab-summary`
- Commit: `"FIX-<n>: <imperative summary>"`
- PR title: `"FIX-<n> <summary>"`; PR body lists the acceptance criteria covered
- Test names start with the AC id: `"FIX-<n> AC<k>: ..."`

## Requirements

- Source of truth: `docs/requirements/`. Never change a story's meaning in code without updating its story file in the same PR.

## Definition of done

Lint and tests pass, every AC has a test, story file and README updated, PR linked to the Jira work item.
