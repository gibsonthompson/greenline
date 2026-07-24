import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "About Green Line Lawn Care",
  description:
    "Owner-operated lawn care serving the East Bay. Reliable weekly service, a finished look every visit, and a written price before we start.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1340px] px-[clamp(1.1rem,4.2vw,4rem)] pb-16 pt-[clamp(8rem,12vw,10rem)]">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(280px,400px)]">
        <div>
          <div className="rule" />
          <div className="kicker">About Us</div>
          <h1 className="h1 mt-2 max-w-[18ch]">The Lawn Company Your Neighbors Ask You About</h1>
          <div className="mt-8 [&>p]:mt-4 [&>p]:max-w-[58ch]">
            <p>
              Green Line Lawn Care is an owner-operated company serving homeowners and small
              commercial properties across the East Bay. We built it around the one thing most
              people cannot get from a lawn service: showing up.
            </p>
            <p>
              Nearly every customer who calls us has the same history. A crew that started strong,
              then came every third week, then stopped answering the phone. By the time they reach
              us the yard has gotten away from them and a routine mow has turned into a cleanup.
            </p>
            <p>
              We run a fixed weekly schedule so that never happens to you. Your property is
              serviced on the same day every week or every other week, the full job every time,
              and if anything ever puts us behind you hear about it before you notice.
            </p>
            <p>
              Because the owner runs every visit personally, the person who quotes your property is
              the person who maintains it. There is no dispatch line, no rotating crew, and nobody
              you have to explain your gate code to twice.
            </p>
            <p>
              The result is a property that looks its best all year, and one less thing on your list.
            </p>
          </div>

          <div className="mt-9 grid gap-6 border-t border-line pt-7 sm:grid-cols-2">
            {[
              ["Rated 5.0 On Google", "Every customer who has left a review has given us five stars."],
              ["Licensed And Insured", "Documentation available on request for landlords and property managers."],
              ["Free Written Estimates", "A real price, in writing, usually the same day. No obligation."],
              ["No Long Contracts", "Stay because the work is good, not because you signed something."],
            ].map(([t, d]) => (
              <div key={t}>
                <div className="h4">{t}</div>
                <p className="mt-1 max-w-[34ch] text-[0.92rem] text-mute-l">{d}</p>
              </div>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/estimate" className="btn btn-p">Get My Free Estimate</Link>
            <a href={`tel:${SITE.phoneE164}`} className="btn btn-ol">Call {SITE.phoneDisplay}</a>
          </div>
        </div>

        <div className="relative aspect-[3/4] overflow-hidden bg-forest-2 lg:sticky lg:top-28">
          <Image
            src="/photos/detail-tall.jpg"
            alt="Bed reset with fresh mulch, stone, and new plantings"
            fill
            sizes="(min-width:1024px) 400px, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}