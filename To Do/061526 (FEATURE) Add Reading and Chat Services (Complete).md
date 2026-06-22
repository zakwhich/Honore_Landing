# Add Reading and Chat Services

**Last Updated:** 2026-06-15 17:33:00 -05:00

## Completion Overview

Added Grimmory, Audiobook Server, and Open WebUI to Honore Home. The backend defaults now include the new services, and startup appends missing default services into an existing persisted service list without overwriting user-edited entries. The homepage initial render and icon system now include book, audiobook, and chat fallbacks, with external SVG logo URLs configured for Audiobook Server and Open WebUI. Verification confirmed the running API now returns 9 services, including all three new entries, and the homepage/admin continue to serve successfully with a healthy container.

## Overview

Add three new homelab services to Honore Home: Grimmory at `booklore.abductive.co`, an audiobook server, and Open WebUI at `chat.abductive.co`. Use service logos where practical and provide local icon fallbacks so the cards still look intentional if external logo assets are unavailable.

## Scope

### Included

- Add Grimmory / BookLore service entry.
- Add Audiobook Server service entry.
- Add Open WebUI service entry.
- Add local fallback icons and card color styling for books, audiobooks, and chat.
- Merge new services into an existing persisted service list without overwriting user-edited services.
- Update the running container data so the new services appear immediately.

### Deferred

- Asking for the exact audiobook server URL if it is not discoverable from existing context.
- Downloading and storing third-party logo files locally.
- Adding admin UI controls for creating/deleting services.

## Phases

### Phase 1: Service Data

- [x] Add new service definitions to the backend defaults.
- [x] Add a migration that appends missing default services to persisted data.
- [x] Update client-side initial render defaults.

### Phase 2: Visuals

- [x] Add local fallback icons for book, audiobook, and chat services.
- [x] Add card styling for the new service types.
- [x] Use verified external logo URLs where available.

### Phase 3: Runtime Update and Verification

- [x] Rebuild and run the container.
- [x] Update the current persisted service configuration.
- [x] Verify all three new services appear in the API.
- [x] Verify homepage still serves and container is healthy.
- [x] Add a completion overview and rename this file to `(Complete)`.
