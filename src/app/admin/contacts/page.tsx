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
  if (!admin) return <p className="text-mute-l">Database not configured.</p>;

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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="h2">Contacts</h1>
        <Link href="/admin/contacts/new" className="btn btn-p btn-inline">
          Add contact
        </Link>
      </div>

      <form className="mt-4 max-w-sm" action="/admin/contacts" method="get">
        <label htmlFor="q" className="sr-only">Search contacts</label>
        <input id="q" name="q" className="field" placeholder="Search name, phone, or city" defaultValue={q} />
      </form>

      {!q && recurringCount > 0 && (
        <p className="mt-3 text-[0.85rem] text-mute-l">
          {recurringCount} recurring {recurringCount === 1 ? "customer" : "customers"}
        </p>
      )}

      {(contacts?.length ?? 0) === 0 ? (
        <p className="mt-8 text-mute-l">
          {q ? "No contacts match that search." : "No contacts yet. Website leads create them automatically, or add one."}
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {contacts!.map((c) => (
            <li key={c.id} className="border border-line bg-white">
              <Link href={`/admin/contacts/${c.id}`} className="block px-4 pb-2 pt-3.5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-bold">{c.first_name} {c.last_name}</span>
                  {c.is_recurring && (
                    <span className="shrink-0 rounded-sm bg-green px-2 py-0.5 text-[0.7rem] font-bold uppercase tracking-wide text-white">
                      {c.cadence ?? "recurring"}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[0.85rem] text-mute-l">
                  <span className="capitalize">{c.contact_type}</span>
                  {c.city && (<><span aria-hidden>&middot;</span><span>{c.city}</span></>)}
                </p>
              </Link>
              {c.phone && (
                <div className="flex gap-2 border-t border-line px-4 py-2.5">
                  <a href={`tel:${c.phone}`} className="inline-flex flex-1 items-center justify-center rounded-sm bg-green px-3 py-2.5 text-sm font-bold text-white">
                    Call {formatDisplay(c.phone)}
                  </a>
                  <a href={`sms:${c.phone}`} className="inline-flex items-center justify-center rounded-sm border border-ink px-4 py-2.5 text-sm font-bold text-ink">
                    Text
                  </a>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
