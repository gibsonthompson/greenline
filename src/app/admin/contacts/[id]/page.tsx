import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminClient } from "@/lib/supabase-admin";
import { formatDisplay } from "@/lib/phone";

// Same job-status tones as the dashboard: only scheduled is colored, the rest
// stay neutral, so history reads calmly and matches every other screen.
const STATUS_TONE: Record<string, string> = {
  new: "bg-lime text-ink",
  contacted: "bg-paper-2 text-ink",
  quoted: "bg-[#E8F0FE] text-[#1A56B8]",
  scheduled: "bg-green text-white",
  won: "bg-forest text-white",
  lost: "bg-paper-2 text-mute-l",
};

export default async function ContactDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = getAdminClient();
  if (!admin) return <p className="text-mute-l">Database not configured.</p>;

  const [{ data: c }, { data: jobs }, { data: leads }] = await Promise.all([
    admin.from("gl_contacts").select("*").eq("id", id).maybeSingle(),
    admin
      .from("gl_jobs")
      .select("id, title, starts_at, status, price")
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

  const totalBilled = (jobs ?? [])
    .filter((j) => j.status === "complete")
    .reduce((s, j) => s + (Number(j.price) || 0), 0);

  return (
    <div>
      <nav aria-label="Breadcrumb" className="t-body-sm text-mute-l">
        <Link href="/admin/contacts" className="text-green underline underline-offset-2">
          Contacts
        </Link>{" "}
        / {c.first_name} {c.last_name}
      </nav>
      <h1 className="h2 mt-2">
        {c.first_name} {c.last_name}
      </h1>
      <p className="mt-1 capitalize text-mute-l">
        {c.contact_type}
        {c.is_recurring ? ` \u00b7 ${c.cadence ?? "recurring"}` : ""}
        {c.city ? ` \u00b7 ${c.city}` : ""}
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        {c.phone && (
          <>
            <a href={`tel:${c.phone}`} className="btn btn-p">
              Call {formatDisplay(c.phone)}
            </a>
            <a href={`sms:${c.phone}`} className="btn btn-ol">
              Text
            </a>
          </>
        )}
        {c.email && (
          <a href={`mailto:${c.email}`} className="btn btn-ol">
            Email
          </a>
        )}
      </div>

      <dl className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="border border-line bg-white p-4">
          <dt className="t-label text-mute-l">Address</dt>
          <dd className="mt-1">
            {c.address_line ?? "not set"}
            {c.city ? `, ${c.city} ${c.zip ?? ""}` : ""}
          </dd>
        </div>
        <div className="border border-line bg-white p-4">
          <dt className="t-label text-mute-l">Total Billed (Complete Jobs)</dt>
          <dd className="t-data mt-1 text-2xl">${totalBilled.toLocaleString()}</dd>
        </div>
        <div className="border border-line bg-white p-4">
          <dt className="t-label text-mute-l">Source</dt>
          <dd className="mt-1 capitalize">{c.source ?? "unknown"}</dd>
        </div>
      </dl>

      {c.notes && (
        <div className="mt-6">
          <h2 className="t-label text-mute-l">Notes</h2>
          <p className="mt-1 max-w-[68ch] whitespace-pre-line">{c.notes}</p>
        </div>
      )}

      <h2 className="h3 mt-10">Job History</h2>
      {(jobs?.length ?? 0) === 0 ? (
        <p className="mt-2 text-mute-l">No jobs yet.</p>
      ) : (
        <ul className="mt-3 divide-y divide-line">
          {jobs!.map((j) => (
            <li key={j.id}>
              <Link href={`/admin/jobs/${j.id}`} className="flex flex-wrap items-baseline gap-4 py-3">
                <span className="t-data w-28 shrink-0">
                  {new Date(j.starts_at).toLocaleDateString("en-US", {
                    timeZone: "America/Los_Angeles",
                    month: "short",
                    day: "numeric",
                    year: "2-digit",
                  })}
                </span>
                <span className="font-medium">{j.title}</span>
                <span className={`rounded-sm px-2 py-0.5 text-[0.7rem] font-bold uppercase tracking-wide ${STATUS_TONE[j.status] ?? "bg-paper-2 text-mute-l"}`}>{j.status}</span>
                {j.price != null && <span className="t-data ml-auto">${Number(j.price).toLocaleString()}</span>}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <h2 className="h3 mt-10">Estimate Requests</h2>
      {(leads?.length ?? 0) === 0 ? (
        <p className="mt-2 text-mute-l">None on file.</p>
      ) : (
        <ul className="mt-3 divide-y divide-line">
          {leads!.map((l) => (
            <li key={l.id}>
              <Link href={`/admin/leads/${l.id}`} className="flex flex-wrap items-baseline gap-4 py-3">
                <span className="t-data w-28 shrink-0">
                  {new Date(l.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
                <span>{(l.services ?? []).join(", ")}</span>
                <span className={`ml-auto rounded-sm px-2 py-0.5 text-[0.7rem] font-bold uppercase tracking-wide ${STATUS_TONE[l.status] ?? "bg-paper-2 text-mute-l"}`}>{l.status}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}