Last Updated: 2026-06-15 23:03:31 -05:00

# Deleted Services Stay Removed

## Completion Overview

Stopped the server from re-adding missing default services after a saved service list already exists. Defaults are now first-run seed data only, so services removed through the admin portal stay removed after save/restart.

## Overview

Services removed in the admin portal should stay removed. The server currently treats missing default services as something to repair, which causes deleted defaults to reappear at the bottom of the list.

## Scope

- Stop re-adding missing default services after a saved service file exists.
- Keep default services as first-run seed data.
- Preserve fallback behavior if the saved service file is corrupt or unreadable.
- Rebuild the running container after the fix.

## Phase 1: Confirm Cause

- [x] Review admin remove/save behavior.
- [x] Review server service file initialization.
- [x] Identify default-service merge behavior.

## Phase 2: Implement Fix

- [x] Remove default-service merge on existing saved data.
- [x] Remove now-unused merge helper if appropriate.

## Phase 3: Verify And Deploy

- [x] Verify changed source path.
- [x] Rebuild/restart the container.
- [x] Confirm the app health endpoint after restart.
- [x] Update this note with completion summary and rename to Complete.

Verification note: Rebuilt `honore-home`, confirmed the container is healthy, and verified `/api/health` returned `{"status": "ok"}`.
