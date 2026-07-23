import "server-only";
import { getAdminClient } from "./supabase-admin";

type SmsArgs = {
  to: string;
  body: string;
  template: string;
  leadId?: string;
  jobId?: string;
};

// Fire-and-log. Failures are logged and swallowed: SMS must never
// fail a lead submission (spec section 10).
export async function sendSms({ to, body, template, leadId, jobId }: SmsArgs): Promise<void> {
  const apiKey = process.env.TELNYX_API_KEY;
  const from = process.env.TELNYX_FROM_NUMBER;
  const profile = process.env.TELNYX_MESSAGING_PROFILE_ID;
  const admin = getAdminClient();

  let providerId: string | null = null;
  let status = "skipped";
  let error: string | null = null;

  if (apiKey && from) {
    try {
      const res = await fetch("https://api.telnyx.com/v2/messages", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to,
          text: body,
          ...(profile ? { messaging_profile_id: profile } : {}),
        }),
      });
      const json = await res.json().catch(() => null);
      if (res.ok) {
        providerId = json?.data?.id ?? null;
        status = "sent";
      } else {
        status = "error";
        error = JSON.stringify(json?.errors ?? res.status);
      }
    } catch (e) {
      status = "error";
      error = e instanceof Error ? e.message : "unknown";
    }
  } else {
    error = "TELNYX env not configured";
  }

  if (admin) {
    await admin.from("gl_sms_log").insert({
      direction: "outbound",
      to_number: to,
      from_number: from ?? null,
      body,
      template,
      lead_id: leadId ?? null,
      job_id: jobId ?? null,
      provider_id: providerId,
      status,
      error,
    });
  }
}
