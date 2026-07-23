import Link from "next/link";
import { getAdminClient } from "@/lib/supabase-admin";

const STATUSES = ["all", "new", "contacted", "quoted", "scheduled", "won", "lost"] as const;

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status = "all" } = await searchParams;
  const admin = getAdminClient();
  if (!admin) return <p className="text-ink-60">Database not configured.</p>;

  let q = admin
    .from("gl_leads")
    .select("id, name, city, services, status, created_at, out_of_area")
    .order("created_at", { ascending: false })
    .limit(200);
  if (status !== "all") q = q.eq("status", status);
  const { data: leads } = await q;

  return (
    <div>
      <h1 className="t-display-md">Leads</h1>

      <nav aria-label="Filter by status" className="mt-4 flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={s === "all" ? "/admin/leads" : `/admin/leads?status=${s}`}
            aria-current={status === s ? "page" : undefined}
            className={`rounded-sm border-[1.5px] px-3 py-1.5 text-[0.9rem] font-medium capitalize ${
              status === s
                ? "border-turf-fill bg-turf-fill text-white"
                : "border-concrete-30 bg-concrete-00 text-ink"
            }`}
          >
            {s}
          </Link>
        ))}
      </nav>

      {(leads?.length ?? 0) === 0 ? (
        <p className="mt-8 text-ink-60">
          No leads {status !== "all" ? `with status ${status}` : "yet"}. New estimate requests
          land here automatically.
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-concrete-30">
          {leads!.map((l) => (
            <li key={l.id}>
              <Link href={`/admin/leads/${l.id}`} className="grid gap-1 py-4 sm:grid-cols-[1fr_auto] sm:items-center">
                <span>
                  <span className="font-semibold">{l.name}</span>
                  <span className="ml-3 text-ink-60">{l.city}</span>
                  {l.out_of_area && (
                    <span className="t-label ml-3 text-turf-ink">out of area</span>
                  )}
                  <span className="mt-0.5 block text-[0.9rem] text-ink-60">
                    {(l.services ?? []).join(", ")}
                  </span>
                </span>
                <span className="flex items-center gap-4">
                  <span className="t-body-sm text-ink-60">
                    {new Date(l.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="t-label rounded-sm bg-concrete-20 px-2 py-1 capitalize">
                    {l.status}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
