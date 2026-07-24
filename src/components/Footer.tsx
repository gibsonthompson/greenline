"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SITE } from "@/data/site";
import { services } from "@/data/services";
import { cityPages } from "@/data/city-pages";

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="bg-[#08240E] text-paper">
      <div className="mx-auto grid max-w-[1340px] gap-8 px-[clamp(1.1rem,4.2vw,4rem)] py-[clamp(3rem,5vw,4.2rem)] sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.15fr]">
        <div>
          <Image src="/brand/logo.png" alt="Green Line Lawn Care" width={644} height={366} className="h-[58px] w-auto" />
          <p className="mt-4 max-w-[36ch] text-[0.93rem] text-[#b6c4b2]">
            Mowing, cleanups, gutters, and grounds upkeep for homes and small commercial properties
            across the East Bay.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <span className="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
            <span className="text-[0.88rem] text-[#b6c4b2]">5.0 on Google</span>
          </div>
        </div>

        <div>
          <h2 className="h4 mb-3 text-lime-br">Services</h2>
          <ul className="flex flex-col gap-2">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="text-[0.93rem] text-[#b6c4b2] hover:text-lime-br">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="h4 mb-3 text-lime-br">Service Area</h2>
          <ul className="flex flex-col gap-2">
            {cityPages.slice(0, 7).map((c) => (
              <li key={c.slug}>
                <Link href={`/areas/${c.slug}`} className="text-[0.93rem] text-[#b6c4b2] hover:text-lime-br">
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/areas" className="text-[0.93rem] text-[#b6c4b2] hover:text-lime-br">
                All Service Areas
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="h4 mb-3 text-lime-br">Contact</h2>
          <ul className="flex flex-col gap-2">
            <li>
              <a
                href={`tel:${SITE.phoneE164}`}
                className="font-[family-name:var(--font-display)] text-[1.2rem] text-white hover:text-lime-br"
                style={{ fontVariationSettings: '"wdth" 92, "wght" 750' }}
              >
                {SITE.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`} className="text-[0.93rem] text-[#b6c4b2] hover:text-lime-br">
                {SITE.email}
              </a>
            </li>
            <li className="text-[0.9rem] text-[#8fa08c]">
              Monday To Friday, {SITE.hours.open} To {SITE.hours.close}
            </li>
            <li className="text-[0.9rem] text-[#8fa08c]">Licensed And Insured</li>
            <li className="flex gap-4 pt-1">
              <a href={SITE.instagram} rel="noopener" className="text-[0.93rem] text-[#b6c4b2] hover:text-lime-br">Instagram</a>
              <a href={SITE.facebook} rel="noopener" className="text-[0.93rem] text-[#b6c4b2] hover:text-lime-br">Facebook</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-mute-d/20">
        <div className="mx-auto flex max-w-[1340px] flex-wrap items-center justify-between gap-4 px-[clamp(1.1rem,4.2vw,4rem)] py-5 text-[0.85rem] text-[#8fa08c]">
          <p>&copy; {new Date().getFullYear()} {SITE.name}. All Rights Reserved.</p>
          <p className="flex gap-6">
            <Link href="/privacy" className="hover:text-lime-br">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-lime-br">Terms Of Service</Link>
            <Link href="/sms-terms" className="hover:text-lime-br">SMS Terms</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
