// Shared between lib/api/server.ts (server-only) and middleware.ts (edge
// runtime) — kept in its own tiny module so middleware doesn't have to pull
// in the whole server-only fetch layer just for a cookie name.
export const ADMIN_TOKEN_COOKIE = "admin_token";
