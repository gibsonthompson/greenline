import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase-admin";
import { setOptOut, notifySystem } from "@/lib/notify";
import { toE164 } from "@/lib/phone";

export const runtime = "nodejs";

const STOP_WORDS = ["STOP", "STOPALL", "UNSUBSCRIBE", "CANCEL", "END", "QUIT", "REVOKE", "OPTOUT"];
const START_WORDS = ["START", "UNSTOP", "YES", "SUBSCRIBE", "OPTIN"];

/**
 * Telnyx delivery receipts and inbound messages (STOP / START / HELP).
 * The webhook URL secret was removed. Point the Telnyx webhook straight at
 * https://yourdomain.com/api/sms/status with no query string.
 */
export async function POST(req: NextRequest) {
  let payload: { data?: { event_type?: string; payload?: Record<string, unknown> } };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  const admin = getAdminClient();
  if (!admin) return NextResponse.json({ ok: true });

  const type = payload.data?.event_type ?? "";
  const p = payload.data?.payload ?? {};

  /* ---- delivery receipts ---- */
  if (type.startsWith("message.")) {
    const id = String(p.id ?? "");
    const toArr = Array.isArray(p.to) ? (p.to[0] as Record<string, unknown>) : null;
    const status = String(toArr?.status ?? p.status ?? type);
    if (id) {
      await admin.from("gl_sms_log").update({ status }).eq("provider_id", id);
      if (status === "delivery_failed" || status === "sending_failed") {
        const { data: row } = await admin
          .from("gl_sms_log").select("audience,to_number").eq("provider_id", id).maybeSingle();
        if (row && row.audience !== "customer") {
          await notifySystem(`SMS to ${row.to_number} failed (${status}). Alerts may not be arriving.`);
        }
      }
    }
  }

  /* ---- inbound ---- */
  if (type === "message.received") {
    const fromRaw = String((p.from as Record<string, unknown>)?.phone_number ?? "");
    const from = toE164(fromRaw) ?? fromRaw;
    const text = String(p.text ?? "").trim();
    const upper = text.toUpperCase();

    await admin.from("gl_sms_log").insert({
      direction: "inbound",
      from_number: from,
      to_number: String(Array.isArray(p.to) ? (p.to[0] as Record<string, unknown>)?.phone_number : ""),
      body: text, template: "inbound", status: "received",
    });

    if (STOP_WORDS.includes(upper)) {
      await setOptOut(from, true, "STOP", "inbound-sms");
    } else if (START_WORDS.includes(upper)) {
      await setOptOut(from, false, upper, "inbound-sms");
    } else if (upper === "HELP") {
      // HELP must answer even for an opted-out number, so it bypasses the
      // opt-out-checked send path.
      const apiKey = process.env.TELNYX_API_KEY;
      const fromNum = process.env.TELNYX_FROM_NUMBER;
      if (apiKey && fromNum) {
        await fetch("https://api.telnyx.com/v2/messages", {
          method: "POST",
          headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: fromNum, to: from,
            text: "Green Line Lawn Care. Call or text (925) 436-6691 for help. Reply STOP to opt out.",
          }),
        }).catch(() => {});
      }
    }
  }

  return NextResponse.json({ ok: true });
}
