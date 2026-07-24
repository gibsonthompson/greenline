import type { Metadata } from "next";
import { Suspense } from "react";
import EstimateForm from "@/components/EstimateForm";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Free Estimate",
  description:
    "Tell us what you need, add a few photos from your camera roll, and get a written lawn care price the same day. Free, no obligation.",
  alternates: { canonical: "/estimate" },
};

export default function EstimatePage() {
  return (
    <article>
      {/* Dark banner clears the fixed header. Do NOT add a responsive py-*
          utility here: it overrides the pt- clamp at that breakpoint and the
          heading slides back under the nav. */}
      <header className="dark">
        <div className="mx-auto max-w-[1340px] px-[clamp(1.1rem,4.2vw,4rem)] pb-12 pt-[clamp(6rem,10vw,8.5rem)]">
          <div className="rule" />
          <div className="kicker">Free Estimate</div>
          <h1 className="h1 mt-2 max-w-[18ch] text-white">Get Your Price Today</h1>
          <p className="lead mt-4 max-w-[52ch] text-white/90">
            Four quick steps and a few photos from your camera roll. Most requests get a written
            price back the same day, with no cost and no obligation.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.92rem] text-[#d8e2d4]">
            <span className="inline-flex items-center gap-2">
              <span className="stars" aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</span> 5.0 On Google
            </span>
            <span>No site visit needed</span>
            <span>No obligation</span>
          </div>
        </div>
      </header>

      <div className="bg-paper-2 py-14">
        <div className="mx-auto max-w-[1340px] px-[clamp(1.1rem,4.2vw,4rem)]">
          <div className="mx-auto max-w-2xl border border-line bg-white p-6 shadow-[0_2px_20px_rgba(17,26,19,.06)] md:p-10">
            {/* EstimateForm reads useSearchParams, so it renders client-side.
                A shape-matched skeleton avoids a text flash on load. */}
            <Suspense
              fallback={
                <div aria-hidden="true" className="animate-pulse">
                  <div className="h-[3px] w-full bg-line" />
                  <div className="mt-3 h-4 w-24 bg-line" />
                  <div className="mt-8 h-7 w-56 bg-line" />
                  <div className="mt-3 h-4 w-40 bg-line" />
                  <div className="mt-6 flex flex-col gap-3">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="h-[52px] w-full border border-line bg-paper-2" />
                    ))}
                  </div>
                </div>
              }
            >
              <EstimateForm />
            </Suspense>
          </div>

          <p className="mx-auto mt-6 max-w-2xl text-center text-[0.92rem] text-mute-l">
            {/* Phone link sits at the END of the sentence on purpose, so no
                punctuation trails it and gets pushed to its own line. */}
            Would you rather talk it through? We answer {SITE.hours.days},{" "}
            {SITE.hours.open} to {SITE.hours.close}. Call or text{" "}
            <a href={`tel:${SITE.phoneE164}`} className="tap font-bold text-green">
              {SITE.phoneDisplay}
            </a>
          </p>
        </div>
      </div>
    </article>
  );
}
