import type { Metadata } from "next";
import ServiceIndex from "@/components/ServiceIndex";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Lawn mowing, edging, cleanups, weed removal, hedge trimming, gutter cleaning, and commercial upkeep across the East Bay. Free same-day estimates.",
};

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:px-8">
      <h1 className="t-display-lg max-w-[18ch]">Everything we take care of</h1>
      <p className="t-body-lg mt-4 max-w-[52ch] text-ink-60">
        One crew, one standard. Every visit ends with the edges cut, the debris gone, and the
        walks blown clean.
      </p>
      <ServiceIndex />
      <p className="mt-12">
        <Link href="/estimate" className="btn btn-fill">
          Get a free estimate
        </Link>
      </p>
    </div>
  );
}
