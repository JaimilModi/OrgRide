import { API_BASE } from "./constants";

export async function login(loginId: string, password: string) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ loginId, password }),
  });
  
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error?.message || data.message || "Failed to sign in");
  }
  
  return data.data;
}

// NOTE: The backend does not have a public registration endpoint in phase 2 yet.
// We mock the API call here to demonstrate the requested Driver/Rider flows for the hackathon,
// but they will fail gracefully since the endpoint doesn't exist.
export async function registerEmployee(payload: any) {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  
  if (response.status === 404) {
    throw new Error("Backend API gap: Registration endpoint is not yet implemented by the backend.");
  }
  
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error?.message || data.message || "Failed to register");
  }
  
  return data.data;
}
