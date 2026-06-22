# Reference Style Homepage Redesign

**Last Updated:** 2026-06-15 17:05:44 -05:00

## Completion Overview

Redesigned the homepage toward the provided reference image. The page now uses a larger editorial hero, a status pill near the greeting, a larger warm house illustration, a wide featured Unraid-style service card, softer ivory service cards with large app tiles, and a mobile layout closer to the stacked phone reference. The live service health data, admin-managed URLs, and Docker deployment remain intact.

## Overview

Redesign the Honore Home homepage to more closely match the provided reference image. The current app is functional, but the visual hierarchy and house illustration are not close enough to the desired direction. This pass should make the page feel like a warm desktop/mobile home dashboard with a large editorial greeting, a prominent illustrated house scene, a full-width featured Unraid card, and soft service cards below.

## Scope

### Included

- Rework the homepage layout to match the reference more closely.
- Enlarge and refine the house illustration.
- Move the status pill into the hero text area.
- Make the featured service card full-width and horizontally composed.
- Restyle service cards with larger icons, serif names, clear status and latency rows, and arrow buttons.
- Improve mobile layout to match the stacked phone reference.
- Preserve admin editing, live health checks, and configured service links.

### Deferred

- Pixel-perfect reproduction of the mockup browser chrome.
- Reworking the admin portal visual design.
- Replacing the native SVG illustration with a generated raster asset.

## Phases

### Phase 1: Structure

- [x] Adjust homepage markup for the reference layout.
- [x] Update service rendering structure for featured and standard cards.

### Phase 2: Visual System

- [x] Redesign hero typography, status pill, and house scene.
- [x] Redesign featured card to be wide and prominent.
- [x] Redesign service grid and mobile service list.

### Phase 3: Verification

- [x] Rebuild and run the container.
- [x] Verify homepage serves successfully.
- [x] Verify live health data and service links still work.
- [x] Confirm container health.
- [x] Add a completion overview and rename this file to `(Complete)`.
