"use client";

import { usePathname } from "next/navigation";
import { SITE } from "@/data/site";

export default function UtilityBar() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <div className="gl-util">
      <div className="mx-auto flex max-w-[1340px] flex-wrap items-center justify-between gap-6 px-[clamp(1.1rem,4.2vw,4rem)] py-2">
        <div className="hidden gap-6 text-[#d5ded2] sm:flex">
          <span>Serving The East Bay</span>
          <span>Monday To Friday, {SITE.hours.open} To {SITE.hours.close}</span>
          <span>Licensed And Insured</span>
        </div>
        <span>
          Free Estimates:{" "}
          <a href={`tel:${SITE.phoneE164}`} className="font-bold text-white">
            {SITE.phoneDisplay}
          </a>
        </span>
      </div>
    </div>
  );
}
