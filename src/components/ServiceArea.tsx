import Link from "next/link";
import { cityPages } from "@/data/city-pages";

// Real Google Maps embed. The q= form needs no API key.
// TODO(gibson): once the Google Business Profile is verified, swap this for
// an embed centered on the actual business pin.
export default function ServiceArea() {
  return (
    <div className="mx-auto grid max-w-[1340px] items-center gap-8 px-[clamp(1.1rem,4.2vw,4rem)] lg:grid-cols-[0.82fr_1.18fr]">
      <div>
        <div className="rule" />
        <div className="kicker">Service Area</div>
        <h2 className="h2 mt-2 text-white">Where We Work</h2>
        <p className="lead mt-4 max-w-[44ch] text-mute-d">
          Our routes run the length of the East Bay, from Orinda and Richmond in the north,
          down through Oakland, San Leandro, Hayward, and Fremont, as far south as San Jose.
        </p>
        <p className="mt-4 max-w-[44ch] text-mute-d">
          We&rsquo;ll take cleanups and commercial work further out and price those one at a time.
          If somewhere is too far for us to keep a reliable schedule, we&rsquo;ll tell you that
          instead of taking the job and showing up late.
        </p>
        <Link href="/areas" className="btn btn-l mt-6">
          See Every City We Cover
        </Link>
      </div>

      <div>
        {/* Portrait on phones: at z=9 a 4:3 box is too short to hold
            Orinda and San Jose at once, a 3:4 box clears it comfortably. */}
        <div className="aspect-[3/4] overflow-hidden border-[3px] border-lime bg-forest-2 sm:aspect-[4/3]">
          <iframe
            title="Map of the Green Line Lawn Care service area in the East Bay"
            src="https://maps.google.com/maps?q=37.6076,-122.0330&z=9&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="h-full w-full border-0 saturate-[.92]"
          />
        </div>
        {/* A real list, not bare links in a columns div. The <li> gives each
            city its own block box; without it the .tap inline-flex rule made
            them run together as "OaklandBerkeley". */}
        <ul className="cities mt-5 columns-2 gap-x-8 border-t border-mute-d/30 pt-4 sm:columns-3">
          {cityPages.map((c) => (
            <li key={c.slug} className="break-inside-avoid">
              <Link
                href={`/areas/${c.slug}`}
                className="block py-2 text-[0.95rem] font-semibold text-lime-br hover:underline hover:underline-offset-4"
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}