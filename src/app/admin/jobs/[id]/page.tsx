import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminClient } from "@/lib/supabase-admin";
import { updateJob } from "@/app/admin/actions";

export default async function JobDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = getAdminClient();
  if (!admin) return <p style={{ color: "var(--a-mute)" }}>Database not configured.</p>;

  const { data: j } = await admin
    .from("gl_jobs")
    .select("*, gl_contacts(id, first_name, last_name, phone)")
    .eq("id", id)
    .maybeSingle();
  if (!j) notFound();

  const c = j.gl_contacts as { id: string; first_name: string; last_name: string | null; phone: string | null } | null;
  const la = (iso: string, opts: Intl.DateTimeFormatOptions) =>
    new Date(iso).toLocaleString("en-US", { timeZone: "America/Los_Angeles", ...opts });
  const dateVal = new Date(j.starts_at).toLocaleDateString("en-CA", { timeZone: "America/Los_Angeles" });
  const startVal = la(j.starts_at, { hour: "2-digit", minute: "2-digit", hour12: false });
  const duration = Math.round((new Date(j.ends_at).getTime() - new Date(j.starts_at).getTime()) / 60000);
  const update = updateJob.bind(null, j.id);

  return (
    <div>
      <nav aria-label="Breadcrumb" className="gladmin-crumb">
        <Link href="/admin/calendar">Schedule</Link> / {j.title}
      </nav>

      <div className="gladmin-page-header">
        <div>
          <h1>{j.title}</h1>
          <p>
            {la(j.starts_at, { weekday: "long", month: "long", day: "numeric", hour: "numeric", minute: "2-digit" })}
            {c ? ` \u00b7 ${c.first_name} ${c.last_name ?? ""}` : ""}
          </p>
        </div>
        <span className={`gladmin-badge-status ${j.status}`}>{j.status}</span>
      </div>

      <div className="gladmin-actions" style={{ marginBottom: 8 }}>
        <a href={`/api/calendar/job/${j.id}.ics`} className="gladmin-chip">Add To My Calendar</a>
        {c?.phone && <a href={`tel:${c.phone}`} className="gladmin-chip">Call Customer</a>}
        {c && <Link href={`/admin/contacts/${c.id}`} className="gladmin-chip">Customer</Link>}
      </div>
      <p style={{ fontSize: 12.5, color: "var(--a-mute)", marginBottom: 20, maxWidth: "60ch" }}>
        Edits made here reach the subscribed iPhone calendar automatically within about an hour.
        The download button is for adding a brand-new event only.
      </p>

      <div className="gladmin-card" style={{ maxWidth: 640 }}>
        <div className="gladmin-card-body padded">
          <form action={update} className="gladmin-form">
            <div>
              <label htmlFor="title" className="gladmin-label">Title</label>
              <input id="title" name="title" className="gladmin-input" defaultValue={j.title} />
            </div>
            <div>
              <label htmlFor="status" className="gladmin-label">Status</label>
              <select id="status" name="status" className="gladmin-select" defaultValue={j.status}>
                {["scheduled", "confirmed", "in-progress", "complete", "cancelled", "no-show"].map((s) => (
                  <option key={s} value={s}>
                    {s.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ")}
                  </option>
                ))}
              </select>
            </div>
            <div className="gladmin-form-row three">
              <div>
                <label htmlFor="date" className="gladmin-label">Date</label>
                <input id="date" name="date" type="date" className="gladmin-input" defaultValue={dateVal} />
              </div>
              <div>
                <label htmlFor="start" className="gladmin-label">Start</label>
                <input id="start" name="start" type="time" className="gladmin-input" defaultValue={startVal} />
              </div>
              <div>
                <label htmlFor="duration" className="gladmin-label">Minutes</label>
                <input id="duration" name="duration" type="number" className="gladmin-input" defaultValue={duration} min={15} step={15} />
              </div>
            </div>
            <div>
              <label htmlFor="address_line" className="gladmin-label">Address</label>
              <input id="address_line" name="address_line" className="gladmin-input" defaultValue={j.address_line ?? ""} />
            </div>
            <div>
              <label htmlFor="city" className="gladmin-label">City</label>
              <input id="city" name="city" className="gladmin-input" defaultValue={j.city ?? ""} />
            </div>
            <div>
              <label htmlFor="notes" className="gladmin-label">Notes</label>
              <textarea id="notes" name="notes" className="gladmin-textarea" defaultValue={j.notes ?? ""} />
            </div>
            <div>
              <button type="submit" className="gladmin-btn">Save Changes</button>
            </div>
          </form>
        </div>
      </div>

      <p style={{ fontSize: 12.5, color: "var(--a-mute)", marginTop: 16, maxWidth: "60ch" }}>
        Cancelling keeps the event in the calendar feed marked CANCELLED so it disappears
        correctly from subscribed phones instead of lingering as a ghost.
      </p>
    </div>
  );
}