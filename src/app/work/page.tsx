import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import WipeCompare from "@/components/WipeCompare";

export const metadata: Metadata = {
  title: "Our Work: Before and After",
  description:
    "Real before-and-after lawn care jobs from the East Bay: cleanups, recovered lawns, and commercial frontage. Drag the line to compare.",
  alternates: { canonical: "/work" },
};

const pairs = [
  {
    before: "/photos/pairs/side-yard-before.jpg",
    after: "/photos/pairs/side-yard-after.jpg",
    caption: "Side yard cleanup: chest-high weeds cleared and hauled in one visit.",
    alt: "Side yard between a house and fence",
  },
  {
    before: "/photos/pairs/back-lawn-before.jpg",
    after: "/photos/pairs/back-lawn-after.jpg",
    caption: "Back lawn brought back onto a weekly schedule.",
    alt: "Back lawn behind a home",
  },
  {
    before: "/photos/pairs/front-lawn-before.jpg",
    after: "/photos/pairs/front-lawn-after.jpg",
    caption: "Front lawn recovery: overgrowth down, edges re-established.",
    alt: "Front lawn and walkway",
  },
  {
    before: "/photos/pairs/commercial-island-before.jpg",
    after: "/photos/pairs/commercial-island-after.jpg",
    caption: "Commercial sign island: from neglected to maintained on a schedule.",
    alt: "Commercial sign island on a corner lot",
  },
];

export default function WorkPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:px-8">
      <h1 className="t-display-lg max-w-[16ch]">The work, before and after</h1>
      <p className="t-body-lg mt-4 max-w-[52ch] text-ink-60">
        Drag the line. These are real jobs, shot on a phone at the property, not staged.
      </p>

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        {pairs.map((p) => (
          <WipeCompare key={p.before} {...p} />
        ))}
      </div>

      <h2 className="t-display-md mt-20">Finished work</h2>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
        {["/photos/hero/edge-line-1x1.jpg", "/photos/clean/1_48_46.jpg", "/photos/clean/1_49_11.jpg"].map(
          (src) => (
            <div key={src} className="relative aspect-square overflow-hidden rounded-md bg-field">
              <Image src={src} alt="Finished lawn care work" fill sizes="(min-width: 768px) 33vw, 50vw" className="object-cover" />
            </div>
          )
        )}
      </div>

      <div className="mt-16 border-l-[3px] border-turf pl-6">
        <p className="t-display-sm max-w-[24ch]">Yours could be the next pair.</p>
        <Link href="/estimate" className="btn btn-fill mt-5">
          Get a free estimate
        </Link>
      </div>
    </div>
  );
}
