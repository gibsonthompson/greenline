import Link from "next/link";
import { getAdminClient } from "@/lib/supabase-admin";
import {
  addMonths, format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, isSameMonth, isSameDay, parse,
} from "date-fns";

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ m?: string }>;
}) {
  const { m } = await searchParams;
  const admin = getAdminClient();
  if (!admin) return <p style={{ color: "var(--a-mute)" }}>Database not configured.</p>;

  const anchor = m ? parse(m, "yyyy-MM", new Date()) : new Date();
  const monthStart = startOfMonth(anchor);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(endOfMonth(anchor), { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const { data: jobs } = await admin
    .from("gl_jobs")
    .select("id, title, starts_at, status, job_type, city")
    .gte("starts_at", gridStart.toISOString())
    .lte("starts_at", new Date(gridEnd.getTime() + 86400_000).toISOString())
    .order("starts_at");

  const laDay = (iso: string) =>
    new Date(iso).toLocaleDateString("en-CA", { timeZone: "America/Los_Angeles" });
  const jobsByDay = new Map<string, NonNullable<typeof jobs>>();
  for (const j of jobs ?? []) {
    const key = laDay(j.starts_at);
    jobsByDay.set(key, [...(jobsByDay.get(key) ?? []), j]);
  }

  const prev = format(addMonths(monthStart, -1), "yyyy-MM");
  const next = format(addMonths(monthStart, 1), "yyyy-MM");

  return (
    <div>
      <div className="gladmin-page-header">
        <div><h1>{format(monthStart, "MMMM yyyy")}</h1></div>
        <nav aria-label="Change month" className="gladmin-cal-nav">
          <Link href={`/admin/calendar?m=${prev}`} className="gladmin-pill">&larr; {format(addMonths(monthStart, -1), "MMM")}</Link>
          <Link href="/admin/calendar" className="gladmin-pill active">Today</Link>
          <Link href={`/admin/calendar?m=${next}`} className="gladmin-pill">{format(addMonths(monthStart, 1), "MMM")} &rarr;</Link>
        </nav>
      </div>

      {/* Desktop month grid */}
      <div style={{ display: "none" }} className="gladmin-cal-desktop">
        <div className="gladmin-cal-grid">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div key={d} className="gladmin-cal-head">{d}</div>
          ))}
          {days.map((day) => {
            const key = format(day, "yyyy-MM-dd");
            const dayJobs = jobsByDay.get(key) ?? [];
            const today = isSameDay(day, new Date());
            return (
              <div key={key} className={`gladmin-cal-cell${isSameMonth(day, monthStart) ? "" : " dim"}`}>
                <span className={`gladmin-cal-date${today ? " today" : ""}`}>{format(day, "d")}</span>
                {dayJobs.map((j) => (
                  <Link
                    key={j.id}
                    href={`/admin/jobs/${j.id}`}
                    className={`gladmin-cal-event ${j.status === "cancelled" ? "cancelled" : j.job_type}`}
                  >
                    {new Date(j.starts_at).toLocaleTimeString("en-US", { timeZone: "America/Los_Angeles", hour: "numeric" })} {j.title}
                  </Link>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile agenda */}
      <div className="gladmin-cal-mobile" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {days
          .filter((d) => isSameMonth(d, monthStart) && (jobsByDay.get(format(d, "yyyy-MM-dd"))?.length ?? 0) > 0)
          .map((day) => {
            const key = format(day, "yyyy-MM-dd");
            return (
              <div key={key} className="gladmin-card">
                <div className="gladmin-card-header"><h3>{format(day, "EEEE, MMM d")}</h3></div>
                <div className="gladmin-card-body">
                  <table className="gladmin-tbl">
                    <tbody>
                      {(jobsByDay.get(key) ?? []).map((j) => (
                        <tr key={j.id} className="linked">
                          <td style={{ whiteSpace: "nowrap", width: 90 }}>
                            <Link href={`/admin/jobs/${j.id}`} className="gladmin-row-link">
                              {new Date(j.starts_at).toLocaleTimeString("en-US", { timeZone: "America/Los_Angeles", hour: "numeric", minute: "2-digit" })}
                            </Link>
                          </td>
                          <td className={j.status === "cancelled" ? "" : "gladmin-cell-primary"} style={j.status === "cancelled" ? { textDecoration: "line-through", color: "var(--a-mute-2)" } : undefined}>
                            {j.title}
                          </td>
                          <td style={{ textAlign: "right", color: "var(--a-mute)" }}>{j.city}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
      </div>

      <div style={{ marginTop: 24, fontSize: 13, color: "var(--a-mute)", display: "flex", flexWrap: "wrap", gap: 16 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: "var(--a-amber)" }} /> Estimate</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: "var(--a-green)" }} /> Service</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: "var(--a-mute-2)" }} /> Follow Up</span>
      </div>
    </div>
  );
}
