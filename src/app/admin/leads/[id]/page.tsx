import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminClient } from "@/lib/supabase-admin";
import LeadActions from "@/components/admin/LeadActions";
import { formatDisplay } from "@/lib/phone";
import { createJob } from "@/app/admin/actions";

export default async function LeadDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = getAdminClient();
  if (!admin) return <p className="text-ink-60">Database not configured.</p>;

  const { data: lead } = await admin
    .from("gl_leads")
    .select("*, gl_lead_photos(id, storage_path, sort_order)")
    .eq("id", id)
    .maybeSingle();
  if (!lead) notFound();

  // Short-lived signed GETs for the private bucket (spec section 9)
  const photos: { id: string; url: string }[] = [];
  for (const p of (lead.gl_lead_photos ?? []).sort(
    (a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order
  )) {
    const { data } = await admin.storage
      .from("lead-photos")
      .createSignedUrl(p.storage_path, 3600);
    if (data) photos.push({ id: p.id, url: data.signedUrl });
  }

  const today = new Date().toISOString().slice(0, 10);
  const createJobForLead = createJob.bind(null);

  return (
    <div>
      <nav aria-label="Breadcrumb" className="t-body-sm text-ink-60">
        <Link href="/admin/leads" className="text-turf-ink underline underline-offset-2">
          Leads
        </Link>{" "}
        / {lead.name}
      </nav>
      <div className="mt-2 flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="t-display-md">{lead.name}</h1>
        <span className="t-label rounded-sm bg-concrete-20 px-2 py-1 capitalize">{lead.status}</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-3">
        <a href={`tel:${lead.phone}`} className="btn btn-fill">
          Call {formatDisplay(lead.phone)}
        </a>
        <a href={`sms:${lead.phone}`} className="btn btn-ghost-light">
          Text
        </a>
        {lead.email && (
          <a href={`mailto:${lead.email}`} className="btn btn-ghost-light">
            Email
          </a>
        )}
      </div>

      {photos.length > 0 && (
        <div className="-mx-4 mt-6 flex gap-3 overflow-x-auto px-4 pb-2">
          {photos.map((p) => (
            <a key={p.id} href={p.url} target="_blank" rel="noopener" className="shrink-0">
              {/* Signed URLs are short-lived; next/image caching fights them */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.url}
                alt="Lead photo"
                className="h-48 w-auto rounded-sm object-cover"
                loading="lazy"
              />
            </a>
          ))}
        </div>
      )}

      <div className="mt-8 grid gap-10 md:grid-cols-2">
        <div>
          <h2 className="t-display-sm">Request</h2>
          <dl className="mt-3 space-y-3">
            <div>
              <dt className="t-label text-ink-60">Services</dt>
              <dd>{(lead.services ?? []).join(", ")}</dd>
            </div>
            <div>
              <dt className="t-label text-ink-60">Address</dt>
              <dd>
                {lead.address_line}, {lead.city} {lead.zip}
                {lead.out_of_area && <span className="ml-2 text-turf-ink">(out of core area)</span>}
              </dd>
            </div>
            {lead.notes && (
              <div>
                <dt className="t-label text-ink-60">Notes</dt>
                <dd className="whitespace-pre-line">{lead.notes}</dd>
              </div>
            )}
            <div>
              <dt className="t-label text-ink-60">Received</dt>
              <dd>
                {new Date(lead.created_at).toLocaleString("en-US", {
                  timeZone: "America/Los_Angeles",
                })}
              </dd>
            </div>
            <div>
              <dt className="t-label text-ink-60">SMS consent</dt>
              <dd>{lead.sms_consent ? `Yes, ${new Date(lead.sms_consent_at).toLocaleDateString()}` : "No"}</dd>
            </div>
          </dl>
          <div className="mt-6 max-w-sm">
            <LeadActions leadId={lead.id} status={lead.status} quoted={lead.quoted_amount} />
          </div>
        </div>

        <div>
          <h2 className="t-display-sm">Schedule this</h2>
          <form action={createJobForLead} className="mt-3 space-y-4">
            <input type="hidden" name="lead_id" value={lead.id} />
            <input type="hidden" name="contact_id" value={lead.contact_id ?? ""} />
            <input type="hidden" name="address_line" value={lead.address_line ?? ""} />
            <input type="hidden" name="city" value={lead.city ?? ""} />
            <input type="hidden" name="zip" value={lead.zip ?? ""} />
            <input type="hidden" name="services" value={(lead.services ?? []).join(",")} />
            <div>
              <label htmlFor="job-title" className="mb-1 block font-medium">
                Title
              </label>
              <input
                id="job-title"
                name="title"
                className="field"
                defaultValue={`${(lead.services ?? [])[0] ?? "Job"}: ${lead.name}`}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="job-type" className="mb-1 block font-medium">
                  Type
                </label>
                <select id="job-type" name="job_type" className="field" defaultValue="estimate">
                  <option value="estimate">Estimate visit</option>
                  <option value="service">Service</option>
                  <option value="followup">Follow up</option>
                </select>
              </div>
              <div>
                <label htmlFor="job-price" className="mb-1 block font-medium">
                  Price
                </label>
                <input id="job-price" name="price" className="field" inputMode="decimal" defaultValue={lead.quoted_amount ?? ""} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label htmlFor="job-date" className="mb-1 block font-medium">
                  Date
                </label>
                <input id="job-date" name="date" type="date" className="field" required />
              </div>
              <div>
                <label htmlFor="job-start" className="mb-1 block font-medium">
                  Start
                </label>
                <input id="job-start" name="start" type="time" className="field" defaultValue="09:00" required />
              </div>
              <div>
                <label htmlFor="job-duration" className="mb-1 block font-medium">
                  Minutes
                </label>
                <input id="job-duration" name="duration" type="number" className="field" defaultValue={60} min={15} step={15} />
              </div>
            </div>
            <button type="submit" className="btn btn-fill">
              Create job
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
