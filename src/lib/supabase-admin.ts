import "server-only";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Lazy server-only admin client. Service role key never reaches a bundle.
let _admin: SupabaseClient | null | undefined;

export function getAdminClient(): SupabaseClient | null {
  if (_admin !== undefined) return _admin;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  _admin = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
  return _admin;
}
