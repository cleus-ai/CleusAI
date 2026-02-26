import type { UserProfile } from "@cleus/shared";

const BASE = process.env.NEXT_PUBLIC_API_URL;

export async function login(email: string, password: string): Promise<UserProfile> {
  const res = await fetch(`${BASE}/api/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ email, password }) });
  if (!res.ok) { const err = await res.json(); throw new Error(err.message ?? "Login failed"); }
  return res.json();
}

export async function register(email: string, username: string, password: string): Promise<UserProfile> {
  const res = await fetch(`${BASE}/api/auth/register`, { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ email, username, password }) });
  if (!res.ok) { const err = await res.json(); throw new Error(err.message ?? "Registration failed"); }
  return res.json();
}

export async function logout(): Promise<void> {
  await fetch(`${BASE}/api/auth/logout`, { method: "POST", credentials: "include" });
}

export async function getMe(): Promise<UserProfile> {
  const res = await fetch(`${BASE}/api/auth/me`, { credentials: "include" });
  if (!res.ok) throw new Error("Not authenticated");
  return res.json();
}
