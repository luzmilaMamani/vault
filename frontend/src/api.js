const BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

function handleRes(res) {
  if (!res.ok) return res.json().then((e) => Promise.reject(e));
  return res.json();
}

export async function login({ username, password }) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: username, password }),
  });
  return handleRes(res);
}

export async function register({ email, password }) {
  const res = await fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleRes(res);
}

export async function getCredentials(query) {
  const q = query ? `?q=${encodeURIComponent(query)}` : "";
  const res = await fetch(`${BASE}/credentials${q}`, { headers: authHeader() });
  return handleRes(res);
}

export async function getCredential(id) {
  const res = await fetch(`${BASE}/credentials/${id}`, {
    headers: authHeader(),
  });
  return handleRes(res);
}

export async function createCredential(data) {
  const res = await fetch(`${BASE}/credentials`, {
    method: "POST",
    headers: { ...authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleRes(res);
}

export async function updateCredential(id, data) {
  const res = await fetch(`${BASE}/credentials/${id}`, {
    method: "PUT",
    headers: { ...authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleRes(res);
}

export async function deleteCredential(id) {
  const res = await fetch(`${BASE}/credentials/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });
  return handleRes(res);
}

function authHeader() {
  const token = localStorage.getItem("mv_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}
