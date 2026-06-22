Last Updated: 2026-06-15 21:23:30 -05:00

# Preserve Custom Service Logos

## Completion Overview

Updated the homepage renderer so every service with a saved `logoUrl` displays that linked image, including Unraid. Added a neutral logo tile treatment for real images and removed CSS filters that recolored linked logos. Bumped the homepage asset version so browsers fetch the updated JavaScript and CSS.

## Overview

The homepage should display the logo URL saved in the admin portal whenever a service has one. Built-in SVG icons should only be used as fallbacks when no logo URL exists or an image fails to load.

## Scope

- Fix homepage rendering so service-specific logo URLs are not ignored.
- Preserve fallback icons for services without logos or failed image loads.
- Avoid recoloring user-provided logo images in a way that makes them look unlike the linked source.
- Keep the admin portal persistence path unchanged unless investigation shows it is losing logo URLs.

## Phase 1: Trace Current Behavior

- [x] Review homepage service logo rendering.
- [x] Review admin logo input and save behavior.
- [x] Review server service validation and persistence behavior.

## Phase 2: Implement Fix

- [x] Use custom logo URLs for all services, including Unraid.
- [x] Keep Unraid-specific fallback styling when no logo is configured.
- [x] Remove broad CSS filters from externally loaded logo images.

## Phase 3: Verify

- [x] Run a syntax/behavior smoke check where practical.
- [x] Update this note with completion summary and rename to Complete.

Verification note: `node --check` and Python launcher checks were not available in this shell. Verified the changed render path, CSS logo treatment, and asset version references directly from source.
