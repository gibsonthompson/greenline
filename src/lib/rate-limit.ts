import "server-only";
import { getAdminClient } from "./supabase-admin";

/**
 * Database-backed rate limiting.
 *
 * The previous implementation was an in-memory Map. On Vercel that resets on
 * every cold start and each instance keeps its own copy, so a determined
 * sender simply had to hit a different lambda. This shares state.
 *
 * Fails OPEN: if the database is unreachable we let the request through
 * rather than blocking real customers. The honeypot, elapsed-time gate and
 * Turnstile still apply.
 */
export async function allow(
  bucket: "estimate" | "upload",
  identifier: string,
  limit: number,
  windowMinutes: number
): Promise<boolean> {
  const admin = getAdminClient();
  if (!admin) return true;
  try {
    const { data, error } = await admin.rpc("gl_rate_check", {
      p_bucket: bucket,
      p_identifier: identifier,
      p_limit: limit,
      p_window_minutes: windowMinutes,
    });
    if (error) return true;
    return data !== false;
  } catch {
    return true;
  }
}
