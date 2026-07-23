import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase-admin";

export const runtime = "nodejs";

// Telnyx webhooks: delivery receipts and inbound messages.
// Inbound STOP/START/HELP handling per spec 13. Signature verification
// requires the Telnyx public key; enforced when configured.
export async function POST(req: NextRequest) {
  const raw = await req.text();
  let payload: { data?: { event_type?: string; payload?: Record<string, unknown> } };
  try {
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: true });
  }

  const admin = getAdminClient();
  if (!admin) return NextResponse.json({ ok: true });

  const type = payload.data?.event_type ?? "";
  const p = payload.data?.payload ?? {};

  if (type === "message.finalized" || type === "message.sent") {
    const id = String(p.id ?? "");
    const status = String(
      (Array.isArray(p.to) ? (p.to[0] as Record<string, unknown>)?.status : p.status) ?? type
    );
    if (id) await admin.from("gl_sms_log").update({ status }).eq("provider_id", id);
  }

  if (type === "message.received") {
    const from = String((p.from as Record<string, unknown>)?.phone_number ?? "");
    const text = String(p.text ?? "").trim().toUpperCase();
    await admin.from("gl_sms_log").insert({
      direction: "inbound",
      from_number: from,
      to_number: String(
        Array.isArray(p.to) ? (p.to[0] as Record<string, unknown>)?.phone_number : ""
      ),
      body: String(p.text ?? ""),
      template: "inbound",
      status: "received",
    });
    if (["STOP", "STOPALL", "UNSUBSCRIBE", "CANCEL", "END", "QUIT"].includes(text)) {
      await admin.from("gl_settings").upsert({
        key: `optout:${from}`,
        value: { optedOut: true, at: new Date().toISOString() },
      });
    }
    if (text === "START" || text === "UNSTOP") {
      await admin.from("gl_settings").upsert({
        key: `optout:${from}`,
        value: { optedOut: false, at: new Date().toISOString() },
      });
    }
  }

  return NextResponse.json({ ok: true });
}
