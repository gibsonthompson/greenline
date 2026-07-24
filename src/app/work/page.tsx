import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import BeforeAfter from "@/components/BeforeAfter";

export const metadata: Metadata = {
  title: "Our Work",
  description:
    "Before and after photos from real Green Line jobs across the East Bay. Cleanups, recovered lawns, gutters, and bed resets.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <div className="mx-auto max-w-[1340px] px-[clamp(1.1rem,4.2vw,4rem)] pb-16 pt-[clamp(8rem,12vw,10rem)]">
      <div className="rule" />
      <div className="kicker">Our Work</div>
      <h1 className="h1 mt-2 max-w-[16ch]">Before And After</h1>
      <p className="lead mt-4 max-w-[52ch] text-mute-l">
        Shot on a phone at the property. Every photo on this site is one of our jobs, not stock.
      </p>

      <figure className="mt-10 border-t-2 border-ink pt-5">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="h3">Backyard Cleanup In One Visit</h2>
          <p className="max-w-[64ch] text-[0.95rem] text-mute-l">
            Knee-high and full of dry growth when we got there. Cut down, raked out, and hauled
            away the same day. Drag the handle to see it.
          </p>
        </div>
        <BeforeAfter
          beforeSrc="/photos/slide-yard-before.jpg"
          afterSrc="/photos/slide-yard-after.jpg"
          beforeAlt="Backyard overgrown with tall dry grass around a storage shed"
          afterAlt="The same backyard cleared, with the brick path exposed"
        />
      </figure>

      <figure className="mt-12 border-t-2 border-ink pt-5">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="h3">Gutters Cleared Before The Rain</h2>
          <p className="max-w-[64ch] text-[0.95rem] text-mute-l">
            Scooped by hand, downspouts flushed until they ran clear, and the ground underneath
            cleaned up. These two are different sections of the roof, so they sit side by side
            rather than in a slider.
          </p>
        </div>
        <div className="grid max-w-[760px] grid-cols-1 gap-[2px] bg-forest-3 sm:grid-cols-2">
          <div className="relative">
            <span className="tag tag-b">Before</span>
            <Image src="/photos/pair-gutter-before.jpg" alt="Roof gutter packed with leaves and needles" width={1100} height={1375} sizes="380px" className="aspect-[4/5] w-full object-cover" />
          </div>
          <div className="relative">
            <span className="tag tag-a" style={{ right: "auto", left: 0 }}>After</span>
            <Image src="/photos/pair-gutter-after.jpg" alt="A cleared gutter run" width={1100} height={1375} sizes="380px" className="aspect-[4/5] w-full object-cover" />
          </div>
        </div>
      </figure>

      <h2 className="h2 mt-16">Finished Work</h2>
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
        {["/photos/svc-beds.jpg", "/photos/svc-shrub.jpg", "/photos/svc-mowing.jpg"].map((src) => (
          <div key={src} className="relative aspect-[4/3] overflow-hidden bg-forest-2">
            <Image src={src} alt="Finished Green Line lawn care work" fill sizes="(min-width:1080px) 33vw, 50vw" className="object-cover" />
          </div>
        ))}
      </div>

      <div className="mt-14 border-l-[3px] border-lime pl-6">
        <p className="h3 max-w-[24ch]">Yours Could Be The Next One.</p>
        <Link href="/estimate" className="btn btn-p mt-5">Get A Free Estimate</Link>
      </div>
    </div>
  );
}
