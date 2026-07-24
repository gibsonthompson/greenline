import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Estimate Request Received",
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-[clamp(6rem,10vw,8.5rem)] md:px-8">
      <div className="max-w-[56ch]">
        <div className="rule" />
        <div className="kicker">Free Estimate</div>
        <h1 className="h1 mt-2">Your Request Is In</h1>
        <p className="lead mt-5 text-mute-l">
          Thank you. We have your details and any photos you sent. You will receive a written
          price by text or a call, usually the same day and always within one business day.
        </p>
        <p className="mt-4 text-mute-l">
          Need us sooner? We answer {SITE.hours.days}, {SITE.hours.open} to {SITE.hours.close}.
          Call or text{" "}
          <a href={`tel:${SITE.phoneE164}`} className="font-semibold text-green underline underline-offset-2">
            {SITE.phoneDisplay}
          </a>
          .
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/work" className="btn btn-l">
            See Our Recent Work
          </Link>
          <Link href="/" className="btn btn-ol">
            Back To Home
          </Link>
        </div>
      </div>
    </div>
  );
}
