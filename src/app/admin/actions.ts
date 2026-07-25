"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomBytes } from "crypto";
import { getAdminClient } from "@/lib/supabase-admin";
import { isSignedIn } from "@/lib/admin-auth";
import { toE164 } from "@/lib/phone";

async function guard() {
  if (!(await isSignedIn())) throw new Error("unauthorized");
  const admin = getAdminClient();
  if (!admin) throw new Error("not configured");
  return admin;
}

export async function updateLeadStatus(leadId: string, status: string) {
  const admin = await guard();
  const patch: Record<string, unknown> = { status, updated_at: new Date().toISOString() };
  await admin.from("gl_leads").update(patch).eq("id", leadId);
  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}

export async function createContact(formData: FormData) {
  const admin = await guard();
  const phoneRaw = String(formData.get("phone") ?? "");
  const { data } = await admin
    .from("gl_contacts")
    .insert({
      first_name: String(formData.get("first_name") ?? "").trim(),
      last_name: String(formData.get("last_name") ?? "").trim() || null,
      phone: toE164(phoneRaw) ?? (phoneRaw || null),
      email: String(formData.get("email") ?? "") || null,
      address_line: String(formData.get("address_line") ?? "") || null,
      city: String(formData.get("city") ?? "") || null,
      zip: String(formData.get("zip") ?? "") || null,
      contact_type: String(formData.get("contact_type") ?? "residential"),
      is_recurring: formData.get("is_recurring") === "on",
      cadence: String(formData.get("cadence") ?? "") || null,
      source: String(formData.get("source") ?? "") || null,
      notes: String(formData.get("notes") ?? "") || null,
    })
    .select("id")
    .single();
  revalidatePath("/admin/contacts");
  redirect(data ? `/admin/contacts/${data.id}` : "/admin/contacts");
}

export async function createJob(formData: FormData) {
  const admin = await guard();
  const date = String(formData.get("date") ?? "");
  const start = String(formData.get("start") ?? "09:00");
  const durationMin = Number(formData.get("duration") ?? 60);
  // Interpreted as America/Los_Angeles wall time. Stored as the UTC
  // instant matching that wall time on that date.
  const startsAt = laWallToUtc(date, start);
  const endsAt = new Date(startsAt.getTime() + durationMin * 60000);

  const { data } = await admin
    .from("gl_jobs")
    .insert({
      contact_id: String(formData.get("contact_id") ?? "") || null,
      lead_id: String(formData.get("lead_id") ?? "") || null,
      job_type: String(formData.get("job_type") ?? "service"),
      title: String(formData.get("title") ?? "Job").trim(),
      services: String(formData.get("services") ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
      address_line: String(formData.get("address_line") ?? "") || null,
      city: String(formData.get("city") ?? "") || null,
      zip: String(formData.get("zip") ?? "") || null,
      notes: String(formData.get("notes") ?? "") || null,
    })
    .select("id")
    .single();

  const leadId = String(formData.get("lead_id") ?? "");
  if (leadId) {
    await admin.from("gl_leads").update({ status: "scheduled" }).eq("id", leadId);
  }
  revalidatePath("/admin/calendar");
  revalidatePath("/admin");
  redirect(data ? `/admin/jobs/${data.id}` : "/admin/calendar");
}

export async function updateJob(jobId: string, formData: FormData) {
  const admin = await guard();
  const date = String(formData.get("date") ?? "");
  const start = String(formData.get("start") ?? "09:00");
  const durationMin = Number(formData.get("duration") ?? 60);
  const startsAt = laWallToUtc(date, start);
  const endsAt = new Date(startsAt.getTime() + durationMin * 60000);
  await admin
    .from("gl_jobs")
    .update({
      title: String(formData.get("title") ?? "Job").trim(),
      status: String(formData.get("status") ?? "scheduled"),
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
      address_line: String(formData.get("address_line") ?? "") || null,
      city: String(formData.get("city") ?? "") || null,
      notes: String(formData.get("notes") ?? "") || null,
    })
    .eq("id", jobId);
  revalidatePath(`/admin/jobs/${jobId}`);
  revalidatePath("/admin/calendar");
}

export async function ensureCalendarFeed(): Promise<string> {
  const admin = await guard();
  const { data: existing } = await admin
    .from("gl_calendar_feeds")
    .select("token")
    .eq("revoked", false)
    .eq("scope", "all")
    .limit(1)
    .maybeSingle();
  if (existing) return existing.token;
  const pepper = process.env.CALENDAR_FEED_PEPPER ?? "";
  const token = randomBytes(32).toString("base64url") + (pepper ? "" : "");
  await admin.from("gl_calendar_feeds").insert({ label: "Jaydin iPhone", token, scope: "all" });
  return token;
}

export async function regenerateCalendarFeed(): Promise<void> {
  const admin = await guard();
  await admin.from("gl_calendar_feeds").update({ revoked: true }).eq("revoked", false);
  const token = randomBytes(32).toString("base64url");
  await admin.from("gl_calendar_feeds").insert({ label: "Jaydin iPhone", token, scope: "all" });
  revalidatePath("/admin/settings");
}

// Convert an America/Los_Angeles wall time to the UTC instant.
function laWallToUtc(dateStr: string, timeStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  const [hh, mm] = timeStr.split(":").map(Number);
  // Find the UTC time whose LA rendering matches the requested wall time.
  const guess = Date.UTC(y, (m ?? 1) - 1, d ?? 1, hh ?? 9, mm ?? 0);
  for (const offsetH of [7, 8]) {
    const candidate = new Date(guess + offsetH * 3600_000);
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Los_Angeles",
      hour12: false,
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit",
    }).formatToParts(candidate);
    const get = (t: string) => parts.find((p) => p.type === t)?.value;
    const hRaw = get("hour");
    const h = hRaw === "24" ? "00" : hRaw;
    if (
      Number(get("year")) === y &&
      Number(get("month")) === m &&
      Number(get("day")) === d &&
      Number(h) === hh &&
      Number(get("minute")) === mm
    ) {
      return candidate;
    }
  }
  return new Date(guess + 8 * 3600_000);
}
