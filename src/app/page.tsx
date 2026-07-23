import Image from "next/image";
import Link from "next/link";
import ServiceIndex from "@/components/ServiceIndex";
import CoverageMap from "@/components/CoverageMap";
import { SITE } from "@/data/site";
import { reviews } from "@/data/reviews";

// Homepage section rhythm is deliberately uneven per the build spec:
// hero (viewport), services (tight, 64), the line (open, 176),
// proof (mid, 96), coverage (tight, 64), estimate CTA (mid, 96).
// Do not normalize the padding.

const homeQuotes = ["chris-b", "salvador-moreno", "ryan-dunahoe"] as const;

export default function Home() {
  const quotes = homeQuotes
    .map((id) => reviews.find((r) => r.id === id))
    .filter((r): r is (typeof reviews)[number] => Boolean(r));

  return (
    <>
      {/* 1 ── HERO */}
      <section className="on-dark relative flex min-h-[max(620px,calc(100svh-72px))] items-end overflow-hidden bg-field">
        <Image
          src="/photos/hero/edge-line-16x9.jpg"
          alt="A freshly striped lawn meeting a concrete driveway at a sharp, clean edge"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          quality={82}
        />
        {/* Legibility scrim, bottom-left, following the photo's own shadow */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent"
        />
        {/* The line device: traces the grass-to-driveway edge. Draws once. */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMax slice"
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          <path className="hero-line-path" d="M -20 1005 L 320 998 C 620 990 700 700 730 520 C 752 390 760 300 764 180" />
        </svg>

        <div className="relative mx-auto w-full max-w-6xl px-5 pb-16 pt-40 md:px-8 md:pb-24">
          <h1 className="t-display-xl rise max-w-[12ch] text-paper">
            Mowed. Edged. Cleaned up.
          </h1>
          <p className="t-body-lg rise rise-1 mt-5 max-w-[46ch] text-paper/90">
            Weekly and one-time lawn care across the Bay Area. Send a photo, get a price the same
            day.
          </p>
          <div className="rise rise-2 mt-8 flex flex-wrap gap-4">
            <Link href="/estimate" className="btn btn-fill">
              Get a free estimate
            </Link>
            <a href={`tel:${SITE.phoneE164}`} className="btn btn-ghost-dark">
              Call {SITE.phoneDisplay}
            </a>
          </div>
          <p className="t-body-sm rise rise-3 mt-6 text-paper/70">
            Free estimates &middot; Same-day quotes &middot; Licensed and insured
          </p>
        </div>
      </section>

      {/* 2 ── SERVICE INDEX (tight, 64) */}
      <section className="bg-concrete-10 py-16">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <h2 className="t-display-lg max-w-[16ch]">What we take care of</h2>
          <ServiceIndex />
        </div>
      </section>

      {/* 3 ── THE LINE (open, 176) */}
      <section className="on-dark bg-field py-24 text-paper md:py-44">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-[1fr_3px_minmax(280px,420px)] md:gap-14 md:px-8">
          <div>
            <h2 className="t-display-lg">Anybody can cut grass.</h2>
            <div className="t-body-lg mt-6 max-w-[52ch] space-y-5 text-paper/90">
              <p>
                The edge is the tell. A lawn that has been mowed and a property that is being
                maintained look identical from the street until you get to where the grass meets
                the concrete. That line is the whole job. It is also the first thing that goes
                when a crew is rushing.
              </p>
              <p>
                Bay Area lawns are mostly tall fescue, which wants to be cut at three to three
                and a half inches and never taken down by more than a third at once. Cut it
                shorter to stretch the time between visits and it browns out, thins, and lets
                weeds in. We cut on a schedule that matches how the grass actually grows, weekly
                through the growing season and backed off when it slows.
              </p>
            </div>
            <Link
              href="/services/edging-and-trimming"
              className="mt-8 inline-block font-semibold text-turf underline decoration-2 underline-offset-4 hover:text-paper"
            >
              How we cut the line
            </Link>
          </div>
          <div aria-hidden="true" className="line-v hidden h-full min-h-[300px] md:block" />
          <div className="relative aspect-[3/4] overflow-hidden rounded-md">
            <Image
              src="/photos/hero/edge-line-3x4.jpg"
              alt="Close view of the mowed edge line against the driveway"
              fill
              sizes="(min-width: 768px) 420px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* 4 ── PROOF (mid, 96) */}
      <section className="bg-concrete-20 py-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <h2 className="t-label text-ink-60">From Google reviews</h2>

          <figure className="mt-8 max-w-[30ch] md:max-w-[44ch]">
            <blockquote className="t-display-sm">&ldquo;{quotes[0].body}&rdquo;</blockquote>
            <figcaption className="mt-4 flex items-center gap-3 text-[0.95rem]">
              <span className="font-semibold">{quotes[0].author}</span>
              <span className="text-ink-60">
                {quotes[0].reviewCount ? `${quotes[0].reviewCount} reviews on ` : "on "}Google
              </span>
            </figcaption>
          </figure>

          <div className="mt-14 grid gap-12 md:grid-cols-2">
            {quotes.slice(1).map((q, i) => (
              <figure key={q.id} className={i === 1 ? "md:mt-12" : ""}>
                <blockquote className="t-body-lg max-w-[44ch]">&ldquo;{q.body}&rdquo;</blockquote>
                <figcaption className="mt-3 flex items-center gap-3 text-[0.95rem]">
                  <span className="font-semibold">{q.author}</span>
                  <span className="text-ink-60">
                    {q.reviewCount ? `${q.reviewCount} reviews on ` : "on "}Google
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>

          <p className="mt-12">
            <Link
              href="/reviews"
              className="font-semibold text-turf-ink underline decoration-2 underline-offset-4"
            >
              Read all six reviews
            </Link>
          </p>
        </div>
      </section>

      {/* 5 ── COVERAGE (tight, 64) */}
      <section className="bg-concrete-10 py-16">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 md:grid-cols-2 md:px-8">
          <div>
            <h2 className="t-display-lg max-w-[14ch]">Where we work</h2>
            <p className="mt-5 max-w-[46ch]">
              Our core service area is {SITE.coreArea}: Oakland, Berkeley, Alameda, San Leandro,
              Hayward, Castro Valley, San Lorenzo, Union City, Fremont, Newark, Richmond, and El
              Cerrito. We take jobs across the wider Bay Area and quote those case by case.
            </p>
            <p className="mt-4">
              <Link
                href="/areas"
                className="font-semibold text-turf-ink underline decoration-2 underline-offset-4"
              >
                Every city we cover
              </Link>
            </p>
          </div>
          <CoverageMap />
        </div>
      </section>

      {/* 6 ── ESTIMATE CTA (mid, 96) */}
      <section className="on-dark bg-field py-24 text-paper">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="border-l-[3px] border-turf pl-6 md:pl-10">
            <h2 className="t-display-lg max-w-[16ch]">Get a price today</h2>
            <p className="t-body-lg mt-4 max-w-[44ch] text-paper/90">
              Tell us what you need, drop in a few photos, and Jaydin will text or call you back
              with a number. No site visit needed for most jobs.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/estimate" className="btn btn-fill">
                Start your free estimate
              </Link>
              <a href={`tel:${SITE.phoneE164}`} className="btn btn-ghost-dark">
                Call {SITE.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
