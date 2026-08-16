import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// No `import "server-only"` here (deliberately) — this module is also
// imported directly by standalone scripts run via tsx (db/migrate.ts,
// db/seed.ts), which don't go through Next's bundler and would trip
// server-only's guard. The actual "don't import DB code into client
// components" protection lives in db/queries.ts and the "use server"
// action files instead, which are the only things client components ever
// import from.

// Deliberately doesn't throw at import time when DATABASE_URL is unset —
// admin/content pages import this module, and an eager throw would break
// `next build`'s static analysis before Supabase credentials exist. A page
// that actually needs data marks itself `export const dynamic =
// "force-dynamic"` so Next never tries to prerender it at build time; the
// real failure (if any) surfaces as a runtime connection error instead,
// which only matters once the page is actually requested.
const connectionString = process.env.DATABASE_URL || "postgres://placeholder:placeholder@localhost:5432/placeholder";

if (!process.env.DATABASE_URL && process.env.NODE_ENV !== "test") {
  console.warn(
    "[db] DATABASE_URL is not set — using a placeholder connection string. " +
      "Copy .env.example to .env.local and fill in your Supabase Postgres connection string before hitting any DB-backed route."
  );
}

// In dev, `next dev`'s Fast Refresh re-evaluates this module on almost every
// save without tearing down the previous one, so a naive `postgres(...)`
// call here creates a fresh connection pool each time — against Supabase's
// pooler (session mode, pool_size 15 on the free tier), that exhausts the
// connection limit within a handful of edits (EMAXCONNSESSION). Caching the
// client on `globalThis` in development makes Fast Refresh reuse the same
// pool instead of leaking a new one on every reload. Production doesn't
// need this — each serverless invocation gets a fresh module scope anyway.
const globalForDb = globalThis as unknown as { __dbClient?: ReturnType<typeof postgres> };

// idle_timeout / connect_timeout matter as much as the pooler mode does:
// without them, this one cached connection can sit idle indefinitely and
// get silently dropped server-side by Supabase's transaction pooler — the
// client never notices, so the *next* query just hangs on a dead socket
// until some OS-level TCP timeout eventually gives up (the escalating
// 5s -> 15s -> 100s+ stalls this was causing). idle_timeout makes
// postgres.js close and reopen the connection itself before it can go
// stale; connect_timeout caps how long a fresh connection attempt can hang.
const clientOptions = {
  prepare: false,
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10,
} as const;

const client =
  process.env.NODE_ENV === "production"
    ? postgres(connectionString, clientOptions)
    : (globalForDb.__dbClient ??= postgres(connectionString, clientOptions));

export const db = drizzle(client, { schema });
export * from "./schema";
