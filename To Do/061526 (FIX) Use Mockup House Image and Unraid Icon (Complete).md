# Use Mockup House Image and Unraid Icon

**Last Updated:** 2026-06-15 17:11:59 -05:00

## Completion Overview

Replaced the custom SVG house illustration with a cropped raster asset from the generated mockup at `assets/mockup-house.png`. Updated Docker packaging so the asset is served by the container. Fixed the Unraid featured icon path by forcing Unraid to use a local orange/yellow bar mark instead of depending on external logo loading or inherited green icon styling. Verification confirmed the homepage references the mockup house image, the image route returns `200`, live health data still loads, and the container is healthy.

## Overview

Replace the poor native SVG house recreation with the actual house artwork from the generated mockup. Also fix the featured Unraid card so the icon area is not a flat green block and shows a recognizable Unraid-style mark even when external logo loading is unavailable.

## Scope

### Included

- Locate the generated mockup image asset.
- Crop the house illustration area into a project-local image asset.
- Replace the homepage SVG house with the cropped raster image.
- Fix Unraid featured-card icon rendering and fallback styling.
- Preserve service links, live health checks, and admin configuration.

### Deferred

- Pixel-perfect responsive browser-frame reproduction.
- Reworking the admin portal visual design.
- Logo uploads.

## Phases

### Phase 1: Asset Extraction

- [x] Identify the best generated mockup source image.
- [x] Crop the house illustration into `assets/`.
- [x] Verify the resulting image dimensions and visual contents.

### Phase 2: Homepage Replacement

- [x] Replace inline house SVG markup with the cropped image.
- [x] Update CSS to display the raster house cleanly.
- [x] Remove obsolete SVG illustration styles.

### Phase 3: Unraid Icon Fix

- [x] Diagnose why the Unraid card appears as a flat green icon.
- [x] Add a reliable local Unraid-style fallback mark.
- [x] Adjust CSS filters so the featured icon is not flattened incorrectly.

### Phase 4: Verification

- [x] Rebuild and run the container.
- [x] Verify the house image is served.
- [x] Verify the Unraid icon area is no longer a flat green block.
- [x] Verify homepage health data still loads.
- [x] Add a completion overview and rename this file to `(Complete)`.
