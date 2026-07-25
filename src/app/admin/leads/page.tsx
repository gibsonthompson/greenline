import Link from "next/link";
import { getAdminClient } from "@/lib/supabase-admin";
import { formatDisplay } from "@/lib/phone";
import { formatServices } from "@/lib/services-format";

const STATUSES = ["all", "new", "contacted", "quoted", "scheduled", "won", "lost"] as const;

// Same tones the dashboard uses, so a lead looks identical in both places.
const STATUS_TONE: Record<string, string> = {
  new: "bg-lime text-ink",
  contacted: "bg-paper-2 text-ink",
  quoted: "bg-[#E8F0FE] text-[#1A56B8]",
  scheduled: "bg-green text-white",
  won: "bg-forest text-white",
  lost: "bg-paper-2 text-mute-l",
};

// Age in plain words. Same-day response is the promise, so age is the signal.
function ago(iso: string): string {
  const min = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day === 1) return "yesterday";
  if (day < 7) return `${day}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status = "all" } = await searchParams;
  const admin = getAdminClient();
  if (!admin) return <p className="text-mute-l">Database not configured.</p>;

  let q = admin
    .from("gl_leads")
    .select("id, name, phone, city, services, status, created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  if (status !== "all") q = q.eq("status", status);
  const { data: leads } = await q;

  const newCount = (leads ?? []).filter((l) => l.status === "new").length;

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="h2">Leads</h1>
        {status === "all" && newCount > 0 && (
          <span className="rounded-sm bg-green px-2 py-1 text-[0.7rem] font-bold uppercase tracking-wide text-white">
            {newCount} New
          </span>
        )}
      </div>

      <nav aria-label="Filter by status" className="mt-4 flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={s === "all" ? "/admin/leads" : `/admin/leads?status=${s}`}
            aria-current={status === s ? "page" : undefined}
            className={`rounded-sm border-[1.5px] px-3 py-1.5 text-[0.9rem] font-medium capitalize ${
              status === s ? "border-green bg-green text-white" : "border-line bg-white text-ink"
            }`}
          >
            {s}
          </Link>
        ))}
      </nav>

      {(leads?.length ?? 0) === 0 ? (
        <p className="mt-8 text-mute-l">
          No leads {status !== "all" ? `with status ${status}` : "yet"}. New estimate requests land here automatically.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {leads!.map((l) => {
            const stale = l.status === "new" && Date.now() - new Date(l.created_at).getTime() > 4 * 3600_000;
            return (
              <li key={l.id} className={`border border-line bg-white ${stale ? "border-l-4 border-l-green" : ""}`}>
                <Link href={`/admin/leads/${l.id}`} className="block px-4 pb-2 pt-3.5">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-bold">{l.name}</span>
                    <span className={`shrink-0 rounded-sm px-2 py-0.5 text-[0.7rem] font-bold uppercase tracking-wide ${STATUS_TONE[l.status] ?? "bg-paper-2 text-mute-l"}`}>
                      {l.status}
                    </span>
                  </div>
                  <p className="mt-0.5 t-sm text-mute-l">{formatServices(l.services) || "No Services Listed"}</p>
                  <p className="mt-1 flex flex-wrap items-center gap-x-2 text-[0.85rem] text-mute-l">
                    <span>{l.city || "No city"}</span>
                    <span aria-hidden>&middot;</span>
                    <span>{ago(l.created_at)}</span>
                    {stale && <span className="font-bold text-green">&middot; No Reply Yet</span>}
                  </p>
                </Link>
                {l.phone && (
                  <div className="flex gap-2 border-t border-line px-4 py-2.5">
                    <a href={`tel:${l.phone}`} className="inline-flex flex-1 items-center justify-center rounded-sm bg-green px-3 py-2.5 text-sm font-bold text-white">
                      Call {formatDisplay(l.phone)}
                    </a>
                    <a href={`sms:${l.phone}`} className="inline-flex items-center justify-center rounded-sm border border-ink px-4 py-2.5 text-sm font-bold text-ink">
                      Text
                    </a>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
