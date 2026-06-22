# Honore Home

A warm, responsive landing page for the Honore home network.

This version includes a persistent service directory, live service monitoring, and a protected admin portal so destinations and logos can be updated without editing source files.

## Test Without Docker

Open `index.html` in a browser.

## Test With Docker

Build and start the site:

```powershell
docker compose up --build -d
```

Then open `http://localhost:8080`.

The admin portal is available at `http://localhost:8080/admin.html`.

Initial test credentials:

```text
Username: admin
Password: admin
```

Change `HONORE_ADMIN_USERNAME` and `HONORE_ADMIN_PASSWORD` in `compose.yaml` before exposing the portal beyond a trusted home network.

Stop the site:

```powershell
docker compose down
```

## Portainer

Deploy `compose.yaml` as a Portainer stack from this Git repository. The page is exposed on port `8080` by default. Change the left side of `"8080:8080"` if another host port is preferred.

Service configuration is stored in the named `honore-data` volume and persists across container rebuilds.

## Current Limitations

- Service health and response times are checked from the Honore Home container and refresh every 15 seconds while the homepage is visible.
- A service is considered online when its configured HTTP or HTTPS URL returns any HTTP response.
- The admin portal edits existing services but does not add or delete them yet.
