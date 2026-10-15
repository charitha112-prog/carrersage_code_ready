const API_BASE = import.meta.env.VITE_API_BASE || "";

export async function api(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const token = localStorage.getItem("cs-token");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const response = await fetch(`${API_BASE}/api${path}`, { ...options, headers });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) { const error = new Error(payload.detail || `Request failed (${response.status})`); error.status = response.status; throw error; }
  return payload;
}

export function saveSession({ token, user }) {
  localStorage.setItem("cs-token", token);
  localStorage.setItem("cs-user", JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem("cs-token");
  localStorage.removeItem("cs-user");
}
