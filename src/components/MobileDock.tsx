"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE } from "@/data/site";

export default function MobileDock() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin") || pathname === "/estimate") return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-px bg-black md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <a
        href={`tel:${SITE.phoneE164}`}
        className="flex min-h-[52px] items-center justify-center bg-black font-semibold text-paper"
      >
        Call {SITE.phoneDisplay}
      </a>
      <Link
        href="/estimate"
        className="flex min-h-[52px] items-center justify-center bg-turf-fill font-semibold text-white"
      >
        Free estimate
      </Link>
    </div>
  );
}
