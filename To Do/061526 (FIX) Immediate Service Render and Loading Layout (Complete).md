# Immediate Service Render and Loading Layout

**Last Updated:** 2026-06-15 17:20:10 -05:00

## Completion Overview

Fixed the broken first-load layout by rendering configured service cards immediately with a checking state before live health data arrives. The backend services API now returns cached or checking service metadata immediately and refreshes health checks in the background, avoiding a blank featured card while homelab DNS or offline services are being probed. The stray loading summary text was minimized, the hero sizing was reduced, and the featured card no longer appears as an empty green block on first load.

## Overview

Fix the broken first-load visual state shown in the screenshot. The homepage currently waits for live health checks before rendering service content, which leaves the featured card as a large empty green block and exposes loading text in the layout. Services should render immediately with configured metadata and a checking state, then update when live health data returns.

## Scope

### Included

- Render a useful initial service layout immediately on page load.
- Avoid a blank featured Unraid card while health checks are pending.
- Hide or restyle loading metadata so it does not look like stray page text.
- Keep live health refresh behavior.
- Reduce oversized hero/card spacing where it contributes to the broken appearance.

### Deferred

- Reworking the admin portal visual design.
- Replacing the full mockup layout pixel-for-pixel.
- Adding a separate screenshot testing workflow.

## Phases

### Phase 1: Initial Render

- [x] Add client-side initial service data for immediate rendering.
- [x] Render checking states before the API response arrives.
- [x] Keep API-provided configuration and health data authoritative once loaded.

### Phase 2: Layout Cleanup

- [x] Hide or minimize raw loading summary text.
- [x] Reduce the featured card empty-state footprint.
- [x] Tune hero sizing to avoid the oversized blown-out screenshot appearance.

### Phase 3: Verification

- [x] Rebuild and run the container.
- [x] Verify homepage has populated cards immediately.
- [x] Verify live health data still replaces checking states.
- [x] Confirm container health.
- [x] Add a completion overview and rename this file to `(Complete)`.
