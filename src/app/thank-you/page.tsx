import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Estimate request sent",
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-[clamp(8rem,12vw,10rem)] md:px-8">
      <div className="max-w-[52ch]">
        <div aria-hidden="true" className="rule w-24" />
        <h1 className="h2 mt-6">Estimate request sent</h1>
        <p className="lead mt-4 text-mute-l">
          Jaydin has it. You&rsquo;ll get a text or a call back with a price, usually the same
          day, always within one business day.
        </p>
        <p className="mt-4">
          Need us sooner? Call{" "}
          <a href={`tel:${SITE.phoneE164}`} className="font-semibold text-green underline underline-offset-2">
            {SITE.phoneDisplay}
          </a>
          , {SITE.hours.days}, {SITE.hours.open} to {SITE.hours.close}.
        </p>
        <div className="mt-10 flex gap-4">
          <Link href="/work" className="btn btn-ol">
            See our work while you wait
          </Link>
        </div>
      </div>
    </div>
  );
}
