# Service Admin Portal and Logos

**Last Updated:** 2026-06-15 16:49:09 -05:00

## Completion Overview

Implemented a persistent service directory and protected admin portal for Honore Home. The homepage now loads its featured and standard services from the backend, opens configured destinations, and displays configurable service logos with local icon fallbacks. The admin portal supports authenticated editing with the initial `admin` / `admin` credentials, and Docker now preserves configuration in a named volume. Verification confirmed authentication protection, successful updates, persistence across a container restart, homepage availability, and a healthy container.

## Overview

Add recognizable logos to the Honore Home service cards and create a protected admin portal where the displayed services and their destination URLs can be maintained without editing source files. Configuration must persist across container restarts and remain easy to deploy through Portainer.

## Scope

### Included

- Server-side login for the admin portal using the initial credentials `admin` / `admin`.
- A dedicated admin page for editing service names, descriptions, URLs, logo URLs, status labels, response text, and featured placement.
- Persistent JSON-backed service configuration stored in a Docker volume.
- A public API that supplies the homepage service configuration.
- Configurable service logos with graceful local icon fallbacks.
- Updated Docker and Portainer configuration.

### Deferred

- Multi-user accounts and role management.
- Password changes through the admin interface.
- Automated service health checks.
- Logo file uploads.
- Adding and deleting services through the admin interface.

## Security and Implementation Decisions

- Credentials are checked only by the server and are configurable through container environment variables.
- The default `admin` / `admin` credentials are provided for initial local testing only and must be changed before exposing the portal beyond the trusted home network.
- Authentication uses an HTTP-only same-site session cookie.
- Only valid `http://` and `https://` service and logo URLs will be accepted.
- The application will use Python's standard library to avoid adding a package-management layer solely for the small API.

## Phases

### Phase 1: Backend Foundation

- [x] Add a small static-file and JSON API server.
- [x] Seed and persist service configuration in a mounted data directory.
- [x] Add login, logout, session validation, and protected update endpoints.

### Phase 2: Homepage Integration

- [x] Load featured and standard service cards from the public API.
- [x] Use configured links for all service cards.
- [x] Display configured logos with graceful icon fallbacks.

### Phase 3: Admin Portal

- [x] Build the admin login experience.
- [x] Build the responsive service configuration form.
- [x] Add save feedback, validation feedback, and logout.

### Phase 4: Deployment and Verification

- [x] Update Docker and Compose configuration for the backend and persistent data.
- [x] Update deployment and credential documentation.
- [x] Build and run the container.
- [x] Verify login protection, configuration updates, persistence, and homepage links.
- [x] Add a completion overview and rename this file to `(Complete)`.
