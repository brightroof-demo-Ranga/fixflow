---
name: ready-check
description: >-
  Ready-check a FIX work item against the Definition of Ready. Given a story
  key, fetch the Jira issue, open its story file, and check that the ACs are
  present and testable and match Jira, there are no open questions,
  dependencies are Done or in the same sprint, and the design covers the
  story. Post the result as a Jira comment and show the same result in chat.
  Use when the user asks for a ready check, definition of ready, or whether a
  FIX work item is ready.
disable-model-invocation: true
---

# Ready check

Given a story key (for example `FIX-29`; story keys in front matter are `FIX-16` through `FIX-30`):

1. Fetch the work item with `getJiraIssue` (`responseContentFormat: "markdown"`), including status, sprint, and links. Resolve `cloudId` with `getAccessibleAtlassianResources` if you do not already have it.
2. Open its story file: the file under `docs/requirements/stories/` whose front matter `jira` equals that key. If none or more than one matches, post `Ready check: NOT READY` with that as the reason, skip the four checks, and show the same text in chat.
3. Check four things. Each check is `PASS` or `FAIL` with one line of reason.
4. Post one comment with `addCommentToJiraIssue` (`contentFormat: "markdown"`), then show the same comment in chat. Do not transition, edit fields, or change any file.

## The four checks

**ACs are present and testable.** The story has an Acceptance criteria section with at least one AC, numbered AC1, AC2, … with no gaps. Each AC is Given / When / Then, so each has a clear pass or fail. An AC that uses a word like "fast", "easy", or "user-friendly" without a number fails. The acceptance criteria on the Jira work item match the story file. Follow `.cursor/rules/requirements.mdc`.

**Open questions.** Pass only when the Open questions section is missing or empty. Any item in that section fails.

**Dependencies are Done or in the same sprint.** A dependency is an issue this work item is blocked by or depends on (inward Blocks or Depends). Check each with JQL for status and sprint. It passes when its status category is Done, or it shares a sprint with this work item. If this work item is in no sprint, only Done counts. No such links passes. Do not read story files or `epics.md` for dependencies.

**The design covers the story.** `docs/design/architecture.md` names an API route, a screen, or a data-model entity for this story (by story file or H1 title). Cite a matching ADR under `docs/design/adr/` when one exists. An ADR alone does not pass. Fail when the story is not named, or the only mention is unset behavior under "Open behavior this design does not invent".

## Comment

First line is `Ready check: READY` only when all four pass. Otherwise `Ready check: NOT READY`. Then one line per check, `PASS` or `FAIL`, with one reason on that line. Then `What to fix`, listing only the failed checks.

```
Ready check: NOT READY

- ACs present and testable: PASS — AC1–AC11 are Given/When/Then and match Jira
- Open questions: FAIL — still lists who may record remote diagnosis
- Dependencies Done or in the same sprint: PASS — no blocked-by or depends-on links
- Design covers the story: PASS — architecture names the SLA fields and routes; ADR 0015 applies

What to fix
- Open questions: remove or resolve the remote-diagnosis question in the story file
```
