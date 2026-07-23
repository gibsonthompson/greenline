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
  if (!admin) return <p className="text-ink-60">Database not configured.</p>;

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

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="t-display-md">Contacts</h1>
        <Link href="/admin/contacts/new" className="btn btn-fill">
          Add contact
        </Link>
      </div>

      <form className="mt-4 max-w-sm" action="/admin/contacts" method="get">
        <label htmlFor="q" className="sr-only">
          Search contacts
        </label>
        <input
          id="q"
          name="q"
          className="field"
          placeholder="Search name, phone, or city"
          defaultValue={q}
        />
      </form>

      {(contacts?.length ?? 0) === 0 ? (
        <p className="mt-8 text-ink-60">
          {q ? "No contacts match that search." : "No contacts yet. Website leads create them automatically, or add one."}
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-concrete-30">
          {contacts!.map((c) => (
            <li key={c.id}>
              <Link href={`/admin/contacts/${c.id}`} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-3">
                <span className="font-semibold">
                  {c.first_name} {c.last_name}
                </span>
                <span className="t-data text-ink-60">{c.phone ? formatDisplay(c.phone) : ""}</span>
                <span className="text-ink-60">{c.city}</span>
                {c.is_recurring && (
                  <span className="t-label rounded-sm bg-turf-fill px-2 py-0.5 text-white">
                    {c.cadence ?? "recurring"}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
