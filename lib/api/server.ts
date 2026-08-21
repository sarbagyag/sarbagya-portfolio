import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_TOKEN_COOKIE } from "./constants";

// Server-only base URL for the Go API — no NEXT_PUBLIC_ prefix since every
// call goes through a Server Component/Action, never the browser directly.
const API_URL = process.env.API_URL ?? "http://localhost:8080";

export { ADMIN_TOKEN_COOKIE };

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

async function parseErrorMessage(res: Response): Promise<string> {
  try {
    const body = await res.json();
    return typeof body?.error === "string" ? body.error : `Request failed (${res.status})`;
  } catch {
    return `Request failed (${res.status})`;
  }
}

/** Unauthenticated fetch against a public Go API route (GET /api/*, POST /api/contact, /api/auth/login). */
export async function publicFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const isFormData = init?.body instanceof FormData;
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...init?.headers,
    },
  });

  if (!res.ok) throw new ApiError(res.status, await parseErrorMessage(res));
  if (res.status === 204) return undefined as T;
  return res.json();
}

export async function getAdminToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(ADMIN_TOKEN_COOKIE)?.value;
}

/**
 * Authenticated fetch against /api/admin/*. Redirects to the admin login
 * page whenever there's no token or the API says it's invalid/expired —
 * Server Actions are reachable directly over the network independent of
 * the UI, so this is the real enforcement point on the frontend side (the
 * Go API itself is still the actual authority; it re-checks the JWT on
 * every call regardless of what the frontend does).
 */
export async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getAdminToken();
  if (!token) redirect("/admin/login");

  const isFormData = init?.body instanceof FormData;
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...init?.headers,
    },
  });

  if (res.status === 401) redirect("/admin/login");
  if (!res.ok) throw new ApiError(res.status, await parseErrorMessage(res));
  if (res.status === 204) return undefined as T;
  return res.json();
}
