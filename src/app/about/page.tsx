import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "About Jaydin",
  description:
    "Green Line Lawn Care is owner-operated: the person who quotes your property is the person who maintains it. Meet Jaydin.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:px-8">
      <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(280px,400px)]">
        <div>
          <h1 className="t-display-lg max-w-[16ch]">The person who quotes it, cuts it.</h1>
          <div className="prose-gl mt-8">
            <p>
              I&rsquo;m Jaydin, and Green Line Lawn Care is my company. When you send an estimate
              request, I&rsquo;m the one who reads it, prices it, and shows up to do the work. There
              is no call center, no rotating crew, and no gap between the person who promised and
              the person who delivers.
            </p>
            <p>
              I started this company on a simple observation: most lawns in the East Bay are not
              badly cut, they are badly kept. Crews rush, edges go soft, corners get skipped, and
              nobody notices any single visit, only the slow slide. So I named the company after
              the thing that proves the difference: the line where the grass meets the concrete.
              If that line is sharp, everything behind it got the same attention.
            </p>
            <p>
              What that means in practice: I show up when I said I would, I cut at the height the
              grass actually needs instead of the height that stretches a route, I clean my
              equipment between properties, and I blow off every walk and drive before I leave.
              Five of my six Google reviews mention me by name, and I intend to keep it that way.
            </p>
            <p>
              If you want a property that looks maintained instead of just mowed, send me a few
              photos and I&rsquo;ll get you a price today.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/estimate" className="btn btn-fill">
              Get a free estimate
            </Link>
            <a href={`tel:${SITE.phoneE164}`} className="btn btn-ghost-light">
              Call {SITE.phoneDisplay}
            </a>
          </div>
        </div>
        <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-field md:sticky md:top-8">
          <Image
            src="/photos/hero/edge-line-3x4.jpg"
            alt="A Green Line maintained lawn: striped cut meeting a clean driveway edge"
            fill
            sizes="(min-width: 768px) 400px, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
