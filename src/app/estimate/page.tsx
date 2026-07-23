import type { Metadata } from "next";
import { Suspense } from "react";
import EstimateForm from "@/components/EstimateForm";

export const metadata: Metadata = {
  title: "Free Estimate",
  description:
    "Tell us what you need, add a few photos from your library, and get a lawn care price the same day. Free, no obligation.",
  alternates: { canonical: "/estimate" },
};

export default function EstimatePage() {
  return (
    <div className="on-dark bg-field py-14 text-paper md:py-20">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="t-display-lg">Free estimate</h1>
          <p className="t-body-lg mt-3 text-paper/80">
            Four quick steps. Most requests get a price back the same day.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-2xl border-l-[3px] border-turf bg-concrete-10 p-6 text-ink md:p-10">
          <Suspense>
            <EstimateForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
