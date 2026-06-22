let services = [];
let saveResetTimer = 0;

const loginPanel = document.querySelector("#login-panel");
const workspace = document.querySelector("#admin-workspace");
const serviceList = document.querySelector("#admin-service-list");
const loginMessage = document.querySelector("#login-message");
const saveMessage = document.querySelector("#save-message");
const saveButton = document.querySelector("#save-button");

function setMessage(node, message, type = "") {
  node.textContent = message;
  node.className = `form-message ${type}`.trim();
}

function setSaveState(state) {
  window.clearTimeout(saveResetTimer);
  saveButton.classList.remove("saving", "saved", "failed");
  saveButton.disabled = state === "saving";
  if (state === "idle") {
    saveButton.textContent = "Save changes";
    return;
  }
  saveButton.classList.add(state);
  saveButton.textContent = state === "saving" ? "Saving..." : state === "saved" ? "Saved" : "Save failed";
  if (state === "saved" || state === "failed") {
    saveResetTimer = window.setTimeout(() => setSaveState("idle"), 1800);
  }
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || "Something went wrong.");
  return payload;
}

function inputField(labelText, name, value, type = "text", wide = false) {
  const label = document.createElement("label");
  if (wide) label.classList.add("wide");
  label.textContent = labelText;
  const input = document.createElement("input");
  input.name = name;
  input.type = type;
  input.value = value || "";
  input.required = name === "name" || name === "url";
  if (name === "url") input.placeholder = "http://192.168.1.1 or myserver.local:8123";
  if (name === "logoUrl") input.placeholder = "https://example.com/logo.svg";
  label.append(input);
  return label;
}

function serviceIdFromName(name) {
  const slug = String(name || "new-service")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 56);
  return `${slug || "new-service"}-${Date.now().toString(36)}`;
}

function newService() {
  return {
    id: serviceIdFromName("new-service"),
    name: "New Service",
    description: "",
    url: "http://",
    logoUrl: "",
    icon: "globe",
    featured: services.length === 0,
  };
}

function serviceEditor(service, index) {
  const card = document.createElement("article");
  card.className = "admin-service-card";
  card.dataset.index = index;

  const header = document.createElement("div");
  header.className = "admin-service-header";

  const preview = document.createElement("div");
  preview.className = "admin-logo-preview";
  const image = document.createElement("img");
  image.src = service.logoUrl || "/favicon.ico";
  image.alt = "";
  image.addEventListener("error", () => {
    image.style.display = "none";
  });
  preview.append(image);

  const summary = document.createElement("div");
  summary.className = "admin-service-summary";
  summary.append(document.createElement("strong"), document.createElement("span"));
  summary.querySelector("strong").textContent = service.name || "Untitled service";
  summary.querySelector("span").textContent = service.url || "No URL yet";

  const removeButton = document.createElement("button");
  removeButton.className = "danger-button";
  removeButton.type = "button";
  removeButton.textContent = "Remove";
  removeButton.disabled = services.length <= 1;
  removeButton.addEventListener("click", () => {
    if (services.length <= 1) {
      setMessage(saveMessage, "At least one service is required.", "error");
      return;
    }
    const draft = collectServices();
    draft.splice(index, 1);
    if (draft.length > 0 && !draft.some((item) => item.featured)) {
      draft[0].featured = true;
    }
    services = draft;
    renderEditors();
    setMessage(saveMessage, "Service removed. Save changes to make it permanent.");
  });

  header.append(preview, summary, removeButton);

  const fields = document.createElement("div");
  fields.className = "admin-fields";
  const nameField = inputField("Name", "name", service.name, "text");
  nameField.querySelector("input").addEventListener("input", (event) => {
    summary.querySelector("strong").textContent = event.target.value || "Untitled service";
  });
  fields.append(nameField);
  fields.append(inputField("Description", "description", service.description, "text"));
  fields.append(inputField("Destination URL", "url", service.url, "url", true));
  fields.querySelector('[name="url"]').addEventListener("input", (event) => {
    summary.querySelector("span").textContent = event.target.value || "No URL yet";
  });
  const logoField = inputField("Logo URL (optional)", "logoUrl", service.logoUrl, "url", true);
  logoField.querySelector("input").addEventListener("input", (event) => {
    image.style.display = "";
    image.src = event.target.value || "/favicon.ico";
  });
  fields.append(logoField);

  const featuredLabel = document.createElement("label");
  featuredLabel.className = "checkbox-label";
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.name = "featured";
  checkbox.checked = service.featured;
  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      document.querySelectorAll('[name="featured"]').forEach((other) => {
        if (other !== checkbox) other.checked = false;
      });
    }
  });
  featuredLabel.append(checkbox, document.createTextNode("Featured service"));
  fields.append(featuredLabel);

  card.append(header, fields);
  return card;
}

function renderEditors() {
  serviceList.replaceChildren(...services.map(serviceEditor));
}

function collectServices() {
  return [...document.querySelectorAll(".admin-service-card")].map((card) => {
    const original = services[Number(card.dataset.index)];
    const value = (name) => card.querySelector(`[name="${name}"]`).value.trim();
    return {
      ...original,
      name: value("name"),
      description: value("description"),
      url: value("url"),
      logoUrl: value("logoUrl"),
      featured: card.querySelector('[name="featured"]').checked,
    };
  });
}

async function showWorkspace() {
  const payload = await api("/api/services");
  services = payload;
  renderEditors();
  loginPanel.hidden = true;
  workspace.hidden = false;
}

document.querySelector("#add-service-button").addEventListener("click", () => {
  services = [...collectServices(), newService()];
  renderEditors();
  setMessage(saveMessage, "New service added. Fill it out, then save changes.");
  serviceList.lastElementChild?.scrollIntoView({ behavior: "smooth", block: "center" });
});

document.querySelector("#login-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  setMessage(loginMessage, "Signing in...");
  const form = new FormData(event.currentTarget);
  try {
    await api("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ username: form.get("username"), password: form.get("password") }),
    });
    await showWorkspace();
  } catch (error) {
    setMessage(loginMessage, error.message, "error");
  }
});

document.querySelector("#services-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  setSaveState("saving");
  setMessage(saveMessage, "Saving changes...");
  try {
    const payload = await api("/api/admin/services", {
      method: "POST",
      body: JSON.stringify({ services: collectServices() }),
    });
    services = payload.services;
    renderEditors();
    setSaveState("saved");
    setMessage(saveMessage, "Saved. Homepage services are updated.", "success");
  } catch (error) {
    setSaveState("failed");
    setMessage(saveMessage, `Did not save: ${error.message}`, "error");
  }
});

document.querySelector("#logout-button").addEventListener("click", async () => {
  await api("/api/admin/logout", { method: "POST", body: "{}" });
  workspace.hidden = true;
  loginPanel.hidden = false;
  document.querySelector("#login-form").reset();
  setMessage(loginMessage, "Signed out.", "success");
});

api("/api/admin/session")
  .then((session) => {
    if (session.authenticated) return showWorkspace();
  })
  .catch(() => setMessage(loginMessage, "Could not reach Honore Home.", "error"));
