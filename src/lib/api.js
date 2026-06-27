
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";


export async function publicApi(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    cache: "no-store",
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) {
    throw new Error(data.message || "API request failed");
  }
  return data;
}


export async function serverApi(path, options = {}) {
  const res = await fetch(`/api/server${path}`, {
    cache: "no-store",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) {
    throw new Error(data.message || "Protected API request failed");
  }
  return data;
}


export function formatDate(value) {
  if (!value) return "Not available";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}


export function formatMoney(value) {
  return `৳ ${Number(value || 0).toLocaleString()}`;
}
