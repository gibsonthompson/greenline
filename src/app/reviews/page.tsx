import type { Metadata } from "next";
import GoogleReviews from "@/components/GoogleReviews";
import { reviewLink } from "@/data/site";

export const metadata: Metadata = {
  title: "Reviews",
  description:
    "What Green Line Lawn Care customers say on Google, reproduced word for word.",
  alternates: { canonical: "/reviews" },
};

export default function ReviewsPage() {
  return (
    <div className="mx-auto max-w-[1340px] px-[clamp(1.1rem,4.2vw,4rem)] pb-16 pt-[clamp(6rem,10vw,8.5rem)]">
      <div className="rule" />
      <div className="kicker">Reviews</div>
      <h1 className="h1 mt-2 max-w-[18ch]">What Our Customers Say</h1>
      <p className="lead mt-4 max-w-[52ch] text-mute-l">
        Pulled straight from Google and left exactly as written, spelling and all.
      </p>

      <div className="mt-10">
        <GoogleReviews />
      </div>

      <div className="mt-16 bg-paper-2 p-8 md:p-12">
        <h2 className="h2 max-w-[22ch]">Worked With Us? Tell The Next Person.</h2>
        <p className="mt-3 max-w-[52ch]">
          Reviews are how a one-man operation competes with the big trucks. If Jaydin did right by
          your property, two minutes on Google genuinely helps.
        </p>
        <a href={reviewLink()} rel="noopener" className="btn btn-p mt-6">Leave A Google Review</a>
      </div>
    </div>
  );
}
