const icons = {
  unraid:
    '<path d="M6 13v6" class="unraid-bar-warm" /><path d="M10 9v13" class="unraid-bar-orange" /><path d="M14 12v8" class="unraid-bar-gold" /><path d="M18 7v16" class="unraid-bar-orange" />',
  server:
    '<rect x="3" y="5" width="18" height="6" rx="2"/><rect x="3" y="13" width="18" height="6" rx="2"/><path d="M7 8h.01M7 16h.01M11 8h6M11 16h6"/>',
  home: '<path d="m4 11 8-7 8 7v8a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1v-8Z"/>',
  play: '<path d="m9 7 8 5-8 5V7Z"/><circle cx="12" cy="12" r="9"/>',
  container: '<path d="M4 7h16v12H4zM8 7V4h8v3M4 11h16M8 11v8M16 11v8"/>',
  router:
    '<rect x="3" y="12" width="18" height="7" rx="2"/><path d="M8 12V8m8 4V8M6 16h.01M10 16h.01M12 7c2-2 4-2 6 0M10 5c3-3 7-3 10 0"/>',
  pihole:
    '<circle cx="12" cy="12" r="8"/><path d="M12 4v16M4 12h16M7 7l10 10M17 7 7 17"/><circle cx="12" cy="12" r="2"/>',
  globe:
    '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
  book:
    '<path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19v16H7.5A2.5 2.5 0 0 0 5 21.5v-16Z"/><path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19M8 7h7M8 11h6"/>',
  headphones:
    '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><path d="M4 14h3v6H5a1 1 0 0 1-1-1v-5ZM20 14h-3v6h2a1 1 0 0 0 1-1v-5Z"/><path d="M9 20h6"/>',
  chat:
    '<path d="M4 5h16v11H8l-4 4V5Z"/><path d="M8 9h8M8 12h5"/>',
};

const initialServices = [
  {
    id: "unraid",
    name: "Unraid",
    description: "Storage, backups, and the quiet engine room of home.",
    url: "http://myunraid.local",
    icon: "server",
    logoUrl: "",
    featured: true,
    status: "unknown",
    responseMs: null,
  },
  {
    id: "home-assistant",
    name: "Home Assistant",
    description: "Lights, routines, and home controls",
    url: "http://homeassistant.local:8123",
    icon: "home",
    logoUrl: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/homeassistant.svg",
    featured: false,
    status: "unknown",
    responseMs: null,
  },
  {
    id: "plex",
    name: "Plex",
    description: "Movies, shows, and family media",
    url: "http://plex.local:32400/web",
    icon: "play",
    logoUrl: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/plex.svg",
    featured: false,
    status: "unknown",
    responseMs: null,
  },
  {
    id: "portainer",
    name: "Portainer",
    description: "Container management",
    url: "https://portainer.local",
    icon: "container",
    logoUrl: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/portainer.svg",
    featured: false,
    status: "unknown",
    responseMs: null,
  },
  {
    id: "router",
    name: "Router",
    description: "Network and connection settings",
    url: "http://192.168.1.1",
    icon: "router",
    logoUrl: "",
    featured: false,
    status: "unknown",
    responseMs: null,
  },
  {
    id: "pihole",
    name: "Pi-hole",
    description: "DNS filtering and local network records.",
    url: "http://192.168.86.180:8081/admin/login",
    icon: "pihole",
    logoUrl: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/pihole.svg",
    featured: false,
    status: "unknown",
    responseMs: null,
  },
  {
    id: "personal-site",
    name: "Personal site",
    description: "Our corner of the web.",
    url: "https://example.com",
    icon: "globe",
    logoUrl: "",
    featured: false,
    status: "unknown",
    responseMs: null,
  },
  {
    id: "grimmory",
    name: "Grimmory",
    description: "Ebooks, reading lists, and library shelves.",
    url: "https://booklore.abductive.co",
    icon: "book",
    logoUrl: "",
    featured: false,
    status: "unknown",
    responseMs: null,
  },
  {
    id: "audiobook-server",
    name: "Audiobook Server",
    description: "Audiobooks and narrated library listening.",
    url: "https://audiobookserver.abductive.co",
    icon: "headphones",
    logoUrl: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/audiobookshelf.svg",
    featured: false,
    status: "unknown",
    responseMs: null,
  },
  {
    id: "open-webui",
    name: "Open WebUI",
    description: "Private AI chat for the homelab.",
    url: "https://chat.abductive.co",
    icon: "chat",
    logoUrl: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/openwebui.svg",
    featured: false,
    status: "unknown",
    responseMs: null,
  },
];

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function fallbackIcon(iconName) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = icons[iconName] || icons.globe;
  return svg;
}

function serviceLogo(service, light = false) {
  const iconName = service.id === "unraid" ? "unraid" : service.icon;
  const hasLogo = Boolean(service.logoUrl);
  const wrapper = element(
    "span",
    `card-icon card-icon-${iconName || "globe"} service-${service.id || "generic"}${hasLogo ? " has-service-logo" : ""}${light ? " card-icon-light" : ""}`
  );
  if (!hasLogo) {
    wrapper.append(fallbackIcon(iconName));
    return wrapper;
  }

  const image = element("img", "service-logo");
  image.src = service.logoUrl;
  image.alt = "";
  image.referrerPolicy = "no-referrer";
  image.addEventListener("error", () => image.replaceWith(fallbackIcon(iconName)), { once: true });
  wrapper.append(image);
  return wrapper;
}

function statusDot(status) {
  const dot = element("span", `status-dot ${status}`);
  dot.title = status.charAt(0).toUpperCase() + status.slice(1);
  return dot;
}

function responseLabel(service) {
  return service.responseMs === null || service.responseMs === undefined
    ? "Checking"
    : `${service.responseMs} ms`;
}

function statusLabel(status) {
  if (status === "online") return "All systems normal";
  if (status === "degraded") return "Degraded performance";
  if (status === "offline") return "Offline";
  return "Checking";
}

function linkUrl(value) {
  if (!value) return "#";
  if (/^https?:\/\//i.test(value)) return value;
  return `http://${value}`;
}

function serviceCard(service) {
  const card = element("a", "service-card");
  card.href = linkUrl(service.url);
  card.target = "_blank";
  card.rel = "noopener noreferrer";
  card.setAttribute("aria-label", `Open ${service.name}`);
  card.append(serviceLogo(service));

  const content = element("span", "service-content");
  const heading = element("span", "service-heading");
  heading.append(element("strong", "", service.name));
  content.append(heading);
  content.append(element("span", "service-description", service.description));
  const meta = element("span", "service-meta");
  const status = element("span", "service-status");
  status.append(statusDot(service.status), document.createTextNode(statusLabel(service.status)));
  meta.append(status, element("span", "response", responseLabel(service)));
  content.append(meta);
  card.append(content);

  const arrowButton = element("span", "card-arrow");
  arrowButton.append(fallbackIcon("globe"));
  arrowButton.querySelector("svg").innerHTML = '<path d="m9 18 6-6-6-6"/>';
  card.append(arrowButton);
  return card;
}

function renderFeatured(service) {
  const card = document.querySelector("#featured-card");
  card.replaceChildren();

  const topline = element("div", "featured-topline");
  topline.append(serviceLogo(service, true));
  const link = element("a", "featured-arrow");
  link.href = linkUrl(service.url);
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.setAttribute("aria-label", `Open ${service.name}`);
  const arrow = fallbackIcon("globe");
  arrow.innerHTML = '<path d="m9 18 6-6-6-6"/>';
  link.append(arrow);
  topline.append(link);

  const copy = element("div", "featured-copy");
  copy.append(element("h2", "", service.name));
  copy.append(element("p", "", service.description));

  const footer = element("div", "featured-footer");
  const status = element("span", "featured-status");
  status.append(statusDot(service.status), document.createTextNode(statusLabel(service.status)));
  const response = element("span", "featured-response", responseLabel(service));
  footer.append(status, response);
  card.append(topline, copy, footer);
}

function renderServices(services) {
  if (!Array.isArray(services) || services.length === 0) return;
  const featured = services.find((service) => service.featured) || services[0];
  const regular = services.filter((service) => service !== featured);
  renderFeatured(featured);
  document.querySelector("#service-grid").replaceChildren(...regular.map(serviceCard));

  const checked = services.some((service) => service.checkedAt);
  const online = services.filter((service) => service.status === "online").length;
  document.querySelector("#online-count").textContent = checked ? `${online} of ${services.length} services online` : "";
  const overall = document.querySelector("#overall-status");
  const status = !checked ? "unknown" : online === services.length ? "online" : online === 0 ? "offline" : "degraded";
  overall.replaceChildren(statusDot(status), document.createTextNode(
    status === "online" ? "All systems normal" : status === "offline" ? "Services unavailable" : status === "unknown" ? "Checking services" : "Some services need attention"
  ));

  const checkedAt = services.find((service) => service.checkedAt)?.checkedAt;
  if (checkedAt) {
    const time = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit" }).format(
      new Date(checkedAt)
    );
    document.querySelector("#last-checked").textContent = `Checked at ${time}`;
  } else {
    document.querySelector("#last-checked").textContent = "";
  }
}

function showLoadError() {
  document.querySelector("#online-count").textContent = "Service data unavailable";
  document.querySelector("#featured-card").classList.add("load-error");
  document.querySelector("#featured-card").textContent = "Could not load services. Check that Honore Home is running.";
}

function updateGreeting() {
  const now = new Date();
  const hour = now.getHours();
  const period = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";
  const date = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(now);
  document.querySelector("#greeting").innerHTML = `Good ${period},<br />Honore family`;
  document.querySelector("#current-date").textContent = date;
}

async function loadServices() {
  if (document.hidden || loadServices.loading) return;
  loadServices.loading = true;
  try {
    const response = await fetch("/api/services", { cache: "no-store" });
    if (!response.ok) throw new Error("Unable to load services");
    renderServices(await response.json());
  } catch {
    showLoadError();
  } finally {
    loadServices.loading = false;
  }
}

updateGreeting();
renderServices(initialServices);
loadServices();
setInterval(loadServices, 15_000);
document.addEventListener("visibilitychange", loadServices);
