import "server-only";

// RFC 5545 iCalendar generation.
// The rules that are usually skipped are the ones that matter:
//  - lines fold at 75 octets with CRLF + single leading space
//  - TEXT values escape backslash, semicolon, comma; newlines become \n
//  - line endings are CRLF throughout
//  - cancelled events stay in the feed as STATUS:CANCELLED, never deleted
// See build spec section 12.1.

export type IcsJob = {
  id: string;
  ics_uid: string;
  ics_sequence: number;
  last_modified: string;
  title: string;
  starts_at: string;
  ends_at: string;
  status: string;
  address_line: string | null;
  city: string | null;
  zip: string | null;
  notes: string | null;
  services: string[] | null;
  contact_name?: string | null;
  contact_phone?: string | null;
};

const CRLF = "\r\n";

function escapeText(v: string): string {
  return v
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

// Fold at 75 octets, measured in UTF-8 bytes, continuation prefixed
// with one space. Splitting inside a multibyte sequence corrupts the
// character, so we accumulate encoded bytes per code point.
function fold(line: string): string {
  const enc = new TextEncoder();
  const out: string[] = [];
  let cur = "";
  let curBytes = 0;
  const limit = 75;
  for (const ch of line) {
    const b = enc.encode(ch).length;
    const max = out.length === 0 ? limit : limit - 1; // continuations lose 1 to the leading space
    if (curBytes + b > max) {
      out.push(cur);
      cur = ch;
      curBytes = b;
    } else {
      cur += ch;
      curBytes += b;
    }
  }
  out.push(cur);
  return out.map((l, i) => (i === 0 ? l : " " + l)).join(CRLF);
}

function utcStamp(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

// Format a UTC instant as local wall-clock time in America/Los_Angeles
// for use with DTSTART;TZID=... The VTIMEZONE block below defines the
// offsets, so the value must be local time, not UTC.
function laLocal(iso: string): string {
  const d = new Date(iso);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  const hour = get("hour") === "24" ? "00" : get("hour");
  return `${get("year")}${get("month")}${get("day")}T${hour}${get("minute")}${get("second")}`;
}

const VTIMEZONE = [
  "BEGIN:VTIMEZONE",
  "TZID:America/Los_Angeles",
  "BEGIN:DAYLIGHT",
  "TZOFFSETFROM:-0800",
  "TZOFFSETTO:-0700",
  "TZNAME:PDT",
  "DTSTART:19700308T020000",
  "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU",
  "END:DAYLIGHT",
  "BEGIN:STANDARD",
  "TZOFFSETFROM:-0700",
  "TZOFFSETTO:-0800",
  "TZNAME:PST",
  "DTSTART:19701101T020000",
  "RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU",
  "END:STANDARD",
  "END:VTIMEZONE",
];

function vevent(job: IcsJob, siteUrl: string): string[] {
  const cancelled = job.status === "cancelled";
  const location = [job.address_line, job.city ? `${job.city}, CA ${job.zip ?? ""}`.trim() : null]
    .filter(Boolean)
    .join(", ");
  const descLines = [
    job.contact_name ?? "",
    job.contact_phone ?? "",
    "",
    (job.services ?? []).join(", "),
    "",
    job.notes ?? "",
  ]
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const lines = [
    "BEGIN:VEVENT",
    `UID:${job.ics_uid}@greenlinelawncare.com`,
    `SEQUENCE:${job.ics_sequence}`,
    `DTSTAMP:${utcStamp(new Date())}`,
    `LAST-MODIFIED:${utcStamp(new Date(job.last_modified))}`,
    `DTSTART;TZID=America/Los_Angeles:${laLocal(job.starts_at)}`,
    `DTEND;TZID=America/Los_Angeles:${laLocal(job.ends_at)}`,
    `SUMMARY:${escapeText(cancelled ? `CANCELLED: ${job.title}` : job.title)}`,
  ];
  if (location) lines.push(`LOCATION:${escapeText(location)}`);
  if (descLines) lines.push(`DESCRIPTION:${escapeText(descLines)}`);
  lines.push(`STATUS:${cancelled ? "CANCELLED" : "CONFIRMED"}`);
  lines.push(`URL:${siteUrl}/admin/jobs/${job.id}`);
  if (!cancelled) {
    lines.push(
      "BEGIN:VALARM",
      "TRIGGER:-PT60M",
      "ACTION:DISPLAY",
      `DESCRIPTION:${escapeText(job.title)}`,
      "END:VALARM"
    );
  }
  lines.push("END:VEVENT");
  return lines;
}

export function buildCalendar(jobs: IcsJob[], siteUrl: string): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Green Line Lawn Care//Jobs//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Green Line Jobs",
    "X-WR-CALDESC:Scheduled jobs and estimates",
    "X-WR-TIMEZONE:America/Los_Angeles",
    "X-PUBLISHED-TTL:PT1H",
    "REFRESH-INTERVAL;VALUE=DURATION:PT1H",
    ...VTIMEZONE,
  ];
  for (const job of jobs) lines.push(...vevent(job, siteUrl));
  lines.push("END:VCALENDAR");
  return lines.map(fold).join(CRLF) + CRLF;
}

export function buildSingleEvent(job: IcsJob, siteUrl: string): string {
  return buildCalendar([job], siteUrl);
}
