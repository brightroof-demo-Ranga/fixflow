---
name: expand-request
description: Turn raw customer intake into clarifying questions, a PRD, epics and user stories with acceptance criteria.
disable-model-invocation: true
---

# Expand a customer request

## Phase 1 – questions only (when no workshop notes exist yet)

1. Read the intake files the user names. Write no requirements yet.
2. Create `docs/requirements/questions.md`. Group questions under: Scope, Users and roles, Workflow, SLAs and data, Integrations, Non-functional, Delivery. For each: why it matters + a suggested default answer.
3. Stop and tell the user to get answers from the customer.

## Phase 2 – once `docs/intake/*workshop*.md` exists

1. `docs/requirements/PRD.md`: problem, goals with measurable targets, personas, in/out of scope, MVP vs later, non-functional requirements, assumptions, risks, open questions.
2. `docs/requirements/epics.md`: 4–7 epics, each with goal + story list.
3. One file per story in `docs/requirements/stories/`, following the requirements rule (front matter, story line, AC1..n in Given/When/Then).
4. `docs/requirements/traceability.md`: intake need -> story -> AC ids.
5. Never invent answers: put assumptions under "Open questions".
