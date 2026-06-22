# Live Service Health and Response Times

**Last Updated:** 2026-06-15 16:54:00 -05:00

## Completion Overview

Replaced manually edited operational status with live server-side monitoring. Honore Home now checks each configured HTTP or HTTPS service URL from inside the container, measures response latency, returns cached health data through the public services API, and refreshes the homepage every 15 seconds while it is visible. The admin portal no longer exposes status or response-time fields, and saves persist only editable service metadata.

## Overview

Replace manually editable service status and response labels with real reachability and latency measurements. While the Honore Home page is open, the browser will request refreshed service health data at a regular interval and update the cards in place.

## Problem

Service status and response time were retained as editable prototype fields when the admin backend was introduced. These values are operational data and should be measured by the application rather than maintained by a person.

## Scope

### Included

- Server-side HTTP reachability checks for every configured service URL.
- Measured request latency in milliseconds.
- Short-lived server-side health-result caching to avoid duplicate checks from multiple open browsers.
- Automatic homepage refresh every 15 seconds while the page is visible.
- Loading/checking, online, and offline states.
- Removal of manual status and response controls from the admin portal and persisted configuration.
- A visible last-checked indicator.

### Deferred

- Historical uptime and latency charts.
- Configurable check intervals and timeouts in the admin portal.
- Notifications and alerting.
- Protocol-specific checks beyond HTTP and HTTPS.

## Implementation Decisions

- Checks run from the Honore Home container rather than the browser to avoid CORS restrictions and to reflect container network reachability.
- Any HTTP response means the target is reachable; connection errors and timeouts mean it is offline.
- Self-signed HTTPS certificates are allowed because this application targets private homelab services.
- Health checks run concurrently with a short timeout and results are cached for approximately 10 seconds.

## Phases

### Phase 1: Backend Health Checks

- [x] Add concurrent HTTP reachability and latency checks.
- [x] Add short-lived cached results to the public services API.
- [x] Remove status and response from persisted service configuration.

### Phase 2: Live Homepage

- [x] Refresh service health automatically while the page is visible.
- [x] Render checking, online, and offline states from measured results.
- [x] Show when health data was last updated.

### Phase 3: Admin Cleanup

- [x] Remove manual status and response fields.
- [x] Explain live monitoring behavior in the admin portal.

### Phase 4: Verification

- [x] Rebuild and run the container.
- [x] Verify reachable and unreachable URL reporting.
- [x] Verify measured latency and refresh behavior.
- [x] Verify admin saves no longer persist operational status fields.
- [x] Add a completion overview and rename this file to `(Complete)`.
