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
          Our weekly routes run from Richmond and El Cerrito south through Oakland, San Leandro,
          and Hayward down to Union City, Fremont, and Newark.
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
        <div className="aspect-[4/3] overflow-hidden border-[3px] border-lime bg-forest-2">
          <iframe
            title="Map of the Green Line Lawn Care service area in the East Bay"
            src="https://maps.google.com/maps?q=Oakland,%20California&t=&z=11&ie=UTF8&iwloc=&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="h-full w-full border-0 saturate-[.92]"
          />
        </div>
        <div className="mt-5 columns-2 gap-6 border-t border-mute-d/30 pt-4 sm:columns-3">
          {cityPages.map((c) => (
            <Link key={c.slug} href={`/areas/${c.slug}`} className="tap block py-1 text-[0.95rem] font-semibold text-lime-br hover:underline hover:underline-offset-4">
              {c.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
