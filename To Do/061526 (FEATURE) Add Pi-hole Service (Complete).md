# Add Pi-hole Service

**Last Updated:** 2026-06-15 21:01:51 -05:00

## Completion Overview

Added Pi-hole to Honore Home with the login URL `http://192.168.86.180:8081/admin/login`. The backend defaults now include Pi-hole, the existing persisted service list is automatically merged, and the client-side initial render includes a Pi-hole card with a local fallback icon and matching styling. The frontend asset version was bumped so browsers fetch the updated service list code. Verification confirmed `/api/services` now returns 10 services including Pi-hole with the exact requested URL, and the homepage/admin continue to serve with a healthy container.

## Overview

Add Pi-hole to the Honore Home service list with the admin login URL `http://192.168.86.180:8081/admin/login`. The entry should be included in defaults, appended into existing persisted data, and rendered immediately on the homepage with a local icon fallback.

## Scope

### Included

- Add Pi-hole to backend default services.
- Add Pi-hole to client-side initial service render.
- Add a local Pi-hole-style icon fallback.
- Add card color styling for Pi-hole.
- Bump frontend asset version.
- Rebuild and verify the running API includes Pi-hole.

### Deferred

- Adding create/delete controls to the admin UI.
- Changing DNS records or Pi-hole configuration.

## Phases

### Phase 1: Service Data

- [x] Add Pi-hole backend default service.
- [x] Add Pi-hole client-side initial service.
- [x] Ensure existing persisted configs receive the missing service.

### Phase 2: Visuals

- [x] Add local Pi-hole fallback icon.
- [x] Add Pi-hole card styling.
- [x] Bump CSS/JS asset versions.

### Phase 3: Verification

- [x] Rebuild and run the container.
- [x] Verify Pi-hole appears in `/api/services`.
- [x] Verify homepage/admin still serve.
- [x] Confirm container health.
- [x] Add a completion overview and rename this file to `(Complete)`.
