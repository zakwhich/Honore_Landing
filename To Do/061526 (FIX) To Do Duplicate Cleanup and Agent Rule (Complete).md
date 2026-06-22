Last Updated: 2026-06-15 23:34:35 -05:00

# To Do Duplicate Cleanup and Agent Rule

## Completion Overview

Removed stale duplicate `(Incomplete)` task files where matching `(Complete)` files already existed, and updated `AGENTS.md` to explicitly require that completing a task leaves only one task file.

## Overview

Clean up stale `To Do` task files where both `(Incomplete)` and `(Complete)` versions exist for the same task, then update `AGENTS.md` so future completions leave only one task file.

## Scope

- Remove duplicate `(Incomplete)` files only when a matching `(Complete)` file exists.
- Update the project coding instructions to state that completing a task must remove/replace the incomplete file.
- Preserve active incomplete files that do not have a matching complete file.

## Phase 1: Review Existing Logs

- [x] List current `To Do` files.
- [x] Identify duplicate incomplete/complete pairs.
- [x] Review current `AGENTS.md` workflow text.

## Phase 2: Cleanup And Instruction Update

- [x] Remove stale duplicate incomplete files.
- [x] Update `AGENTS.md` with the single-file completion rule.

## Phase 3: Verify

- [x] Re-list `To Do` files to confirm duplicates are gone.
- [x] Verify `AGENTS.md` includes the new rule.
- [x] Update this note with completion summary and rename to Complete.
