import type { Metadata } from "next";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <article>
      <header className="dark">
        <div className="mx-auto max-w-[1340px] px-[clamp(1.1rem,4.2vw,4rem)] pb-10 pt-[clamp(8.5rem,13vw,10.5rem)]">
          <div className="rule" />
          <div className="kicker">Legal</div>
          <h1 className="h1 mt-2 max-w-[18ch] text-white">Terms Of Service</h1>
          <p className="t-sm mt-3 text-mute-d">Last updated July 2026</p>
        </div>
      </header>

      <div className="prose-gl mx-auto max-w-[72ch] px-[clamp(1.1rem,4.2vw,4rem)] py-14">
      <h2>Estimates</h2>
      <p>
        Estimates are free and carry no obligation. A quote based on photos assumes the photos
        fairly represent the property; if conditions on site differ materially, we will tell you
        before doing additional work and agree on any change to the price.
      </p>
      <h2>Scheduling and weather</h2>
      <p>
        Outdoor work moves with the weather. If a visit has to shift, we will communicate and
        reschedule promptly. Recurring service runs on an agreed weekday and cadence.
      </p>
      <h2>Payment</h2>
      <p>
        Payment terms are stated on your quote. Recurring clients are billed at the agreed
        per-visit or monthly rate.
      </p>
      <h2>Property access and condition</h2>
      <p>
        Please have gates unlocked and pets secured for scheduled visits. We treat every property
        with care; if you believe something was damaged during a visit, tell us within 48 hours
        and we will make it right.
      </p>
      <h2>Contact</h2>
      <p>
        {SITE.name}, {SITE.phoneDisplay}, {SITE.email}.
      </p>
      </div>
    </article>
  );
}
