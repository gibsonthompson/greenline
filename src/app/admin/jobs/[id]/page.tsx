import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminClient } from "@/lib/supabase-admin";
import { updateJob } from "@/app/admin/actions";

export default async function JobDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = getAdminClient();
  if (!admin) return <p className="text-mute-l">Database not configured.</p>;

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
    <div className="max-w-xl">
      <nav aria-label="Breadcrumb" className="t-body-sm text-mute-l">
        <Link href="/admin/calendar" className="text-green underline underline-offset-2">
          Calendar
        </Link>{" "}
        / {j.title}
      </nav>
      <h1 className="h2 mt-2">{j.title}</h1>
      <p className="mt-1 text-mute-l">
        {la(j.starts_at, { weekday: "long", month: "long", day: "numeric", hour: "numeric", minute: "2-digit" })}
        {c ? ` \u00b7 ${c.first_name} ${c.last_name ?? ""}` : ""}
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        <a href={`/api/calendar/job/${j.id}.ics`} className="btn btn-ol">
          Add To My Calendar
        </a>
        {c?.phone && (
          <a href={`tel:${c.phone}`} className="btn btn-ol">
            Call Customer
          </a>
        )}
        {c && (
          <Link href={`/admin/contacts/${c.id}`} className="btn btn-ol">
            Contact
          </Link>
        )}
      </div>
      <p className="mt-2 text-[0.85rem] text-mute-l">
        Edits made here reach the subscribed iPhone calendar automatically within about an hour.
        The download button is for adding a brand-new event only.
      </p>

      <form action={update} className="mt-8 space-y-4">
        <div>
          <label htmlFor="title" className="mb-1 block font-medium">
            Title
          </label>
          <input id="title" name="title" className="field" defaultValue={j.title} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="status" className="mb-1 block font-medium">
              Status
            </label>
            <select id="status" name="status" className="field" defaultValue={j.status}>
              {["scheduled", "confirmed", "in-progress", "complete", "cancelled", "no-show"].map((s) => (
                <option key={s} value={s}>
                  {s.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ")}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="price" className="mb-1 block font-medium">
              Price
            </label>
            <input id="price" name="price" className="field" inputMode="decimal" defaultValue={j.price ?? ""} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label htmlFor="date" className="mb-1 block font-medium">
              Date
            </label>
            <input id="date" name="date" type="date" className="field" defaultValue={dateVal} />
          </div>
          <div>
            <label htmlFor="start" className="mb-1 block font-medium">
              Start
            </label>
            <input id="start" name="start" type="time" className="field" defaultValue={startVal} />
          </div>
          <div>
            <label htmlFor="duration" className="mb-1 block font-medium">
              Minutes
            </label>
            <input id="duration" name="duration" type="number" className="field" defaultValue={duration} min={15} step={15} />
          </div>
        </div>
        <div>
          <label htmlFor="address_line" className="mb-1 block font-medium">
            Address
          </label>
          <input id="address_line" name="address_line" className="field" defaultValue={j.address_line ?? ""} />
        </div>
        <div>
          <label htmlFor="city" className="mb-1 block font-medium">
            City
          </label>
          <input id="city" name="city" className="field" defaultValue={j.city ?? ""} />
        </div>
        <div>
          <label htmlFor="notes" className="mb-1 block font-medium">
            Notes
          </label>
          <textarea id="notes" name="notes" className="field min-h-[96px]" defaultValue={j.notes ?? ""} />
        </div>
        <button type="submit" className="btn btn-p">
          Save Changes
        </button>
      </form>

      <p className="mt-6 text-[0.85rem] text-mute-l">
        Cancelling keeps the event in the calendar feed marked CANCELLED so it disappears
        correctly from subscribed phones instead of lingering as a ghost.
      </p>
    </div>
  );
}