import type { Metadata } from "next";
import Link from "next/link";
import { bayAreaCounties, totalCityCount } from "@/data/bay-area-cities";
import { cityPages } from "@/data/city-pages";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Service Areas: Every Bay Area City We Cover",
  description:
    "Green Line Lawn Care serves the nine-county Bay Area, with core coverage across the East Bay. See every city we cover and how out-of-area jobs are quoted.",
  alternates: { canonical: "/areas" },
};

// The coverage hub (build spec 5.2, Tier 2). All 101 incorporated
// cities named on one substantial page. Only Tier 1 cities link out.
// Cities without a built page are plain text by design: linking to a
// page that does not exist yet, or generating 101 thin pages, is the
// doorway-page pattern this architecture exists to avoid.

const built = new Map(cityPages.map((c) => [c.name.toLowerCase(), c.slug]));

export default function AreasPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-16 pt-[clamp(8rem,12vw,10rem)] md:px-8">
      <h1 className="t-display-lg max-w-[20ch]">Where we work</h1>
      <div className="mt-6 grid gap-10 md:grid-cols-2 md:items-start">
        <div className="max-w-[56ch] space-y-4">
          <p className="t-body-lg">
            Our core service area is {SITE.coreArea}: the corridor from Richmond and El Cerrito
            down through Oakland, San Leandro, and Hayward to Union City, Fremont, and Newark.
            That is where our recurring routes run and where we can usually get you a same-day
            quote and a spot on the schedule within the week.
          </p>
          <p>
            We take jobs across the wider nine-county Bay Area, all {totalCityCount} cities of
            it, and we quote those honestly, case by case: bigger jobs travel well, single
            small mows usually do not. Send the request either way and we will give you a
            straight answer, and a referral if we are not the right fit for the distance.
          </p>
          <p>
            <Link href="/estimate" className="btn btn-fill">
              Check your address with a free estimate
            </Link>
          </p>
        </div>
        <div className="aspect-[4/3] overflow-hidden border-[3px] border-lime bg-forest-2">
          <iframe
            title="Map of the Green Line Lawn Care service area in the East Bay"
            src="https://maps.google.com/maps?q=Oakland,%20California&t=&z=9&ie=UTF8&iwloc=&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="h-full w-full border-0"
          />
        </div>
      </div>

      <h2 className="t-display-md mt-16">Core East Bay cities</h2>
      <p className="mt-2 max-w-[56ch] text-ink-60">
        These are the cities where we run weekly routes. Each has its own page with what we know
        about maintaining a lawn there.
      </p>
      <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
        {cityPages.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/areas/${c.slug}`}
              className="font-semibold text-turf-ink underline decoration-2 underline-offset-4"
            >
              {c.name}
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="t-display-md mt-16">The full nine-county Bay Area</h2>
      <p className="mt-2 max-w-[56ch] text-ink-60">
        Every incorporated city and town in the region. Outside the core area, jobs are quoted
        case by case.
      </p>
      <div className="mt-8 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {bayAreaCounties.map((county) => (
          <section key={county.county}>
            <h3 className="t-display-sm border-b border-concrete-30 pb-2">{county.county}</h3>
            <ul className="mt-3 columns-2 gap-6 text-[0.95rem] leading-8">
              {county.cities.map((city) => {
                const slug = built.get(city.toLowerCase());
                return (
                  <li key={city}>
                    {slug ? (
                      <Link
                        href={`/areas/${slug}`}
                        className="font-medium text-turf-ink underline underline-offset-2"
                      >
                        {city}
                      </Link>
                    ) : (
                      city
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      <p className="mt-12 max-w-[60ch] text-[0.95rem] text-ink-60">
        Castro Valley and San Lorenzo are unincorporated Alameda County communities rather than
        incorporated cities, and both are in our core area.
      </p>
    </div>
  );
}
