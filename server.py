import hmac
import json
import mimetypes
import os
import secrets
import ssl
import threading
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parent
DATA_DIR = Path(os.environ.get("HONORE_DATA_DIR", ROOT / "data"))
SERVICES_FILE = DATA_DIR / "services.json"
ADMIN_USERNAME = os.environ.get("HONORE_ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.environ.get("HONORE_ADMIN_PASSWORD", "admin")
SESSION_TTL = 12 * 60 * 60
MAX_BODY_SIZE = 256 * 1024
HEALTH_CACHE_TTL = 10
HEALTH_TIMEOUT = 3
SESSIONS = {}
SESSION_LOCK = threading.Lock()
HEALTH_CACHE = {"expires": 0, "services": []}
HEALTH_LOCK = threading.Lock()
HEALTH_REFRESHING = False
SSL_CONTEXT = ssl.create_default_context()
SSL_CONTEXT.check_hostname = False
SSL_CONTEXT.verify_mode = ssl.CERT_NONE

DEFAULT_SERVICES = [
    {
        "id": "unraid",
        "name": "Unraid",
        "description": "Storage, backups, and the quiet engine room of home.",
        "url": "http://myunraid.local",
        "logoUrl": "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/unraid.svg",
        "icon": "server",
        "featured": True,
    },
    {
        "id": "home-assistant",
        "name": "Home Assistant",
        "description": "Lights, routines, and home controls",
        "url": "http://homeassistant.local:8123",
        "logoUrl": "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/homeassistant.svg",
        "icon": "home",
        "featured": False,
    },
    {
        "id": "plex",
        "name": "Plex",
        "description": "Movies, shows, and family media",
        "url": "http://plex.local:32400/web",
        "logoUrl": "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/plex.svg",
        "icon": "play",
        "featured": False,
    },
    {
        "id": "portainer",
        "name": "Portainer",
        "description": "Container management",
        "url": "https://portainer.local",
        "logoUrl": "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/portainer.svg",
        "icon": "container",
        "featured": False,
    },
    {
        "id": "router",
        "name": "Router",
        "description": "Network and connection settings",
        "url": "http://192.168.1.1",
        "logoUrl": "",
        "icon": "router",
        "featured": False,
    },
    {
        "id": "pihole",
        "name": "Pi-hole",
        "description": "DNS filtering and local network records.",
        "url": "http://192.168.86.180:8081/admin/login",
        "logoUrl": "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/pihole.svg",
        "icon": "pihole",
        "featured": False,
    },
    {
        "id": "personal-site",
        "name": "Personal site",
        "description": "A little slower than usual",
        "url": "https://example.com",
        "logoUrl": "",
        "icon": "globe",
        "featured": False,
    },
    {
        "id": "grimmory",
        "name": "Grimmory",
        "description": "Ebooks, reading lists, and library shelves.",
        "url": "https://booklore.abductive.co",
        "logoUrl": "",
        "icon": "book",
        "featured": False,
    },
    {
        "id": "audiobook-server",
        "name": "Audiobook Server",
        "description": "Audiobooks and narrated library listening.",
        "url": "https://audiobookserver.abductive.co",
        "logoUrl": "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/audiobookshelf.svg",
        "icon": "headphones",
        "featured": False,
    },
    {
        "id": "open-webui",
        "name": "Open WebUI",
        "description": "Private AI chat for the homelab.",
        "url": "https://chat.abductive.co",
        "logoUrl": "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/openwebui.svg",
        "icon": "chat",
        "featured": False,
    },
]


def ensure_data_file():
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if not SERVICES_FILE.exists():
        save_services(DEFAULT_SERVICES)
        return
    try:
        with SERVICES_FILE.open("r", encoding="utf-8") as file:
            existing = json.load(file)
        if isinstance(existing, list):
            return
    except (OSError, json.JSONDecodeError):
        save_services(DEFAULT_SERVICES)


def load_services():
    ensure_data_file()
    try:
        with SERVICES_FILE.open("r", encoding="utf-8") as file:
            services = json.load(file)
        if isinstance(services, list):
            return [stored_service(service) for service in services]
    except (OSError, json.JSONDecodeError):
        pass
    return DEFAULT_SERVICES


def stored_service(service):
    return {
        "id": str(service.get("id", "")).strip()[:80],
        "name": str(service.get("name", "")).strip()[:80],
        "description": str(service.get("description", "")).strip()[:180],
        "url": str(service.get("url", "")).strip()[:2048],
        "logoUrl": str(service.get("logoUrl", "")).strip()[:2048],
        "icon": str(service.get("icon", "globe")).strip()[:40],
        "featured": bool(service.get("featured", False)),
    }


def save_services(services):
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    temporary_file = SERVICES_FILE.with_suffix(".tmp")
    with temporary_file.open("w", encoding="utf-8") as file:
        json.dump(services, file, indent=2)
        file.write("\n")
    temporary_file.replace(SERVICES_FILE)


def valid_web_url(value, allow_empty=False):
    if allow_empty and value == "":
        return True
    try:
        parsed = urlparse(value)
        return parsed.scheme in {"http", "https"} and bool(parsed.netloc)
    except ValueError:
        return False


def normalize_web_url(value, allow_empty=False):
    value = str(value or "").strip()
    if allow_empty and value == "":
        return ""
    parsed = urlparse(value)
    if parsed.scheme == "" and value:
        value = f"http://{value}"
        parsed = urlparse(value)
    if parsed.scheme not in {"http", "https"} or not parsed.netloc:
        return value
    return value


def validate_services(payload):
    if not isinstance(payload, list) or not payload:
        raise ValueError("At least one service is required.")
    if len(payload) > 50:
        raise ValueError("No more than 50 services are allowed.")

    cleaned = []
    featured_count = 0
    for index, service in enumerate(payload):
        if not isinstance(service, dict):
            raise ValueError(f"Service {index + 1} is invalid.")

        item = stored_service(service)

        if not item["id"] or not item["name"]:
            raise ValueError(f"Service {index + 1} requires an ID and name.")
        item["url"] = normalize_web_url(item["url"])
        item["logoUrl"] = normalize_web_url(item["logoUrl"], allow_empty=True)

        if not valid_web_url(item["url"]):
            raise ValueError(f"{item['name']} requires a valid http:// or https:// URL.")
        if not valid_web_url(item["logoUrl"], allow_empty=True):
            raise ValueError(f"{item['name']} has an invalid logo URL.")
        if item["featured"]:
            featured_count += 1
        cleaned.append(item)

    if featured_count > 1:
        raise ValueError("Only one service can be featured.")
    return cleaned


def check_service(service):
    checked_at = datetime.now(timezone.utc).isoformat()
    started = time.perf_counter()
    request = urllib.request.Request(
        service["url"],
        method="HEAD",
        headers={"User-Agent": "Honore-Home-Healthcheck/1.0"},
    )
    try:
        with urllib.request.urlopen(request, timeout=HEALTH_TIMEOUT, context=SSL_CONTEXT) as response:
            response.read(1)
        status = "online"
    except urllib.error.HTTPError:
        status = "online"
    except (urllib.error.URLError, TimeoutError, OSError, ValueError):
        return {**service, "status": "offline", "responseMs": None, "checkedAt": checked_at}

    elapsed_ms = max(1, round((time.perf_counter() - started) * 1000))
    return {**service, "status": status, "responseMs": elapsed_ms, "checkedAt": checked_at}


def services_with_health(force=False):
    global HEALTH_REFRESHING
    now = time.time()
    with HEALTH_LOCK:
        if not force and HEALTH_CACHE["expires"] > now:
            return HEALTH_CACHE["services"]

        services = HEALTH_CACHE["services"] or [
            {**service, "status": "unknown", "responseMs": None, "checkedAt": None}
            for service in load_services()
        ]
        if not HEALTH_REFRESHING:
            HEALTH_REFRESHING = True
            threading.Thread(target=refresh_health_cache, daemon=True).start()
        return services


def refresh_health_cache():
    global HEALTH_REFRESHING
    services = load_services()
    try:
        with ThreadPoolExecutor(max_workers=min(len(services), 12)) as executor:
            checked = list(executor.map(check_service, services))
        with HEALTH_LOCK:
            HEALTH_CACHE["services"] = checked
            HEALTH_CACHE["expires"] = time.time() + HEALTH_CACHE_TTL
            HEALTH_REFRESHING = False
    except Exception:
        with HEALTH_LOCK:
            HEALTH_REFRESHING = False


class HonoreHandler(BaseHTTPRequestHandler):
    server_version = "HonoreHome/1.0"

    def do_GET(self):
        path = urlparse(self.path).path
        if path == "/api/services":
            return self.send_json(services_with_health())
        if path == "/api/admin/session":
            return self.send_json({"authenticated": self.is_authenticated()})
        if path == "/api/health":
            return self.send_json({"status": "ok"})
        return self.serve_static(path)

    def do_POST(self):
        path = urlparse(self.path).path
        if path == "/api/admin/login":
            return self.login()
        if path == "/api/admin/logout":
            return self.logout()
        if path == "/api/admin/services":
            return self.update_services()
        self.send_error(HTTPStatus.NOT_FOUND)

    def login(self):
        payload = self.read_json()
        if payload is None:
            return
        username = str(payload.get("username", ""))
        password = str(payload.get("password", ""))
        username_ok = hmac.compare_digest(username, ADMIN_USERNAME)
        password_ok = hmac.compare_digest(password, ADMIN_PASSWORD)
        if not (username_ok and password_ok):
            return self.send_json({"error": "Invalid username or password."}, HTTPStatus.UNAUTHORIZED)

        token = secrets.token_urlsafe(32)
        with SESSION_LOCK:
            SESSIONS[token] = time.time() + SESSION_TTL
        headers = {"Set-Cookie": f"honore_session={token}; HttpOnly; SameSite=Strict; Path=/; Max-Age={SESSION_TTL}"}
        self.send_json({"authenticated": True}, headers=headers)

    def logout(self):
        token = self.session_token()
        if token:
            with SESSION_LOCK:
                SESSIONS.pop(token, None)
        headers = {"Set-Cookie": "honore_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0"}
        self.send_json({"authenticated": False}, headers=headers)

    def update_services(self):
        if not self.is_authenticated():
            return self.send_json({"error": "Authentication required."}, HTTPStatus.UNAUTHORIZED)
        payload = self.read_json()
        if payload is None:
            return
        try:
            services = validate_services(payload.get("services"))
            save_services(services)
            with HEALTH_LOCK:
                HEALTH_CACHE["expires"] = 0
        except (ValueError, OSError) as error:
            return self.send_json({"error": str(error)}, HTTPStatus.BAD_REQUEST)
        self.send_json({"services": services})

    def read_json(self):
        try:
            length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            length = 0
        if length <= 0 or length > MAX_BODY_SIZE:
            self.send_json({"error": "Invalid request body."}, HTTPStatus.BAD_REQUEST)
            return None
        try:
            return json.loads(self.rfile.read(length))
        except (UnicodeDecodeError, json.JSONDecodeError):
            self.send_json({"error": "Invalid JSON."}, HTTPStatus.BAD_REQUEST)
            return None

    def session_token(self):
        cookies = self.headers.get("Cookie", "").split(";")
        for cookie in cookies:
            key, _, value = cookie.strip().partition("=")
            if key == "honore_session":
                return value
        return ""

    def is_authenticated(self):
        token = self.session_token()
        if not token:
            return False
        with SESSION_LOCK:
            expires = SESSIONS.get(token, 0)
            if expires < time.time():
                SESSIONS.pop(token, None)
                return False
            SESSIONS[token] = time.time() + SESSION_TTL
        return True

    def serve_static(self, path):
        if path == "/":
            path = "/index.html"
        requested = (ROOT / path.lstrip("/")).resolve()
        if ROOT not in requested.parents or not requested.is_file():
            self.send_error(HTTPStatus.NOT_FOUND)
            return
        content_type, _ = mimetypes.guess_type(requested.name)
        try:
            content = requested.read_bytes()
        except OSError:
            self.send_error(HTTPStatus.NOT_FOUND)
            return
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", content_type or "application/octet-stream")
        self.send_header("Content-Length", str(len(content)))
        self.send_header("Cache-Control", "no-store, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("X-Frame-Options", "DENY")
        self.end_headers()
        self.wfile.write(content)

    def send_json(self, payload, status=HTTPStatus.OK, headers=None):
        content = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(content)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        for key, value in (headers or {}).items():
            self.send_header(key, value)
        self.end_headers()
        self.wfile.write(content)

    def log_message(self, format_string, *args):
        print(f"{self.address_string()} - {format_string % args}")


if __name__ == "__main__":
    ensure_data_file()
    port = int(os.environ.get("PORT", "8080"))
    server = ThreadingHTTPServer(("0.0.0.0", port), HonoreHandler)
    print(f"Honore Home listening on port {port}")
    server.serve_forever()
