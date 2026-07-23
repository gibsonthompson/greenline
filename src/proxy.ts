import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Next 16 proxy (formerly middleware). Guards /admin/* behind Supabase Auth and keeps the session fresh.
// /admin/login stays public. Without configured env vars everything
// under /admin redirects to login, which renders a setup notice.
export async function proxy(req: NextRequest) {
  const res = NextResponse.next({ request: req });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const isLogin = req.nextUrl.pathname === "/admin/login";

  if (!url || !anon) {
    return isLogin ? res : NextResponse.redirect(new URL("/admin/login", req.url));
  }

  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (all) => {
        all.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !isLogin) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
  if (user && isLogin) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }
  return res;
}

export const config = { matcher: ["/admin/:path*"] };
