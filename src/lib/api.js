// বাংলা মন্তব্য: Frontend থেকে backend call করার shared helper functions।
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// বাংলা মন্তব্য: Public API call সরাসরি backend থেকে data আনে।
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

// বাংলা মন্তব্য: Protected API call Next.js proxy দিয়ে যায়, যাতে JWT cookie backend-এ Authorization header হিসেবে যায়।
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

// বাংলা মন্তব্য: Date UI-friendly format করার helper।
export function formatDate(value) {
  if (!value) return "Not available";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// বাংলা মন্তব্য: টাকা format করার helper।
export function formatMoney(value) {
  return `৳ ${Number(value || 0).toLocaleString()}`;
}
