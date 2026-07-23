import type { Metadata } from "next";
import { reviews, AGGREGATE } from "@/data/reviews";
import { reviewLink } from "@/data/site";

export const metadata: Metadata = {
  title: "Reviews",
  description:
    "Every Google review of Green Line Lawn Care, reproduced word for word. 5.0 from 6 reviews.",
  alternates: { canonical: "/reviews" },
};

export default function ReviewsPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:px-8">
      <h1 className="t-display-lg max-w-[18ch]">What customers say</h1>
      <p className="t-body-lg mt-4 max-w-[52ch] text-ink-60">
        {AGGREGATE.rating.toFixed(1)} from {AGGREGATE.count} Google reviews, reproduced here word
        for word. Names link to the reviewer&rsquo;s Google profile.
      </p>

      <div className="mt-12 grid gap-x-12 gap-y-14 md:grid-cols-2">
        {reviews.map((r) => (
          <figure key={r.id} className="border-t-2 border-concrete-30 pt-6">
            <div className="flex items-baseline justify-between gap-4">
              <figcaption>
                <a
                  href={r.profile}
                  rel="noopener nofollow"
                  className="font-semibold text-turf-ink underline decoration-2 underline-offset-4"
                >
                  {r.author}
                </a>
                <span className="ml-3 text-[0.9rem] text-ink-60">
                  {r.localGuide ? "Local Guide \u00b7 " : ""}
                  {r.reviewCount ? `${r.reviewCount} reviews \u00b7 ` : ""}
                  {r.when}
                </span>
              </figcaption>
              <span aria-label={`${r.rating} out of 5 stars`} className="t-data whitespace-nowrap text-turf-ink">
                {r.rating.toFixed(1)} / 5
              </span>
            </div>
            <blockquote className="mt-3 whitespace-pre-line">{r.body}</blockquote>
          </figure>
        ))}
      </div>

      <div className="mt-20 bg-concrete-20 p-8 md:p-12">
        <h2 className="t-display-md max-w-[22ch]">Worked with us? Tell the next person.</h2>
        <p className="mt-3 max-w-[52ch]">
          Reviews are how a one-man operation competes with the big trucks. If Jaydin did right by
          your property, two minutes on Google genuinely matters.
        </p>
        <a href={reviewLink()} rel="noopener" className="btn btn-fill mt-6">
          Leave a Google review
        </a>
      </div>
    </div>
  );
}
