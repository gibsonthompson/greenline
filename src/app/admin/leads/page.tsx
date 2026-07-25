import Link from "next/link";
import { getAdminClient } from "@/lib/supabase-admin";
import { formatDisplay } from "@/lib/phone";
import { formatServices } from "@/lib/services-format";

const STATUSES = ["all", "new", "contacted", "quoted", "scheduled", "won", "lost"] as const;

function ago(iso: string): string {
  const min = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day === 1) return "yesterday";
  if (day < 7) return `${day}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status = "all" } = await searchParams;
  const admin = getAdminClient();
  if (!admin) return <p style={{ color: "var(--a-mute)" }}>Database not configured.</p>;

  let q = admin
    .from("gl_leads")
    .select("id, name, phone, city, services, status, created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  if (status !== "all") q = q.eq("status", status);
  const { data: leads } = await q;

  const newCount = (leads ?? []).filter((l) => l.status === "new").length;

  return (
    <div>
      <div className="gladmin-page-header">
        <div>
          <h1>Requests</h1>
          <p>{leads?.length ?? 0} shown{newCount > 0 ? ` \u00b7 ${newCount} new` : ""}</p>
        </div>
      </div>

      <nav aria-label="Filter by status" className="gladmin-pills">
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={s === "all" ? "/admin/leads" : `/admin/leads?status=${s}`}
            aria-current={status === s ? "page" : undefined}
            className={`gladmin-pill${status === s ? " active" : ""}`}
          >
            {s}
          </Link>
        ))}
      </nav>

      {(leads?.length ?? 0) === 0 ? (
        <div className="gladmin-card">
          <div className="gladmin-empty">
            No requests {status !== "all" ? `with status ${status}` : "yet"}. New estimate requests land here automatically.
          </div>
        </div>
      ) : (
        <div className="gladmin-card">
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
                {leads!.map((l) => {
                  const stale = l.status === "new" && Date.now() - new Date(l.created_at).getTime() > 4 * 3600_000;
                  return (
                    <tr key={l.id} className="linked">
                      <td style={stale ? { boxShadow: "inset 3px 0 0 var(--a-green)" } : undefined}>
                        <Link href={`/admin/leads/${l.id}`} className="gladmin-row-link">
                          <div className="gladmin-cell-primary">{l.name}</div>
                          <div className="gladmin-cell-secondary">{formatDisplay(l.phone)}</div>
                        </Link>
                      </td>
                      <td>{formatServices(l.services) || "\u2014"}</td>
                      <td>{l.city || "\u2014"}</td>
                      <td style={{ whiteSpace: "nowrap" }}>
                        {ago(l.created_at)}
                        {stale && <div style={{ fontSize: 11, fontWeight: 700, color: "var(--a-green)" }}>No reply yet</div>}
                      </td>
                      <td><span className={`gladmin-badge-status ${l.status}`}>{l.status}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
