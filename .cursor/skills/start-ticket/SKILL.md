---
name: start-ticket
description: Start work on a Jira work item - fetch context, branch, plan, build, test.
disable-model-invocation: true
---

# Start a ticket (argument: a key like FIX-7)

1. Fetch the work item and its sub-tasks with the atlassian MCP.
2. Find the story file whose front matter has this key; read it, the architecture doc and relevant ADRs. If Jira and the file disagree on acceptance criteria, STOP and report the difference.
3. git checkout -b FIX-<n>-<short-kebab-summary> from an up-to-date main; set status: in-progress in the story file.
4. Transition the work item to In Progress and comment "Started on branch <name>".
5. Produce a plan: files to change, tests to write (one per AC), risks. Wait for my approval.
6. Implement in small steps. Write the AC tests first, see them fail, then make them pass. Commit after each green step: "FIX-<n>: <summary>".
7. Run lint, unit and e2e tests. Never mark an AC done without a passing test.
8. Finish with: ACs covered (with test names), anything not done, follow-ups.
