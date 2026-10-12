---
name: sync-jira
description: Create or update Jira work items in space FIX from the story files in docs/requirements.
disable-model-invocation: true
---

# Sync requirements to Jira (atlassian MCP, space FIX)

1. Read docs/requirements/epics.md and every file in docs/requirements/stories/.
2. Epics without a key: create work type Epic, write the key into epics.md and into epic_key in each of that epic's story files.
3. For each story file:
   - No `jira` key: create work type Story with parent = its epic key. Summary = the H1 title. Description = story line, then a section "Acceptance criteria" with AC1..n verbatim, then a link to the file on GitHub. Add label ac-v<version>. Write the new key into front matter.
   - Has a key: fetch it. If summary or acceptance criteria differ from the file, edit Jira to match the file exactly, swap the ac-v label to the new version, and add a comment: "Requirements updated to v<version>: <one-line summary of change>".
4. Set last_synced to today in every file you touched.
5. Never transition, delete or reassign work items.
6. If the user says "dry run", call only read tools and print the plan.
7. End with a table: file | key | action (created / updated / unchanged).
