import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase-admin";
import { notifyNewLead, notifyCustomerReceived } from "@/lib/notify";
import { allow } from "@/lib/rate-limit";
import { toE164 } from "@/lib/phone";
import { zipStatus } from "@/data/service-zips";
import { SITE } from "@/data/site";

export const runtime = "nodejs";


async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // not configured: honeypot + timing still apply
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    const j = await res.json();
    return Boolean(j.success);
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!(await allow("estimate", ip, 5, 60))) {
    return NextResponse.json({ error: "Too many requests. Call us instead." }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  // Spam gates
  if (typeof body.honeypot === "string" && body.honeypot.length > 0) {
    return NextResponse.json({ ok: true }); // pretend success to the bot
  }
  if (typeof body.elapsedMs !== "number" || body.elapsedMs < 3000) {
    return NextResponse.json({ error: "Please take a moment and try again." }, { status: 400 });
  }
  if (!(await verifyTurnstile(String(body.turnstileToken ?? ""), ip))) {
    return NextResponse.json(
      { error: "We could not verify your browser. Refresh and try again, or call us." },
      { status: 400 }
    );
  }

  const name = String(body.name ?? "").trim().slice(0, 120);
  const phone = toE164(String(body.phone ?? ""));
  const zip = String(body.zip ?? "").trim();
  const servicesArr = Array.isArray(body.services)
    ? body.services.map(String).slice(0, 10)
    : [];

  if (!name || !phone || servicesArr.length === 0) {
    return NextResponse.json(
      { error: "Name, phone, and at least one service are required." },
      { status: 400 }
    );
  }

  const admin = getAdminClient();
  if (!admin) {
    return NextResponse.json(
      { error: "The estimate system is not configured yet. Call " + SITE.phoneDisplay + "." },
      { status: 503 }
    );
  }

  const smsConsent = Boolean(body.smsConsent);
  const { data: lead, error } = await admin
    .from("gl_leads")
    .insert({
      status: "new",
      services: servicesArr,
      address_line: String(body.address ?? "").slice(0, 200) || null,
      city: String(body.city ?? "").slice(0, 80) || null,
      zip: zip || null,
      out_of_area: zipStatus(zip) !== "core",
      name,
      phone,
      email: String(body.email ?? "").slice(0, 160) || null,
      notes: String(body.notes ?? "").slice(0, 2000) || null,
      sms_consent: smsConsent,
      sms_consent_at: smsConsent ? new Date().toISOString() : null,
      sms_consent_text: smsConsent ? String(body.consentText ?? "") : null,
      utm: body.utm ?? {},
      referrer: req.headers.get("referer"),
      user_agent: req.headers.get("user-agent"),
    })
    .select("id")
    .single();

  if (error || !lead) {
    return NextResponse.json(
      { error: "We could not save your request. Call " + SITE.phoneDisplay + "." },
      { status: 500 }
    );
  }

  // Attach photos
  const photoPaths = Array.isArray(body.photoPaths) ? body.photoPaths : [];
  if (photoPaths.length > 0) {
    await admin.from("gl_lead_photos").insert(
      photoPaths.slice(0, 6).map((p: Record<string, unknown>, i: number) => ({
        lead_id: lead.id,
        storage_path: String(p.path ?? ""),
        width: Number(p.width) || null,
        height: Number(p.height) || null,
        bytes: Number(p.bytes) || null,
        sort_order: i,
      }))
    );
  }

  // Contact upsert on E.164 phone. Failure here must not fail the lead.
  try {
    const { data: existing } = await admin
      .from("gl_contacts")
      .select("id")
      .eq("phone", phone)
      .limit(1)
      .maybeSingle();
    const [first, ...rest] = name.split(/\s+/);
    if (existing) {
      await admin.from("gl_leads").update({ contact_id: existing.id }).eq("id", lead.id);
    } else {
      const { data: created } = await admin
        .from("gl_contacts")
        .insert({
          first_name: first,
          last_name: rest.join(" ") || null,
          phone,
          email: String(body.email ?? "") || null,
          address_line: String(body.address ?? "") || null,
          city: String(body.city ?? "") || null,
          zip: zip || null,
          source: "website",
        })
        .select("id")
        .single();
      if (created) await admin.from("gl_leads").update({ contact_id: created.id }).eq("id", lead.id);
    }
  } catch {
    /* logged implicitly by absence; lead already saved */
  }

  // Notifications fire after the lead is committed and never block the
  // response. Routing, opt-out checks and logging all live in lib/notify.
  void notifyNewLead({
    id: lead.id, name, phone, city: String(body.city ?? "") || null,
    services: servicesArr, photoCount: photoPaths.length,
    outOfArea: zipStatus(zip) !== "core",
  });
  if (smsConsent) void notifyCustomerReceived({ id: lead.id, name, phone });

  return NextResponse.json({ ok: true, leadId: lead.id });
}
