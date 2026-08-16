import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Service-role Supabase client — bypasses RLS, never expose to the client.
// Used only for one-off privileged operations: seeding the single admin
// user (db/seed.ts) and any server action that needs elevated storage/auth
// access beyond what the logged-in admin's own session already grants.
// No `import "server-only"` — db/seed.ts imports this directly via tsx,
// outside Next's bundler, which would trip server-only's guard. Every
// Next-side caller of this module is already a Server Action/component.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Missing Supabase admin credentials (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)."
    );
  }

  return createSupabaseClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
