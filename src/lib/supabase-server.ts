import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// Session-aware server client for admin auth. Returns null when the
// project env is not configured so pages can render a setup notice
// instead of crashing at build time.
export async function getSessionClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  const cookieStore = await cookies();
  return createServerClient(url, anon, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (all) => {
        try {
          all.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          /* called from a Server Component; middleware refreshes instead */
        }
      },
    },
  });
}

export async function requireUser() {
  const supa = await getSessionClient();
  if (!supa) return null;
  const {
    data: { user },
  } = await supa.auth.getUser();
  return user;
}
