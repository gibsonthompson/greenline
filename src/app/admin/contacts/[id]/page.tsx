import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminClient } from "@/lib/supabase-admin";
import { formatDisplay } from "@/lib/phone";

export default async function ContactDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = getAdminClient();
  if (!admin) return <p className="text-ink-60">Database not configured.</p>;

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
      <nav aria-label="Breadcrumb" className="t-body-sm text-ink-60">
        <Link href="/admin/contacts" className="text-turf-ink underline underline-offset-2">
          Contacts
        </Link>{" "}
        / {c.first_name} {c.last_name}
      </nav>
      <h1 className="t-display-md mt-2">
        {c.first_name} {c.last_name}
      </h1>
      <p className="mt-1 text-ink-60">
        {c.contact_type}
        {c.is_recurring ? ` \u00b7 ${c.cadence ?? "recurring"}` : ""}
        {c.city ? ` \u00b7 ${c.city}` : ""}
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        {c.phone && (
          <>
            <a href={`tel:${c.phone}`} className="btn btn-fill">
              Call {formatDisplay(c.phone)}
            </a>
            <a href={`sms:${c.phone}`} className="btn btn-ghost-light">
              Text
            </a>
          </>
        )}
        {c.email && (
          <a href={`mailto:${c.email}`} className="btn btn-ghost-light">
            Email
          </a>
        )}
      </div>

      <dl className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="bg-concrete-00 p-4">
          <dt className="t-label text-ink-60">Address</dt>
          <dd className="mt-1">
            {c.address_line ?? "not set"}
            {c.city ? `, ${c.city} ${c.zip ?? ""}` : ""}
          </dd>
        </div>
        <div className="bg-concrete-00 p-4">
          <dt className="t-label text-ink-60">Total billed (complete jobs)</dt>
          <dd className="t-data mt-1 text-2xl">${totalBilled.toLocaleString()}</dd>
        </div>
        <div className="bg-concrete-00 p-4">
          <dt className="t-label text-ink-60">Source</dt>
          <dd className="mt-1 capitalize">{c.source ?? "unknown"}</dd>
        </div>
      </dl>

      {c.notes && (
        <div className="mt-6">
          <h2 className="t-label text-ink-60">Notes</h2>
          <p className="mt-1 max-w-[68ch] whitespace-pre-line">{c.notes}</p>
        </div>
      )}

      <h2 className="t-display-sm mt-10">Job history</h2>
      {(jobs?.length ?? 0) === 0 ? (
        <p className="mt-2 text-ink-60">No jobs yet.</p>
      ) : (
        <ul className="mt-3 divide-y divide-concrete-30">
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
                <span className="t-label rounded-sm bg-concrete-20 px-2 py-0.5 capitalize">{j.status}</span>
                {j.price != null && <span className="t-data ml-auto">${Number(j.price).toLocaleString()}</span>}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <h2 className="t-display-sm mt-10">Estimate requests</h2>
      {(leads?.length ?? 0) === 0 ? (
        <p className="mt-2 text-ink-60">None on file.</p>
      ) : (
        <ul className="mt-3 divide-y divide-concrete-30">
          {leads!.map((l) => (
            <li key={l.id}>
              <Link href={`/admin/leads/${l.id}`} className="flex flex-wrap items-baseline gap-4 py-3">
                <span className="t-data w-28 shrink-0">
                  {new Date(l.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
                <span>{(l.services ?? []).join(", ")}</span>
                <span className="t-label ml-auto rounded-sm bg-concrete-20 px-2 py-0.5 capitalize">{l.status}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
