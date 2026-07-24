import "server-only";
import { getAdminClient } from "./supabase-admin";
import { toE164, formatDisplay } from "./phone";
import { SITE } from "@/data/site";

/* ============================================================================
   NOTIFICATION ROUTING

   Three recipient roles:

   DEVELOPER  hardcoded below. Receives a copy of every operational alert so
              the system can be watched during testing. Not an env var on
              purpose: it should not silently change with a deploy.

   OWNER      OWNER_SMS_NUMBER. The business owner alerts. Set to Gibson's
              number during testing, swapped to Jaydin's once handed over.

   CUSTOMER   the lead or contact. Always opt-out checked, never sent without
              stored consent.
   ============================================================================ */

/** Gibson. Monitoring copy of every operational alert. */
export const DEVELOPER_SMS = "+16783161454";

export type Audience = "customer" | "owner" | "developer";

function ownerNumber(): string | null {
  return toE164(process.env.OWNER_SMS_NUMBER ?? "") ?? null;
}

/** Internal recipients, de-duplicated so one number never gets two copies. */
function internalRecipients(): { to: string; audience: Audience }[] {
  const owner = ownerNumber();
  const list: { to: string; audience: Audience }[] = [];
  if (owner) list.push({ to: owner, audience: "owner" });
  if (DEVELOPER_SMS !== owner) list.push({ to: DEVELOPER_SMS, audience: "developer" });
  return list;
}

/* ---------------------------------------------------------------- opt-outs */

export async function isOptedOut(phone: string): Promise<boolean> {
  const admin = getAdminClient();
  if (!admin) return false;
  const { data } = await admin
    .from("gl_sms_optouts")
    .select("opted_out")
    .eq("phone", phone)
    .maybeSingle();
  return Boolean(data?.opted_out);
}

export async function setOptOut(phone: string, optedOut: boolean, reason: string, source: string) {
  const admin = getAdminClient();
  if (!admin) return;
  await admin.from("gl_sms_optouts").upsert(
    { phone, opted_out: optedOut, reason, source, updated_at: new Date().toISOString() },
    { onConflict: "phone" }
  );
}

/* ------------------------------------------------------------------- send */

type SendArgs = {
  to: string;
  body: string;
  template: string;
  audience: Audience;
  leadId?: string;
  jobId?: string;
};

/**
 * Single exit point for every outbound message.
 * Checks opt-out first, logs the attempt either way, and never throws:
 * a failed text must not fail the request that triggered it.
 */
export async function send({ to, body, template, audience, leadId, jobId }: SendArgs): Promise<void> {
  const admin = getAdminClient();
  const from = process.env.TELNYX_FROM_NUMBER;
  const apiKey = process.env.TELNYX_API_KEY;
  const profile = process.env.TELNYX_MESSAGING_PROFILE_ID;

  const log = async (status: string, providerId: string | null, error: string | null, suppressed = false) => {
    if (!admin) return;
    await admin.from("gl_sms_log").insert({
      direction: "outbound",
      to_number: to,
      from_number: from ?? null,
      body,
      template,
      audience,
      suppressed,
      lead_id: leadId ?? null,
      job_id: jobId ?? null,
      provider_id: providerId,
      status,
      error,
    });
  };

  // STOP is honoured for every audience. If an internal number opts out the
  // log records it as suppressed, which is how you diagnose "why did the
  // alerts stop" instead of guessing.
  if (await isOptedOut(to)) {
    await log("suppressed", null, "recipient opted out", true);
    return;
  }

  if (!apiKey || !from) {
    await log("skipped", null, "TELNYX env not configured");
    return;
  }

  try {
    const res = await fetch("https://api.telnyx.com/v2/messages", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, text: body, ...(profile ? { messaging_profile_id: profile } : {}) }),
    });
    const json = await res.json().catch(() => null);
    if (res.ok) await log("sent", json?.data?.id ?? null, null);
    else await log("error", null, JSON.stringify(json?.errors ?? res.status));
  } catch (e) {
    await log("error", null, e instanceof Error ? e.message : "unknown");
  }
}

/** Fan an operational alert out to the owner and the developer copy. */
async function alertInternal(body: string, template: string, ids: { leadId?: string; jobId?: string } = {}) {
  await Promise.all(
    internalRecipients().map((r) => send({ ...r, body, template, ...ids }))
  );
}

/* --------------------------------------------------------------- messages */

export async function notifyNewLead(lead: {
  id: string; name: string; phone: string; city: string | null;
  services: string[]; photoCount: number; outOfArea: boolean;
}) {
  const flag = lead.outOfArea ? "\nOUTSIDE CORE AREA" : "";
  await alertInternal(
    `New estimate request\n${lead.name} \u00b7 ${lead.city ?? "no city"}\n` +
      `${lead.services.join(", ")}\n${formatDisplay(lead.phone)}\n` +
      `${lead.photoCount} photo(s)${flag}\n${SITE.url}/admin/leads/${lead.id}`,
    "owner-new-lead",
    { leadId: lead.id }
  );
}

export async function notifyCustomerReceived(lead: { id: string; name: string; phone: string }) {
  const first = lead.name.split(/\s+/)[0];
  await send({
    to: lead.phone,
    audience: "customer",
    template: "customer-confirmation",
    leadId: lead.id,
    body:
      `Green Line Lawn Care: thanks ${first}, we got your request. ` +
      `You'll have a price back today. Questions in the meantime, reply here or call ${SITE.phoneDisplay}. ` +
      `Reply STOP to opt out.`,
  });
}

export async function notifyQuoteSent(lead: {
  id: string; name: string; phone: string; amount: number;
}) {
  const first = lead.name.split(/\s+/)[0];
  await send({
    to: lead.phone,
    audience: "customer",
    template: "customer-quote",
    leadId: lead.id,
    body:
      `Green Line Lawn Care: hi ${first}, your quote is $${lead.amount.toFixed(0)}. ` +
      `Reply YES to get on the schedule, or reply with any questions. Reply STOP to opt out.`,
  });
}

export async function notifyJobScheduled(job: {
  id: string; title: string; startsAt: string; phone: string | null; name: string | null;
}) {
  if (!job.phone) return;
  await send({
    to: job.phone,
    audience: "customer",
    template: "customer-scheduled",
    jobId: job.id,
    body:
      `Green Line Lawn Care: you're booked for ${laDate(job.startsAt)} at ${laTime(job.startsAt)}. ` +
      `We'll text the morning of. Reply STOP to opt out.`,
  });
}

export async function notifyReminder(job: {
  id: string; startsAt: string; phone: string; name: string | null;
}) {
  await send({
    to: job.phone,
    audience: "customer",
    template: "customer-reminder",
    jobId: job.id,
    body:
      `Green Line Lawn Care: reminder, we're scheduled at your property tomorrow, ` +
      `${laDate(job.startsAt)}, around ${laTime(job.startsAt)}. ` +
      `Please unlock gates and secure pets. Reply STOP to opt out.`,
  });
}

export async function notifyEnRoute(job: { id: string; phone: string; etaMin: number }) {
  await send({
    to: job.phone,
    audience: "customer",
    template: "customer-enroute",
    jobId: job.id,
    body: `Green Line Lawn Care: on our way, about ${job.etaMin} minutes out. Reply STOP to opt out.`,
  });
}

export async function notifyCompleted(job: { id: string; phone: string }) {
  await send({
    to: job.phone,
    audience: "customer",
    template: "customer-complete",
    jobId: job.id,
    body:
      `Green Line Lawn Care: all done for today. Walks and drive are blown off. ` +
      `Anything you'd like handled differently next visit, just reply. Reply STOP to opt out.`,
  });
}

export async function notifyReviewRequest(job: { id: string; phone: string; reviewUrl: string }) {
  await send({
    to: job.phone,
    audience: "customer",
    template: "customer-review",
    jobId: job.id,
    body:
      `Green Line Lawn Care: hope the yard is looking good. If we did right by you, ` +
      `a quick Google review helps us a lot: ${job.reviewUrl} Reply STOP to opt out.`,
  });
}

export async function notifySystem(message: string) {
  await send({
    to: DEVELOPER_SMS,
    audience: "developer",
    template: "system-alert",
    body: `Green Line system: ${message}`,
  });
}

/* ----------------------------------------------------------------- format */

function laDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    timeZone: "America/Los_Angeles", weekday: "long", month: "short", day: "numeric",
  });
}
function laTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    timeZone: "America/Los_Angeles", hour: "numeric", minute: "2-digit",
  });
}
