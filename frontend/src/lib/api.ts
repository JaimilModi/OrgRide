import { API_BASE } from "./constants";
import Cookies from "js-cookie";

export const AUTH_TOKEN_KEY = "orgride_token";
export const USER_INFO_KEY = "orgride_user";

export function getToken() {
  return Cookies.get(AUTH_TOKEN_KEY);
}

export function getUser() {
  const userStr = Cookies.get(USER_INFO_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch (e) {
    return null;
  }
}

export function setAuth(token: string, user: any) {
  Cookies.set(AUTH_TOKEN_KEY, token, { expires: 7 }); // 7 days
  Cookies.set(USER_INFO_KEY, JSON.stringify(user), { expires: 7 });
}

export function logout() {
  Cookies.remove(AUTH_TOKEN_KEY);
  Cookies.remove(USER_INFO_KEY);
  if (typeof window !== "undefined") {
    window.location.href = "/signin";
  }
}

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Unauthorized - token expired or invalid
    logout();
    throw new Error("Session expired. Please sign in again.");
  }

  const data = await response.json();
  if (!response.ok || !data.success) {
    let errorMessage = data.error?.message || data.message || "Request failed";
    if (data.error?.details && Array.isArray(data.error.details)) {
      errorMessage = data.error.details.map((d: any) => `${d.field?.replace('body.', '') || 'Field'}: ${d.message}`).join(', ');
    }
    throw new Error(errorMessage);
  }

  return data.data;
}

export async function login(loginId: string, password: string) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ loginId, password }),
  });
  
  const data = await response.json();
  if (!response.ok || !data.success) {
    let errorMessage = data.error?.message || data.message || "Failed to sign in";
    if (data.error?.details && Array.isArray(data.error.details)) {
      errorMessage = data.error.details.map((d: any) => `${d.field.replace('body.', '')}: ${d.message}`).join(', ');
    }
    throw new Error(errorMessage);
  }
  
  setAuth(data.data.token, data.data.employee);
  return data.data;
}

export async function registerEmployee(payload: any) {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  
  const data = await response.json();
  if (!response.ok || !data.success) {
    let errorMessage = data.error?.message || data.message || "Failed to register";
    if (data.error?.details && Array.isArray(data.error.details)) {
      errorMessage = data.error.details.map((d: any) => `${d.field.replace('body.', '')}: ${d.message}`).join(', ');
    }
    throw new Error(errorMessage);
  }
  
  setAuth(data.data.token, data.data.employee);
  return data.data;
}

// RIDER APIS

export async function searchRides(query: any) {
  const qs = new URLSearchParams(query as Record<string, string>).toString();
  return await fetchWithAuth(`/rides/search?${qs}`);
}

export async function getPublicRide(id: string) {
  return await fetchWithAuth(`/rides/public/${id}`);
}

export async function bookRide(rideId: string, seatsBooked: number) {
  return await fetchWithAuth(`/bookings`, {
    method: "POST",
    body: JSON.stringify({ rideId, seatsBooked }),
  });
}

export async function getMyBookings() {
  return await fetchWithAuth(`/bookings/me`);
}

export async function cancelBooking(id: string) {
  return await fetchWithAuth(`/bookings/${id}/cancel`, {
    method: "PATCH",
  });
}

export async function getWallet() {
  return await fetchWithAuth(`/wallet`);
}

export async function getWalletHistory() {
  return await fetchWithAuth(`/wallet/history`);
}

export async function rechargeWallet(amount: number) {
  return await fetchWithAuth(`/wallet/recharge`, {
    method: "POST",
    body: JSON.stringify({ amount, redirectUrl: "http://localhost:3000/dashboard/wallet" }),
  });
}

export async function confirmRecharge(sessionId: string) {
  return await fetchWithAuth(`/wallet/recharge/confirm`, {
    method: "POST",
    body: JSON.stringify({ sessionId }),
  });
}

export async function payBooking(bookingId: string) {
  return await fetchWithAuth(`/wallet/pay`, {
    method: "POST",
    body: JSON.stringify({ bookingId }),
  });
}

export async function getProfile() {
  return await fetchWithAuth(`/profile`);
}

export async function updateProfile(data: any) {
  return await fetchWithAuth(`/profile`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function reportUser(data: { rideId: string; reportedUserId: string; category: string; description: string }) {
  return await fetchWithAuth(`/reports`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Admin Endpoints
export async function getAdminReports() {
  return await fetchWithAuth(`/reports`);
}

export async function updateReportStatus(id: string, status: string) {
  return await fetchWithAuth(`/reports/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function getOrganization() {
  return await fetchWithAuth(`/organization`);
}

export async function updateOrganization(data: any) {
  return await fetchWithAuth(`/organization`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
