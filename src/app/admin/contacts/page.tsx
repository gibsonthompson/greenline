import Link from "next/link";
import { getAdminClient } from "@/lib/supabase-admin";
import { formatDisplay } from "@/lib/phone";

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const admin = getAdminClient();
  if (!admin) return <p style={{ color: "var(--a-mute)" }}>Database not configured.</p>;

  let query = admin
    .from("gl_contacts")
    .select("id, first_name, last_name, phone, city, is_recurring, cadence, contact_type")
    .eq("archived", false)
    .order("created_at", { ascending: false })
    .limit(300);
  if (q) {
    query = query.or(
      `first_name.ilike.%${q}%,last_name.ilike.%${q}%,phone.ilike.%${q}%,city.ilike.%${q}%`
    );
  }
  const { data: contacts } = await query;

  const recurringCount = (contacts ?? []).filter((c) => c.is_recurring).length;

  return (
    <div>
      <div className="gladmin-page-header">
        <div>
          <h1>Customers</h1>
          <p>
            {contacts?.length ?? 0} shown{!q && recurringCount > 0 ? ` \u00b7 ${recurringCount} recurring` : ""}
          </p>
        </div>
        <Link href="/admin/contacts/new" className="gladmin-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14 M5 12h14" /></svg>
          Add Customer
        </Link>
      </div>

      <form className="gladmin-pills" action="/admin/contacts" method="get" style={{ alignItems: "center" }}>
        <label htmlFor="q" style={{ position: "absolute", left: -9999 }}>Search customers</label>
        <input id="q" name="q" className="gladmin-search" placeholder="Search name, phone, or city" defaultValue={q} />
        <button type="submit" className="gladmin-btn-ghost">Search</button>
        {q && <Link href="/admin/contacts" className="gladmin-pill">Clear</Link>}
      </form>

      {(contacts?.length ?? 0) === 0 ? (
        <div className="gladmin-card">
          <div className="gladmin-empty">
            {q ? "No customers match that search." : "No customers yet. Website leads create them automatically, or add one."}
          </div>
        </div>
      ) : (
        <div className="gladmin-card">
          <div className="gladmin-card-body">
            <table className="gladmin-tbl">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>City</th>
                  <th>Schedule</th>
                </tr>
              </thead>
              <tbody>
                {contacts!.map((c) => (
                  <tr key={c.id} className="linked">
                    <td>
                      <Link href={`/admin/contacts/${c.id}`} className="gladmin-row-link">
                        <div className="gladmin-cell-primary">{c.first_name} {c.last_name}</div>
                        {c.phone && <div className="gladmin-cell-secondary">{formatDisplay(c.phone)}</div>}
                      </Link>
                    </td>
                    <td style={{ textTransform: "capitalize" }}>{c.contact_type ?? "\u2014"}</td>
                    <td>{c.city || "\u2014"}</td>
                    <td>
                      {c.is_recurring
                        ? <span className="gladmin-badge-status scheduled">{c.cadence ?? "recurring"}</span>
                        : <span style={{ color: "var(--a-mute-2)" }}>One time</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
