export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return getCookie("access_token");
}

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (options?.headers) {
    Object.assign(headers, options.headers);
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Token expired or invalid, redirect to login
      if (typeof window !== "undefined") {
        document.cookie = "access_token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
        document.cookie = "user=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
        //window.location.href = '/login';
      }
    }
    const errorText = await response.text();
    throw new Error(errorText || `API Error: ${response.statusText}`);
  }

  return response.json();
}
