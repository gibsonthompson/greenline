import Image from "next/image";
import { reviews } from "@/data/reviews";
import { reviewLink } from "@/data/site";

// Google-styled cards using the official Google mark.
function GoogleMark({ size = 28 }: { size?: number }) {
  return (
    <Image
      src="/brand/google-g.png"
      alt="Google"
      width={size}
      height={size}
      className="flex-none"
      style={{ width: size, height: size }}
    />
  );
}

const Stars = () => (
  <span className="stars" aria-hidden="true">
    {"\u2605\u2605\u2605\u2605\u2605"}
  </span>
);

export default function GoogleReviews({ limit }: { limit?: number }) {
  const shown = limit ? reviews.slice(0, limit) : reviews;

  return (
    <>
      {/* Summary card. Stacks into three clean rows on a phone; the score
          block used ml-auto before, which flung it to the right on its own
          line as soon as the row wrapped. */}
      <div className="mb-6 rounded-md border border-line bg-white p-5 shadow-[0_1px_2px_rgba(17,26,19,.06)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <GoogleMark size={30} />
            <div>
              <div className="h4 text-[0.98rem] leading-tight">Google Reviews</div>
              <div className="t-sm text-mute-l">Green Line Lawn Care LLC</div>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:justify-end">
            <div
              className="font-[family-name:var(--font-display)] text-[2.4rem] leading-none"
              style={{ fontVariationSettings: '"wdth" 92, "wght" 800' }}
            >
              5.0
            </div>
            <div>
              <Stars />
              <div className="t-sm text-mute-l">Rated 5.0 out of 5</div>
            </div>
          </div>
        </div>

        <a
          href={reviewLink()}
          rel="noopener"
          className="btn btn-p mt-4 w-full text-[0.95rem] sm:mt-5"
        >
          Read All Reviews
        </a>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {shown.map((r) => (
          <article key={r.id} className="gcard">
            <div className="flex items-center gap-3">
              <div
                className="grid h-[38px] w-[38px] flex-none place-items-center rounded-full font-[family-name:var(--font-display)] text-[1.02rem] text-white"
                style={{ background: r.avatarColor, fontVariationSettings: '"wght" 700' }}
                aria-hidden="true"
              >
                {r.author.charAt(0)}
              </div>
              <div>
                <div className="text-[0.96rem] font-bold leading-tight">
                  {r.author}
                  {r.localGuide && <span className="badge-lg ml-2">Local Guide</span>}
                </div>
                <div className="text-[0.79rem] text-[#6c7568]">{r.context}</div>
              </div>
              <span className="ml-auto">
                <GoogleMark size={26} />
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Stars />
              <span className="text-[0.79rem] text-[#6c7568]">{r.when}</span>
            </div>
            <blockquote className="text-[0.93rem] leading-[1.6] text-[#2c352c] whitespace-pre-line">
              {r.body}
            </blockquote>
            <footer className="mt-auto flex items-center gap-2 border-t border-paper-2 pt-2 text-[0.77rem] text-[#6c7568]">
              <GoogleMark size={16} /> Posted on Google
            </footer>
          </article>
        ))}
      </div>
    </>
  );
}
