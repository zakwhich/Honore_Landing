# Disable Dev Asset Cache

**Last Updated:** 2026-06-15 17:23:43 -05:00

## Completion Overview

Disabled stale browser asset caching during the current design iteration. The homepage now references versioned CSS, JavaScript, and house-image URLs, and the static file server returns `Cache-Control: no-store, max-age=0` for static files. Verification confirmed the served HTML includes the new versioned CSS URL and that HTML, CSS, and image responses all return no-store cache headers.

## Overview

The browser can keep serving stale CSS and image assets, which makes recent homepage fixes appear unchanged after container rebuilds. Disable aggressive static asset caching during this design iteration and add explicit asset version query strings to the homepage.

## Scope

### Included

- Add version query strings to homepage CSS and JavaScript references.
- Add a version query string to the mockup house image.
- Change static file cache headers to prevent stale assets while iterating.
- Rebuild and verify served headers and versioned references.

### Deferred

- Production immutable asset fingerprinting.
- Build tooling for generated content hashes.

## Phases

### Phase 1: Cache Busting

- [x] Add versioned asset URLs in `index.html`.
- [x] Disable browser caching for static files during development.

### Phase 2: Verification

- [x] Rebuild and run the container.
- [x] Verify served HTML references versioned assets.
- [x] Verify CSS and image responses use no-store cache headers.
- [x] Confirm container health.
- [x] Add a completion overview and rename this file to `(Complete)`.
