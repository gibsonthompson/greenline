import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminClient } from "@/lib/supabase-admin";
import { formatDisplay } from "@/lib/phone";
import { formatServices } from "@/lib/services-format";

export default async function ContactDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = getAdminClient();
  if (!admin) return <p style={{ color: "var(--a-mute)" }}>Database not configured.</p>;

  const [{ data: c }, { data: jobs }, { data: leads }] = await Promise.all([
    admin.from("gl_contacts").select("*").eq("id", id).maybeSingle(),
    admin
      .from("gl_jobs")
      .select("id, title, starts_at, status")
      .eq("contact_id", id)
      .order("starts_at", { ascending: false })
      .limit(50),
    admin
      .from("gl_leads")
      .select("id, status, services, created_at")
      .eq("contact_id", id)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);
  if (!c) notFound();

  return (
    <div>
      <nav aria-label="Breadcrumb" className="gladmin-crumb">
        <Link href="/admin/contacts">Customers</Link> / {c.first_name} {c.last_name}
      </nav>

      <div className="gladmin-page-header">
        <div>
          <h1>{c.first_name} {c.last_name}</h1>
          <p style={{ textTransform: "capitalize" }}>
            {c.contact_type}
            {c.is_recurring ? ` \u00b7 ${c.cadence ?? "recurring"}` : ""}
            {c.city ? ` \u00b7 ${c.city}` : ""}
          </p>
        </div>
      </div>

      <div className="gladmin-actions" style={{ marginBottom: 20 }}>
        {c.phone && (
          <>
            <a href={`tel:${c.phone}`} className="gladmin-chip primary">Call {formatDisplay(c.phone)}</a>
            <a href={`sms:${c.phone}`} className="gladmin-chip">Text</a>
          </>
        )}
        {c.email && <a href={`mailto:${c.email}`} className="gladmin-chip">Email</a>}
      </div>

      <div className="gladmin-card">
        <div className="gladmin-card-body padded">
          <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
            <div className="gladmin-field">
              <div className="gladmin-field-label">Address</div>
              <div className="gladmin-field-value">
                {c.address_line ?? "Not set"}{c.city ? `, ${c.city} ${c.zip ?? ""}` : ""}
              </div>
            </div>
            <div className="gladmin-field">
              <div className="gladmin-field-label">Source</div>
              <div className="gladmin-field-value" style={{ textTransform: "capitalize" }}>{c.source ?? "Unknown"}</div>
            </div>
            <div className="gladmin-field">
              <div className="gladmin-field-label">Type</div>
              <div className="gladmin-field-value" style={{ textTransform: "capitalize" }}>{c.contact_type ?? "\u2014"}</div>
            </div>
          </div>
          {c.notes && (
            <div className="gladmin-field" style={{ marginTop: 8 }}>
              <div className="gladmin-field-label">Notes</div>
              <div className="gladmin-notes">{c.notes}</div>
            </div>
          )}
        </div>
      </div>

      <div className="gladmin-card">
        <div className="gladmin-card-header"><h2>Job History</h2></div>
        {(jobs?.length ?? 0) === 0 ? (
          <div className="gladmin-empty">No jobs yet.</div>
        ) : (
          <div className="gladmin-card-body">
            <table className="gladmin-tbl">
              <thead><tr><th>Date</th><th>Job</th><th>Status</th></tr></thead>
              <tbody>
                {jobs!.map((j) => (
                  <tr key={j.id} className="linked">
                    <td style={{ whiteSpace: "nowrap" }}>
                      <Link href={`/admin/jobs/${j.id}`} className="gladmin-row-link">
                        {new Date(j.starts_at).toLocaleDateString("en-US", { timeZone: "America/Los_Angeles", month: "short", day: "numeric", year: "2-digit" })}
                      </Link>
                    </td>
                    <td>{j.title}</td>
                    <td><span className={`gladmin-badge-status ${j.status}`}>{j.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="gladmin-card">
        <div className="gladmin-card-header"><h2>Estimate Requests</h2></div>
        {(leads?.length ?? 0) === 0 ? (
          <div className="gladmin-empty">None on file.</div>
        ) : (
          <div className="gladmin-card-body">
            <table className="gladmin-tbl">
              <thead><tr><th>Date</th><th>Service</th><th>Status</th></tr></thead>
              <tbody>
                {leads!.map((l) => (
                  <tr key={l.id} className="linked">
                    <td style={{ whiteSpace: "nowrap" }}>
                      <Link href={`/admin/leads/${l.id}`} className="gladmin-row-link">
                        {new Date(l.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </Link>
                    </td>
                    <td>{formatServices(l.services) || "\u2014"}</td>
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