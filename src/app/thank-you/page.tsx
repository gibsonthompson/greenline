import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Estimate request sent",
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-24 md:px-8">
      <div className="max-w-[52ch]">
        <div aria-hidden="true" className="line-h w-24" />
        <h1 className="t-display-lg mt-6">Estimate request sent</h1>
        <p className="t-body-lg mt-4 text-ink-60">
          Jaydin has it. You&rsquo;ll get a text or a call back with a price, usually the same
          day, always within one business day.
        </p>
        <p className="mt-4">
          Need us sooner? Call{" "}
          <a href={`tel:${SITE.phoneE164}`} className="font-semibold text-turf-ink underline underline-offset-2">
            {SITE.phoneDisplay}
          </a>
          , {SITE.hours.days}, {SITE.hours.open} to {SITE.hours.close}.
        </p>
        <div className="mt-10 flex gap-4">
          <Link href="/work" className="btn btn-ghost-light">
            See our work while you wait
          </Link>
        </div>
      </div>
    </div>
  );
}
