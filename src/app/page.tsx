export const dynamic = "force-dynamic";

import Link from "next/link";
import { getAdminClient } from "@/lib/supabase-admin";
import { formatDisplay } from "@/lib/phone";

const LA_TZ = "America/Los_Angeles";

const laFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: LA_TZ,
  hourCycle: "h23",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

type LaParts = { y: number; mo: number; d: number; h: number; mi: number; s: number };

const laParts = (d: Date): LaParts => {
  const parts = laFormat.formatToParts(d);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  return {
    y: get("year"),
    mo: get("month"),
    d: get("day"),
    h: get("hour"),
    mi: get("minute"),
    s: get("second"),
  };
};

/* How far the Los Angeles wall clock sits from UTC at a given instant.
   Negative: -7h under PDT, -8h under PST. Read from the tz database
   instead of being hardcoded, so the day boundary stays correct through
   both DST changes. */
const laOffsetMs = (d: Date): number => {
  const p = laParts(d);
  return Date.UTC(p.y, p.mo - 1, p.d, p.h, p.mi, p.s) - Math.floor(d.getTime() / 1000) * 1000;
};

/* The instant midnight begins in Los Angeles on the given calendar day.
   Day may overflow (32, 38); Date.UTC normalises it. Solved by iteration
   because the offset itself depends on the instant we are solving for. */
const laMidnight = (y: number, mo: number, d: number): Date => {
  const wall = Date.UTC(y, mo - 1, d, 0, 0, 0, 0);
  let t = wall - laOffsetMs(new Date(wall));
  t = wall - laOffsetMs(new Date(t));
  return new Date(t);
};

const time = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-US", { timeZone: LA_TZ, hour: "numeric", minute: "2-digit" });

const ago = (iso: string) => {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 60) return `${m}m ago`;
  if (m < 1440) return `${Math.floor(m / 60)}h ago`;
  return `${Math.floor(m / 1440)}d ago`;
};

const STATUS_TONE: Record<string, string> = {
  new: "bg-lime text-ink",
  contacted: "bg-paper-2 text-ink",
  quoted: "bg-[#E8F0FE] text-[#1A56B8]",
  scheduled: "bg-green text-white",
  won: "bg-forest text-white",
  lost: "bg-paper-2 text-mute-l",
};

export default async function Dashboard() {
  const admin = getAdminClient();
  if (!admin) {
    return (
      <div className="border border-line bg-white p-6">
        <h1 className="h3">Database Not Configured</h1>
        <p className="mt-2 text-mute-l">Add the Supabase environment variables and redeploy.</p>
      </div>
    );
  }

  const now = new Date();
  const today = laParts(now);
  const todayStart = laMidnight(today.y, today.mo, today.d);
  const todayEnd = laMidnight(today.y, today.mo, today.d + 1);
  const weekEnd = laMidnight(today.y, today.mo, today.d + 7);

  const [newLeads, todayJobs, weekJobs, recentLeads, unanswered] = await Promise.all([
    admin.from("gl_leads").select("id", { count: "exact", head: true }).eq("status", "new"),
    admin.from("gl_jobs")
      .select("id,title,starts_at,city,status,job_type,address_line,gl_contacts(first_name,last_name,phone)")
      .gte("starts_at", todayStart.toISOString()).lt("starts_at", todayEnd.toISOString())
      .neq("status", "cancelled").order("starts_at"),
    admin.from("gl_jobs").select("price,status")
      .gte("starts_at", todayStart.toISOString()).lt("starts_at", weekEnd.toISOString())
      .neq("status", "cancelled"),
    admin.from("gl_leads").select("id,name,city,services,status,created_at,phone")
      .order("created_at", { ascending: false }).limit(6),
    admin.from("gl_leads").select("id", { count: "exact", head: true })
      .eq("status", "new").lt("created_at", new Date(Date.now() - 4 * 3600_000).toISOString()),
  ]);

  const weekValue = (weekJobs.data ?? []).reduce((s, j) => s + (Number(j.price) || 0), 0);
  const jobs = todayJobs.data ?? [];
  const stale = unanswered.count ?? 0;

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="h2">Today</h1>
        <p className="text-mute-l">
          {now.toLocaleDateString("en-US", { timeZone: LA_TZ, weekday: "long", month: "long", day: "numeric" })}
        </p>
      </div>

      {stale > 0 && (
        <Link href="/admin/leads?status=new" className="mt-4 block border-l-4 border-green bg-white p-4">
          <p className="font-bold">
            {stale} Lead{stale > 1 ? "s" : ""} Waiting More Than 4 Hours
          </p>
          <p className="t-sm mt-0.5 text-mute-l">Same-day response is the promise on the site. Tap to open.</p>
        </Link>
      )}

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Link href="/admin/leads?status=new" className="border border-line bg-white p-4 hover:border-green">
          <div className="text-[0.72rem] uppercase tracking-[0.12em] text-mute-l">New Leads</div>
          <div className="mt-1 font-[family-name:var(--font-display)] text-4xl tabular-nums" style={{ fontVariationSettings: '"wdth" 90,"wght" 800' }}>
            {newLeads.count ?? 0}
          </div>
        </Link>
        <Link href="/admin/calendar" className="border border-line bg-white p-4 hover:border-green">
          <div className="text-[0.72rem] uppercase tracking-[0.12em] text-mute-l">Jobs Today</div>
          <div className="mt-1 font-[family-name:var(--font-display)] text-4xl tabular-nums" style={{ fontVariationSettings: '"wdth" 90,"wght" 800' }}>
            {jobs.length}
          </div>
        </Link>
        <div className="border border-line bg-white p-4">
          <div className="text-[0.72rem] uppercase tracking-[0.12em] text-mute-l">Booked This Week</div>
          <div className="mt-1 font-[family-name:var(--font-display)] text-4xl tabular-nums" style={{ fontVariationSettings: '"wdth" 90,"wght" 800' }}>
            ${weekValue.toLocaleString()}
          </div>
        </div>
        <Link href="/admin/contacts/new" className="flex flex-col justify-between border border-line bg-forest p-4 text-white hover:bg-forest-2">
          <div className="text-[0.72rem] uppercase tracking-[0.12em] text-lime-br">Quick Action</div>
          <div className="mt-1 font-bold">Add A Customer &rarr;</div>
        </Link>
      </div>

      {/* today's route */}
      <h2 className="h3 mt-9">Today&rsquo;s Route</h2>
      {jobs.length === 0 ? (
        <p className="mt-2 border border-dashed border-line bg-white p-6 text-center text-mute-l">
          Nothing scheduled today.
        </p>
      ) : (
        <ol className="mt-3 space-y-2">
          {jobs.map((j, i) => {
            const c = j.gl_contacts as unknown as { first_name: string; last_name: string | null; phone: string | null } | null;
            return (
              <li key={j.id} className="border border-line bg-white">
                <div className="flex items-stretch">
                  <div className="flex w-16 flex-none flex-col items-center justify-center border-r border-line bg-paper-2 py-3">
                    <span className="text-[0.7rem] text-mute-l">STOP</span>
                    <span className="font-[family-name:var(--font-display)] text-xl" style={{ fontVariationSettings: '"wght" 800' }}>{i + 1}</span>
                  </div>
                  <div className="flex-1 p-3">
                    <div className="flex flex-wrap items-baseline gap-x-3">
                      <span className="tabular-nums font-bold">{time(j.starts_at)}</span>
                      <Link href={`/admin/jobs/${j.id}`} className="font-semibold text-green">{j.title}</Link>
                      <span className={`ml-auto rounded-sm px-2 py-0.5 text-[0.7rem] font-bold uppercase tracking-wide ${STATUS_TONE[j.status] ?? "bg-paper-2 text-mute-l"}`}>
                        {j.status}
                      </span>
                    </div>
                    <p className="t-sm mt-1 text-mute-l">
                      {[j.address_line, j.city].filter(Boolean).join(", ") || "No Address"}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {c?.phone && (
                        <>
                          <a href={`tel:${c.phone}`} className="rounded-sm bg-green px-3 py-2 text-[0.82rem] font-bold text-white">Call</a>
                          <a href={`sms:${c.phone}`} className="rounded-sm border border-ink px-3 py-2 text-[0.82rem] font-bold">Text</a>
                        </>
                      )}
                      {j.address_line && (
                        <a
                          href={`https://maps.apple.com/?daddr=${encodeURIComponent(`${j.address_line}, ${j.city ?? ""} CA`)}`}
                          className="rounded-sm border border-ink px-3 py-2 text-[0.82rem] font-bold"
                        >
                          Directions
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}

      {/* newest leads */}
      <div className="mt-9 flex items-baseline justify-between">
        <h2 className="h3">Newest Leads</h2>
        <Link href="/admin/leads" className="font-bold text-green">All Leads &rarr;</Link>
      </div>
      {(recentLeads.data?.length ?? 0) === 0 ? (
        <p className="mt-2 border border-dashed border-line bg-white p-6 text-center text-mute-l">
          No leads yet. Estimate requests land here automatically.
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-line border border-line bg-white">
          {recentLeads.data!.map((l) => (
            <li key={l.id}>
              <Link href={`/admin/leads/${l.id}`} className="flex flex-wrap items-center gap-x-3 gap-y-1 p-3.5">
                <span className="font-bold">{l.name}</span>
                <span className="t-sm text-mute-l">{l.city}</span>
                <span className="t-sm ml-auto text-mute-l">{ago(l.created_at)}</span>
                <span className={`rounded-sm px-2 py-0.5 text-[0.7rem] font-bold uppercase ${STATUS_TONE[l.status] ?? ""}`}>{l.status}</span>
                <span className="t-sm w-full text-mute-l">
                  {(l.services ?? []).join(", ")} &middot; {formatDisplay(l.phone)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}