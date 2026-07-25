import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminClient } from "@/lib/supabase-admin";
import { formatDisplay } from "@/lib/phone";
import { formatServices } from "@/lib/services-format";
import { createJob } from "@/app/admin/actions";

export default async function LeadDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = getAdminClient();
  if (!admin) return <p style={{ color: "var(--a-mute)" }}>Database not configured.</p>;

  const { data: lead } = await admin
    .from("gl_leads")
    .select("*, gl_lead_photos(id, storage_path, sort_order)")
    .eq("id", id)
    .maybeSingle();
  if (!lead) notFound();

  const photos: { id: string; url: string }[] = [];
  for (const p of (lead.gl_lead_photos ?? []).sort(
    (a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order
  )) {
    const { data } = await admin.storage.from("lead-photos").createSignedUrl(p.storage_path, 3600);
    if (data) photos.push({ id: p.id, url: data.signedUrl });
  }

  const createJobForLead = createJob.bind(null);

  return (
    <div>
      <nav aria-label="Breadcrumb" className="gladmin-crumb">
        <Link href="/admin/leads">Requests</Link> / {lead.name}
      </nav>

      <div className="gladmin-page-header">
        <div>
          <h1>{lead.name}</h1>
          <p>
            {[lead.address_line, lead.city, lead.zip].filter(Boolean).join(", ") || "No address on file"}
          </p>
        </div>
        <span className={`gladmin-badge-status ${lead.status}`}>{lead.status}</span>
      </div>

      <div className="gladmin-actions" style={{ marginBottom: 20 }}>
        <a href={`tel:${lead.phone}`} className="gladmin-chip primary">Call {formatDisplay(lead.phone)}</a>
        <a href={`sms:${lead.phone}`} className="gladmin-chip">Text</a>
        {lead.email && <a href={`mailto:${lead.email}`} className="gladmin-chip">Email</a>}
      </div>

      {photos.length > 0 && (
        <div style={{ display: "flex", gap: 12, overflowX: "auto", marginBottom: 20, paddingBottom: 4 }}>
          {photos.map((p) => (
            <a key={p.id} href={p.url} target="_blank" rel="noopener" style={{ flex: "none" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url} alt="Lead photo" style={{ height: 176, width: "auto", borderRadius: 8, objectFit: "cover", display: "block" }} loading="lazy" />
            </a>
          ))}
        </div>
      )}

      <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", alignItems: "start" }}>
        <div className="gladmin-card">
          <div className="gladmin-card-header"><h2>Request</h2></div>
          <div className="gladmin-card-body padded">
            <div className="gladmin-field">
              <div className="gladmin-field-label">Services</div>
              <div className="gladmin-field-value">{formatServices(lead.services) || "None listed"}</div>
            </div>
            <div className="gladmin-field">
              <div className="gladmin-field-label">Address</div>
              <div className="gladmin-field-value">{[lead.address_line, lead.city, lead.zip].filter(Boolean).join(", ") || "\u2014"}</div>
            </div>
            {lead.notes && (
              <div className="gladmin-field">
                <div className="gladmin-field-label">Notes</div>
                <div className="gladmin-notes">{lead.notes}</div>
              </div>
            )}
            <div className="gladmin-field">
              <div className="gladmin-field-label">Received</div>
              <div className="gladmin-field-value">{new Date(lead.created_at).toLocaleString("en-US", { timeZone: "America/Los_Angeles" })}</div>
            </div>
            <div className="gladmin-field">
              <div className="gladmin-field-label">SMS Consent</div>
              <div className="gladmin-field-value">{lead.sms_consent ? `Yes, ${new Date(lead.sms_consent_at).toLocaleDateString()}` : "No"}</div>
            </div>
          </div>
        </div>

        <div className="gladmin-card">
          <div className="gladmin-card-header"><h2>Schedule This</h2></div>
          <div className="gladmin-card-body padded">
            <form action={createJobForLead} className="gladmin-form">
              <input type="hidden" name="lead_id" value={lead.id} />
              <input type="hidden" name="contact_id" value={lead.contact_id ?? ""} />
              <input type="hidden" name="address_line" value={lead.address_line ?? ""} />
              <input type="hidden" name="city" value={lead.city ?? ""} />
              <input type="hidden" name="zip" value={lead.zip ?? ""} />
              <input type="hidden" name="services" value={(lead.services ?? []).join(",")} />
              <div>
                <label htmlFor="job-title" className="gladmin-label">Title</label>
                <input id="job-title" name="title" className="gladmin-input" defaultValue={`${(lead.services ?? [])[0] ?? "Job"}: ${lead.name}`} />
              </div>
              <div>
                <label htmlFor="job-type" className="gladmin-label">Type</label>
                <select id="job-type" name="job_type" className="gladmin-select" defaultValue="estimate">
                  <option value="estimate">Estimate Visit</option>
                  <option value="service">Service</option>
                  <option value="followup">Follow Up</option>
                </select>
              </div>
              <div className="gladmin-form-row three">
                <div>
                  <label htmlFor="job-date" className="gladmin-label">Date</label>
                  <input id="job-date" name="date" type="date" className="gladmin-input" required />
                </div>
                <div>
                  <label htmlFor="job-start" className="gladmin-label">Start</label>
                  <input id="job-start" name="start" type="time" className="gladmin-input" defaultValue="09:00" required />
                </div>
                <div>
                  <label htmlFor="job-duration" className="gladmin-label">Minutes</label>
                  <input id="job-duration" name="duration" type="number" className="gladmin-input" defaultValue={60} min={15} step={15} />
                </div>
              </div>
              <div>
                <button type="submit" className="gladmin-btn">Create Job</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}