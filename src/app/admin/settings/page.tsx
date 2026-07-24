export const dynamic = "force-dynamic";

import { SITE } from "@/data/site";
import { getAdminClient } from "@/lib/supabase-admin";
import { ensureCalendarFeed, regenerateCalendarFeed } from "@/app/admin/actions";
import { CORE_ZIPS } from "@/data/service-zips";
import CopyField from "@/components/admin/CopyField";
import AccountControls from "@/components/admin/AccountControls";

export default async function SettingsPage() {
  const admin = getAdminClient();
  if (!admin) return <p className="text-mute-l">Database not configured.</p>;

  const token = await ensureCalendarFeed();
  const httpsUrl = `${SITE.url}/api/calendar/${token}.ics`;
  const webcalUrl = httpsUrl.replace(/^https?:/, "webcal:");

  const { data: feed } = await admin
    .from("gl_calendar_feeds")
    .select("last_fetched, fetch_count")
    .eq("token", token)
    .maybeSingle();

  return (
    <div className="max-w-2xl">
      <h1 className="h2">Settings</h1>

      <h2 className="h3 mt-8">Calendar on your iPhone</h2>
      <p className="mt-2 text-mute-l">
        Subscribe once and every job appears in Apple Calendar on your phone, Mac, and iPad.
        Changes propagate automatically, about hourly. Treat these links like a password.
      </p>
      <div className="mt-4 space-y-3">
        <CopyField label="Tap this on your iPhone" value={webcalUrl} />
        <CopyField label="Or subscribe by URL (Mac: File, New Calendar Subscription)" value={httpsUrl} />
      </div>
      <p className="mt-3 text-[0.9rem] text-mute-l">
        Want faster than hourly on the Mac? Get Info on the subscribed calendar and set
        auto-refresh to every 15 minutes.
      </p>
      <p className="mt-2 text-[0.9rem] text-mute-l">
        {feed?.last_fetched
          ? `Last fetched ${new Date(feed.last_fetched).toLocaleString("en-US", { timeZone: "America/Los_Angeles" })} \u00b7 ${feed.fetch_count} fetches`
          : "Not fetched yet. Subscribe on your phone to start."}
      </p>
      <form action={regenerateCalendarFeed} className="mt-4">
        <button type="submit" className="btn btn-ol btn-inline">
          Regenerate link (revokes the old one)
        </button>
      </form>

      <h2 className="h3 mt-12">Served ZIP codes</h2>
      <p className="mt-2 text-mute-l">
        ZIPs treated as the core area on the estimate form. Everything else is accepted and
        flagged out-of-area. Edit the list in src/data/service-zips.ts and redeploy.
      </p>
      <p className="t-data mt-3 rounded-sm border border-line bg-white p-4 leading-7">
        {Array.from(CORE_ZIPS).sort().join(", ")}
      </p>

      <h2 className="h3 mt-12">SMS</h2>
      <p className="mt-2 text-mute-l">
        Outbound messages send from the Telnyx number configured in the environment. Every send
        and every inbound reply is logged. STOP and START are honored automatically. Message
        templates live in the estimate API route and can be edited there.
      </p>

      <h2 className="h3 mt-12">Hours</h2>
      <p className="mt-2 text-mute-l">
        {SITE.hours.days}, {SITE.hours.open} to {SITE.hours.close}. Shown in the footer and in
        the business schema. Change in src/data/site.ts.
      </p>

      <h2 className="h3 mt-12">Access</h2>
      <p className="mt-2 text-mute-l">
        Change the PIN used to reach this admin, or sign out on this device. Changing the PIN
        needs the current one. Five wrong sign-in attempts lock access for 15 minutes.
      </p>
      <AccountControls />
    </div>
  );
}