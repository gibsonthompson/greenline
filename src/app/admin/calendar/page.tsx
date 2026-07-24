import Link from "next/link";
import { getAdminClient } from "@/lib/supabase-admin";
import {
  addMonths, format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, isSameMonth, isSameDay, parse,
} from "date-fns";

// Jobs are colored by type: estimate lime, service green, followup neutral.
const typeColor: Record<string, string> = {
  estimate: "bg-lime text-ink",
  service: "bg-green text-white",
  followup: "bg-paper-2 text-ink",
};

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ m?: string }>;
}) {
  const { m } = await searchParams;
  const admin = getAdminClient();
  if (!admin) return <p className="text-mute-l">Database not configured.</p>;

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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="h2">{format(monthStart, "MMMM yyyy")}</h1>
        <nav aria-label="Change month" className="flex gap-2">
          <Link href={`/admin/calendar?m=${prev}`} className="rounded-sm border border-ink px-3 py-2 text-sm font-semibold text-ink">
            &larr; {format(addMonths(monthStart, -1), "MMM")}
          </Link>
          <Link href="/admin/calendar" className="rounded-sm border border-ink px-3 py-2 text-sm font-semibold text-ink">
            Today
          </Link>
          <Link href={`/admin/calendar?m=${next}`} className="rounded-sm border border-ink px-3 py-2 text-sm font-semibold text-ink">
            {format(addMonths(monthStart, 1), "MMM")} &rarr;
          </Link>
        </nav>
      </div>

      {/* Desktop month grid */}
      <div className="mt-6 hidden md:block">
        <div className="grid grid-cols-7 border-b border-line pb-2">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div key={d} className="t-label px-2 text-mute-l">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((day) => {
            const key = format(day, "yyyy-MM-dd");
            const dayJobs = jobsByDay.get(key) ?? [];
            const today = isSameDay(day, new Date());
            return (
              <div
                key={key}
                className={`min-h-[104px] border-b border-r border-line p-1.5 ${
                  isSameMonth(day, monthStart) ? "" : "opacity-40"
                }`}
              >
                <span className={`t-data inline-block px-1 ${today ? "bg-green text-white" : ""}`}>
                  {format(day, "d")}
                </span>
                <ul className="mt-1 space-y-1">
                  {dayJobs.map((j) => (
                    <li key={j.id}>
                      <Link
                        href={`/admin/jobs/${j.id}`}
                        className={`block truncate rounded-sm px-1.5 py-0.5 text-[0.78rem] font-medium ${
                          j.status === "cancelled" ? "bg-paper-2 line-through" : typeColor[j.job_type] ?? typeColor.service
                        }`}
                      >
                        {new Date(j.starts_at).toLocaleTimeString("en-US", {
                          timeZone: "America/Los_Angeles",
                          hour: "numeric",
                        })}{" "}
                        {j.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile agenda: tap to edit rather than drag */}
      <ul className="mt-6 space-y-4 md:hidden">
        {days
          .filter((d) => isSameMonth(d, monthStart) && (jobsByDay.get(format(d, "yyyy-MM-dd"))?.length ?? 0) > 0)
          .map((day) => {
            const key = format(day, "yyyy-MM-dd");
            return (
              <li key={key}>
                <h2 className="t-label text-mute-l">{format(day, "EEEE, MMM d")}</h2>
                <ul className="mt-1 divide-y divide-line">
                  {(jobsByDay.get(key) ?? []).map((j) => (
                    <li key={j.id}>
                      <Link href={`/admin/jobs/${j.id}`} className="flex items-baseline gap-3 py-2.5">
                        <span className="t-data w-20 shrink-0">
                          {new Date(j.starts_at).toLocaleTimeString("en-US", {
                            timeZone: "America/Los_Angeles",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </span>
                        <span className={j.status === "cancelled" ? "line-through" : "font-medium"}>
                          {j.title}
                        </span>
                        <span className="ml-auto text-[0.85rem] text-mute-l">{j.city}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
      </ul>

      <p className="mt-8 text-[0.9rem] text-mute-l">
        <span className="mr-4 inline-flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-sm bg-lime" /> Estimate</span>
        <span className="mr-4 inline-flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-sm bg-green" /> Service</span>
        <span className="inline-flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-sm border border-line bg-paper-2" /> Follow Up</span>
      </p>
    </div>
  );
}
