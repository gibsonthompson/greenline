import { NextRequest, NextResponse } from "next/server";
import { verifyPin, setPin, changePin, startSession, endSession, pinIsSet, isSignedIn } from "@/lib/admin-auth";
import { allow } from "@/lib/rate-limit";
import { notifySystem } from "@/lib/notify";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ pinSet: await pinIsSet(), signedIn: await isSignedIn() });
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const body = await req.json().catch(() => ({}));
  const action = String(body.action ?? "login");

  /* ---- first run: set the PIN when none exists ---- */
  if (action === "setup") {
    if (await pinIsSet()) {
      return NextResponse.json({ error: "A PIN is already set. Sign in and change it from Settings." }, { status: 400 });
    }
    const r = await setPin(String(body.pin ?? ""));
    if (!r.ok) return NextResponse.json({ error: r.error }, { status: 400 });
    await startSession();
    void notifySystem("Admin PIN was set for the first time.");
    return NextResponse.json({ ok: true });
  }

  /* ---- change PIN while signed in ---- */
  if (action === "change") {
    if (!(await isSignedIn())) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
    const r = await changePin(String(body.currentPin ?? ""), String(body.newPin ?? ""));
    if (!r.ok) return NextResponse.json({ error: r.error }, { status: 400 });
    void notifySystem("Admin PIN was changed.");
    return NextResponse.json({ ok: true });
  }

  /* ---- sign out ---- */
  if (action === "logout") {
    await endSession();
    return NextResponse.json({ ok: true });
  }

  /* ---- sign in ---- */
  // Server-side throttle on top of the per-PIN lockout, so someone cannot
  // cycle through PINs faster than the lockout can react.
  if (!(await allow("estimate", `pin:${ip}`, 12, 15))) {
    return NextResponse.json({ error: "Too many attempts. Wait a few minutes." }, { status: 429 });
  }
  const r = await verifyPin(String(body.pin ?? ""));
  if (!r.ok) return NextResponse.json({ error: r.error }, { status: 401 });
  await startSession();
  return NextResponse.json({ ok: true });
}
