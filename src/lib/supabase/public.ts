import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Server-side client that does NOT read cookies().
 * Use this only for public, RLS-readable data (is_public = true rows).
 * Because it never touches cookies/headers, pages that use only this client
 * stay eligible for static rendering and ISR — unlike `lib/supabase/server.ts`,
 * which opts every page into dynamic rendering by reading the session cookie.
 */
export function createPublicClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}
