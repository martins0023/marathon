// lib/apiClient.ts
export type ApiError = { status: number; message: string; details?: any };

const API_BASE =
  (process.env.NEXT_PUBLIC_API_BASE && process.env.NEXT_PUBLIC_API_BASE.replace(/\/$/, "")) ||
  "https://marathon-server-chi.vercel.app";

async function parseResponse(res: Response) {
  const ct = res.headers.get("content-type") ?? "";
  const isJson = ct.includes("application/json");
  const payload = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    const message = payload?.message ?? res.statusText ?? "Request failed";
    const details = payload?.details ?? payload?.errors ?? null;
    const error: ApiError = { status: res.status, message, details };
    throw error;
  }

  // normalize { success, details, message } -> return details
  if (payload && typeof payload === "object" && "details" in payload) {
    return payload.details;
  }
  return payload;
}

/**
 * Simple fetch wrapper that:
 * - uses credentials: 'include' to send cookies (backend sets token cookie)
 * - returns parsed JSON or throws ApiError
 */
export async function apiFetch<T = any>(path: string, options?: RequestInit): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });
  return parseResponse(res) as Promise<T>;
}
