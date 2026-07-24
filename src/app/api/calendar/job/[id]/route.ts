import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase-admin";
import { buildSingleEvent, IcsJob } from "@/lib/ics";
import { SITE } from "@/data/site";
import { isSignedIn } from "@/lib/admin-auth";

export const runtime = "nodejs";

// Single-event file (spec 12.2). Admin-only: contains customer details.
// Tier 2 is for ADDING an event; edits propagate through the tier 1
// feed because iOS Safari does not reliably apply updates from a
// re-downloaded ICS even with correct UID and SEQUENCE.
export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isSignedIn())) return new NextResponse(null, { status: 404 });

  const { id } = await ctx.params;
  const admin = getAdminClient();
  if (!admin) return new NextResponse(null, { status: 404 });

  const { data: j } = await admin
    .from("gl_jobs")
    .select(
      "id, ics_uid, ics_sequence, last_modified, title, starts_at, ends_at, status, address_line, city, zip, notes, services, gl_contacts(first_name, last_name, phone)"
    )
    .eq("id", id.replace(/\.ics$/i, ""))
    .maybeSingle();
  if (!j) return new NextResponse(null, { status: 404 });

  const c = j.gl_contacts as unknown as
    | { first_name: string; last_name: string | null; phone: string | null }
    | null;
  const job: IcsJob = {
    id: j.id,
    ics_uid: j.ics_uid,
    ics_sequence: j.ics_sequence,
    last_modified: j.last_modified,
    title: j.title,
    starts_at: j.starts_at,
    ends_at: j.ends_at,
    status: j.status,
    address_line: j.address_line,
    city: j.city,
    zip: j.zip,
    notes: j.notes,
    services: j.services,
    contact_name: c ? [c.first_name, c.last_name].filter(Boolean).join(" ") : null,
    contact_phone: c?.phone ?? null,
  };

  return new NextResponse(buildSingleEvent(job, SITE.url), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="job-${j.id}.ics"`,
    },
  });
}
