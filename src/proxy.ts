import { NextRequest, NextResponse } from "next/server";
import { tokenValid, SESSION_COOKIE } from "@/lib/admin-auth";

/**
 * Guards /admin/* behind the PIN session cookie.
 * /admin/login stays public so the PIN can be entered or first set.
 */
export async function proxy(req: NextRequest) {
  const isLogin = req.nextUrl.pathname === "/admin/login";
  const signedIn = tokenValid(req.cookies.get(SESSION_COOKIE)?.value);

  if (!signedIn && !isLogin) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
  if (signedIn && isLogin) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
