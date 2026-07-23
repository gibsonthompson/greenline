"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SITE } from "@/data/site";
import { services } from "@/data/services";

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="on-dark bg-field text-paper">
      <div aria-hidden="true" className="h-2 bg-black" />
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-4 md:px-8">
        <div>
          <Image src="/brand/logo-nav.jpg" alt="Green Line Lawn Care" width={121} height={72} className="h-10 w-auto" />
          <p className="mt-4 max-w-[36ch] text-[0.95rem] text-paper/80">
            Professional lawn maintenance, cleanups, edging, trimming, weed removal, and property
            upkeep across the East Bay. Reliable service, clean results, free estimates.
          </p>
        </div>

        <div>
          <h2 className="t-label text-paper/60">Services</h2>
          <ul className="mt-3 space-y-2">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="text-[0.95rem] hover:text-turf">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="t-label text-paper/60">Company</h2>
          <ul className="mt-3 space-y-2">
            <li><Link href="/areas" className="text-[0.95rem] hover:text-turf">Service areas</Link></li>
            <li><Link href="/work" className="text-[0.95rem] hover:text-turf">Our work</Link></li>
            <li><Link href="/reviews" className="text-[0.95rem] hover:text-turf">Reviews</Link></li>
            <li><Link href="/about" className="text-[0.95rem] hover:text-turf">About</Link></li>
            <li><Link href="/blog" className="text-[0.95rem] hover:text-turf">Blog</Link></li>
            <li><Link href="/admin" className="text-[0.95rem] text-paper/60 hover:text-turf">Admin</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="t-label text-paper/60">Contact</h2>
          <ul className="mt-3 space-y-2 text-[0.95rem]">
            <li><a href={`tel:${SITE.phoneE164}`} className="font-semibold hover:text-turf">{SITE.phoneDisplay}</a></li>
            <li><a href={`mailto:${SITE.email}`} className="hover:text-turf">{SITE.email}</a></li>
            <li className="text-paper/80">{SITE.hours.days}, {SITE.hours.open} to {SITE.hours.close}</li>
            <li className="flex gap-4 pt-2">
              <a href={SITE.instagram} rel="noopener" className="hover:text-turf">Instagram</a>
              <a href={SITE.facebook} rel="noopener" className="hover:text-turf">Facebook</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-paper/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-5 text-[0.85rem] text-paper/60 md:px-8">
          <p>&copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <p className="flex gap-5">
            <Link href="/privacy" className="hover:text-turf">Privacy</Link>
            <Link href="/terms" className="hover:text-turf">Terms</Link>
            <Link href="/sms-terms" className="hover:text-turf">SMS terms</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
