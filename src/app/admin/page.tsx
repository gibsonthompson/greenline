export const dynamic = "force-dynamic";

import Link from "next/link";
import { getAdminClient } from "@/lib/supabase-admin";

export default async function Dashboard() {
  const admin = getAdminClient();
  if (!admin) {
    return <p className="text-ink-60">Database not configured. See the README.</p>;
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const weekEnd = new Date(todayStart.getTime() + 7 * 86400_000);

  const [{ count: newLeads }, jobsToday, weekJobs, { data: sms }] = await Promise.all([
    admin.from("gl_leads").select("id", { count: "exact", head: true }).eq("status", "new"),
    admin
      .from("gl_jobs")
      .select("id, title, starts_at, city, status")
      .gte("starts_at", todayStart.toISOString())
      .lt("starts_at", new Date(todayStart.getTime() + 86400_000).toISOString())
      .neq("status", "cancelled")
      .order("starts_at"),
    admin
      .from("gl_jobs")
      .select("price")
      .gte("starts_at", todayStart.toISOString())
      .lt("starts_at", weekEnd.toISOString())
      .neq("status", "cancelled"),
    admin
      .from("gl_sms_log")
      .select("direction, to_number, from_number, body, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const weekRevenue = (weekJobs.data ?? []).reduce((s, j) => s + (Number(j.price) || 0), 0);
  const fmtTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("en-US", {
      timeZone: "America/Los_Angeles",
      hour: "numeric",
      minute: "2-digit",
    });

  return (
    <div>
      <h1 className="t-display-md">Dashboard</h1>

      <dl className="mt-6 grid gap-px overflow-hidden rounded-md bg-concrete-30 sm:grid-cols-3">
        {[
          { label: "New leads", value: String(newLeads ?? 0), href: "/admin/leads?status=new" },
          { label: "Jobs today", value: String(jobsToday.data?.length ?? 0), href: "/admin/calendar" },
          {
            label: "Scheduled this week",
            value: `$${weekRevenue.toLocaleString()}`,
            href: "/admin/calendar",
          },
        ].map((s) => (
          <Link key={s.label} href={s.href} className="bg-concrete-00 p-5 hover:bg-concrete-10">
            <dt className="t-label text-ink-60">{s.label}</dt>
            <dd className="t-data mt-1 text-3xl">{s.value}</dd>
          </Link>
        ))}
      </dl>

      <h2 className="t-display-sm mt-10">Today</h2>
      {(jobsToday.data?.length ?? 0) === 0 ? (
        <p className="mt-2 text-ink-60">Nothing scheduled today.</p>
      ) : (
        <ul className="mt-3 divide-y divide-concrete-30">
          {jobsToday.data!.map((j) => (
            <li key={j.id}>
              <Link href={`/admin/jobs/${j.id}`} className="flex items-baseline gap-4 py-3">
                <span className="t-data w-20 shrink-0">{fmtTime(j.starts_at)}</span>
                <span className="font-medium">{j.title}</span>
                <span className="text-ink-60">{j.city}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <h2 className="t-display-sm mt-10">Recent messages</h2>
      {(sms?.length ?? 0) === 0 ? (
        <p className="mt-2 text-ink-60">No messages yet.</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {sms!.map((m, i) => (
            <li key={i} className="rounded-sm bg-concrete-00 p-3 text-[0.95rem]">
              <span className="t-label mr-2 text-ink-60">
                {m.direction === "inbound" ? `from ${m.from_number}` : `to ${m.to_number}`}
              </span>
              <span className="whitespace-pre-line">{m.body}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
