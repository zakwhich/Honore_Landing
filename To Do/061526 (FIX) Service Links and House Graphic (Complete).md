# Service Links and House Graphic

**Last Updated:** 2026-06-15 16:57:30 -05:00

## Completion Overview

Fixed service links by normalizing bare homelab addresses to absolute `http://` URLs during admin saves and defensively before rendering homepage anchors. Added a responsive native SVG house/network illustration to the hero area, preserving the warm visual direction from the mockup. Verification confirmed a bare `192.168.1.1` admin entry saves as `http://192.168.1.1`, the homepage serves the new graphic, and the container remains healthy.

## Overview

Fix service cards so they reliably open the destination configured in the admin portal, including common homelab URLs entered without an explicit scheme. Also recreate the warm house/network illustration from the mockup as a native SVG graphic in the homepage hero.

## Scope

### Included

- Normalize bare service URLs such as `192.168.1.1`, `myserver.local`, and `host.local:8123` to `http://...`.
- Keep accepting explicit `http://` and `https://` URLs.
- Reject unsupported schemes.
- Defensively normalize rendered homepage links.
- Add a responsive house/network SVG graphic that matches the warm visual direction.
- Preserve the live health-check behavior.

### Deferred

- Custom protocol support.
- Uploadable image assets.
- Per-service protocol preferences.

## Phases

### Phase 1: URL Fix

- [x] Add backend URL normalization for service and logo URLs.
- [x] Normalize links defensively in the frontend.
- [x] Update admin helper text so expected URL formats are clear.

### Phase 2: House Graphic

- [x] Add the house/network SVG to the hero area.
- [x] Style the graphic for desktop and mobile.
- [x] Keep the existing status summary readable and accessible.

### Phase 3: Verification

- [x] Rebuild and run the container.
- [x] Verify bare host/IP service URLs become absolute links.
- [x] Verify the homepage still loads live health data.
- [x] Verify the graphic renders and the container remains healthy.
- [x] Add a completion overview and rename this file to `(Complete)`.
