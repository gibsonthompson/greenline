import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase-admin";
import { buildCalendar, IcsJob } from "@/lib/ics";
import { SITE } from "@/data/site";

export const runtime = "nodejs";

// Subscription feed (spec 12.1). Route matches /api/calendar/{token}
// and /api/calendar/{token}.ics; the suffix is stripped. The token is a
// bearer credential. Revoked or unknown tokens return 404, never 403,
// so the URL reveals nothing.
export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ token: string }> }
) {
  const { token: rawToken } = await ctx.params;
  const token = rawToken.replace(/\.ics$/i, "");
  const admin = getAdminClient();
  if (!admin) return new NextResponse(null, { status: 404 });

  const { data: feed } = await admin
    .from("gl_calendar_feeds")
    .select("id, revoked, scope, fetch_count")
    .eq("token", token)
    .maybeSingle();
  if (!feed || feed.revoked) return new NextResponse(null, { status: 404 });

  // Window: 90 days back to 365 forward (spec 12.1)
  const from = new Date(Date.now() - 90 * 86400_000).toISOString();
  const to = new Date(Date.now() + 365 * 86400_000).toISOString();

  let q = admin
    .from("gl_jobs")
    .select(
      "id, ics_uid, ics_sequence, last_modified, title, starts_at, ends_at, status, address_line, city, zip, notes, services, gl_contacts(first_name, last_name, phone)"
    )
    .gte("starts_at", from)
    .lte("starts_at", to)
    .order("starts_at");
  if (feed.scope === "estimates") q = q.eq("job_type", "estimate");
  if (feed.scope === "service") q = q.eq("job_type", "service");

  const { data: jobs } = await q;

  const icsJobs: IcsJob[] = (jobs ?? []).map((j) => {
    const c = j.gl_contacts as unknown as
      | { first_name: string; last_name: string | null; phone: string | null }
      | null;
    return {
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
  });

  const body = buildCalendar(icsJobs, SITE.url);

  // Conditional GET support: aggressive clients poll often (spec 12.1)
  const lastMod = icsJobs.reduce(
    (m, j) => Math.max(m, new Date(j.last_modified).getTime()),
    0
  );
  const lastModHttp = new Date(lastMod || Date.now()).toUTCString();
  const ims = req.headers.get("if-modified-since");
  if (ims && lastMod && new Date(ims).getTime() >= lastMod) {
    return new NextResponse(null, { status: 304 });
  }

  void admin
    .from("gl_calendar_feeds")
    .update({ last_fetched: new Date().toISOString(), fetch_count: feed.fetch_count + 1 })
    .eq("id", feed.id);

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Cache-Control": "public, max-age=300",
      "Last-Modified": lastModHttp,
      "Content-Disposition": 'inline; filename="green-line-jobs.ics"',
    },
  });
}

export async function HEAD(req: NextRequest, ctx: { params: Promise<{ token: string }> }) {
  const res = await GET(req, ctx);
  return new NextResponse(null, { status: res.status, headers: res.headers });
}
