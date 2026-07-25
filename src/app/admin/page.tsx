export const dynamic = "force-dynamic";

import Link from "next/link";
import { getAdminClient } from "@/lib/supabase-admin";
import { formatDisplay } from "@/lib/phone";
import { formatServices } from "@/lib/services-format";

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

const laOffsetMs = (d: Date): number => {
  const p = laParts(d);
  return Date.UTC(p.y, p.mo - 1, p.d, p.h, p.mi, p.s) - Math.floor(d.getTime() / 1000) * 1000;
};

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

export default async function Dashboard() {
  const admin = getAdminClient();
  if (!admin) {
    return (
      <div className="gladmin-card">
        <div className="gladmin-card-body padded">
          <h1 className="gladmin-page-header" style={{ marginBottom: 4 }}>Database not configured</h1>
          <p style={{ color: "var(--a-mute)" }}>Add the Supabase environment variables and redeploy.</p>
        </div>
      </div>
    );
  }

  const now = new Date();
  const today = laParts(now);
  const todayStart = laMidnight(today.y, today.mo, today.d);
  const todayEnd = laMidnight(today.y, today.mo, today.d + 1);

  const [newLeads, todayJobs, recentLeads, unanswered] = await Promise.all([
    admin.from("gl_leads").select("id", { count: "exact", head: true }).eq("status", "new"),
    admin.from("gl_jobs")
      .select("id,title,starts_at,city,status,job_type,address_line,gl_contacts(first_name,last_name,phone)")
      .gte("starts_at", todayStart.toISOString()).lt("starts_at", todayEnd.toISOString())
      .neq("status", "cancelled").order("starts_at"),
    admin.from("gl_leads").select("id,name,city,services,status,created_at,phone")
      .order("created_at", { ascending: false }).limit(6),
    admin.from("gl_leads").select("id", { count: "exact", head: true })
      .eq("status", "new").lt("created_at", new Date(Date.now() - 4 * 3600_000).toISOString()),
  ]);

  const jobs = todayJobs.data ?? [];
  const stale = unanswered.count ?? 0;
  const nextJob = jobs[0];

  return (
    <div>
      <div className="gladmin-page-header">
        <div>
          <h1>Today</h1>
          <p>{now.toLocaleDateString("en-US", { timeZone: LA_TZ, weekday: "long", month: "long", day: "numeric" })}</p>
        </div>
      </div>

      <div className="gladmin-stats">
        <Link href="/admin/leads?status=new" className="gladmin-stat">
          <div className="gladmin-stat-label">New Requests</div>
          <div className="gladmin-stat-value">{newLeads.count ?? 0}</div>
          <div className="gladmin-stat-meta">
            {stale > 0 ? `${stale} waiting over 4 hours` : "All caught up"}
          </div>
        </Link>
        <Link href="/admin/calendar" className="gladmin-stat">
          <div className="gladmin-stat-label">Jobs Today</div>
          <div className="gladmin-stat-value">{jobs.length}</div>
          <div className="gladmin-stat-meta">
            {nextJob ? `Next at ${time(nextJob.starts_at)}` : "Nothing scheduled"}
          </div>
        </Link>
        <Link href="/admin/contacts/new" className="gladmin-stat accent">
          <div className="gladmin-stat-label">Quick Action</div>
          <div className="gladmin-stat-arrow">Add a customer &rarr;</div>
        </Link>
      </div>

      {stale > 0 && (
        <Link
          href="/admin/leads?status=new"
          className="gladmin-card"
          style={{ display: "block", textDecoration: "none", borderColor: "var(--a-green-tint-line)", marginBottom: 20 }}
        >
          <div className="gladmin-card-body padded" style={{ borderLeft: "3px solid var(--a-green)" }}>
            <div style={{ fontWeight: 700, color: "var(--a-ink)" }}>
              {stale} request{stale > 1 ? "s" : ""} waiting more than 4 hours
            </div>
            <div style={{ fontSize: 13, color: "var(--a-mute)", marginTop: 2 }}>
              Same-day response is the promise on the site. Tap to open.
            </div>
          </div>
        </Link>
      )}

      <div className="gladmin-card">
        <div className="gladmin-card-header">
          <h2>Today&rsquo;s Route</h2>
          <Link href="/admin/calendar" className="gladmin-card-link">Full calendar &rarr;</Link>
        </div>
        {jobs.length === 0 ? (
          <div className="gladmin-empty">Nothing scheduled today.</div>
        ) : (
          <div className="gladmin-card-body padded">
            <ol className="gladmin-route">
              {jobs.map((j, i) => {
                const c = j.gl_contacts as unknown as { first_name: string; last_name: string | null; phone: string | null } | null;
                return (
                  <li key={j.id} className="gladmin-route-item">
                    <div className="gladmin-route-stop">
                      <small>Stop</small>
                      <b>{i + 1}</b>
                    </div>
                    <div className="gladmin-route-body">
                      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: 10 }}>
                        <span style={{ fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{time(j.starts_at)}</span>
                        <Link href={`/admin/jobs/${j.id}`} style={{ fontWeight: 650, color: "var(--a-green)", textDecoration: "none" }}>
                          {j.title}
                        </Link>
                        <span className={`gladmin-badge-status ${j.status}`} style={{ marginLeft: "auto" }}>{j.status}</span>
                      </div>
                      <div style={{ fontSize: 12.5, color: "var(--a-mute)", marginTop: 4 }}>
                        {[j.address_line, j.city].filter(Boolean).join(", ") || "No address"}
                      </div>
                      <div className="gladmin-actions" style={{ marginTop: 10 }}>
                        {c?.phone && (
                          <>
                            <a href={`tel:${c.phone}`} className="gladmin-chip primary">Call</a>
                            <a href={`sms:${c.phone}`} className="gladmin-chip">Text</a>
                          </>
                        )}
                        {j.address_line && (
                          <a
                            href={`https://maps.apple.com/?daddr=${encodeURIComponent(`${j.address_line}, ${j.city ?? ""} CA`)}`}
                            className="gladmin-chip"
                          >
                            Directions
                          </a>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        )}
      </div>

      <div className="gladmin-card">
        <div className="gladmin-card-header">
          <h2>Newest Requests</h2>
          <Link href="/admin/leads" className="gladmin-card-link">All requests &rarr;</Link>
        </div>
        {(recentLeads.data?.length ?? 0) === 0 ? (
          <div className="gladmin-empty">No requests yet. Estimate requests land here automatically.</div>
        ) : (
          <div className="gladmin-card-body">
            <table className="gladmin-tbl">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Service</th>
                  <th>City</th>
                  <th>Age</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.data!.map((l) => (
                  <tr key={l.id} className="linked">
                    <td>
                      <Link href={`/admin/leads/${l.id}`} className="gladmin-row-link">
                        <div className="gladmin-cell-primary">{l.name}</div>
                        <div className="gladmin-cell-secondary">{formatDisplay(l.phone)}</div>
                      </Link>
                    </td>
                    <td>{formatServices(l.services) || "\u2014"}</td>
                    <td>{l.city || "\u2014"}</td>
                    <td style={{ whiteSpace: "nowrap" }}>{ago(l.created_at)}</td>
                    <td><span className={`gladmin-badge-status ${l.status}`}>{l.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
