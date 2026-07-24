import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { services } from "@/data/services";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Mowing, edging, cleanups, weed removal, hedges, gutters, commercial upkeep, and plantings across the East Bay. Free estimates from photos.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-[1340px] px-[clamp(1.1rem,4.2vw,4rem)] pb-16 pt-[clamp(8rem,12vw,10rem)]">
      <div className="rule" />
      <div className="kicker">Services</div>
      <h1 className="h1 mt-2 max-w-[20ch]">Complete Lawn And Property Care</h1>
      <p className="lead mt-4 max-w-[54ch] text-mute-l">
        Everything your property needs to look its best, handled by one company on one schedule.
        Every visit ends with the edges cut and the walks blown clean.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <Link
            key={s.slug}
            href={`/services/${s.slug}`}
            className="group flex flex-col border border-line bg-white transition-shadow hover:shadow-[0_6px_28px_rgba(17,26,19,.10)]"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-forest-2">
              <Image src={s.photo} alt={s.name} fill sizes="(min-width:1080px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover saturate-[1.06]" />
            </div>
            <div className="flex flex-1 flex-col gap-2 p-6">
              <h2 className="h3">{s.name}</h2>
              <p className="text-[0.94rem] text-mute-l">{s.short}</p>
              <span className="mt-auto pt-4 text-[0.9rem] font-bold text-green">
                See Details <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1">&rarr;</span>
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap gap-3">
        <Link href="/estimate" className="btn btn-p">Get A Free Estimate</Link>
        <a href={`tel:${SITE.phoneE164}`} className="btn btn-ol">Call {SITE.phoneDisplay}</a>
      </div>
    </div>
  );
}
