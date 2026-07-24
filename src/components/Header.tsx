"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { SITE } from "@/data/site";

const nav = [
  { href: "/services", label: "Services" },
  { href: "/work", label: "Our Work" },
  { href: "/#process", label: "How It Works" },
  { href: "/reviews", label: "Reviews" },
  { href: "/areas", label: "Service Area" },
  { href: "/#faq", label: "FAQ" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Header sits transparent over the hero and turns solid on scroll.
  // The transparent logo is what makes this possible.
  useEffect(() => {
    let ticking = false;
    const apply = () => {
      document.body.classList.toggle("scrolled", window.scrollY > 60);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(apply);
      }
    };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="gl-header">
      <div className="gl-nav mx-auto flex max-w-[1340px] items-center justify-between gap-6 px-[clamp(1.1rem,4.2vw,4rem)]">
        <Link href="/" aria-label="Green Line Lawn Care, home" onClick={() => setOpen(false)}>
          <Image src="/brand/logo.png" alt="Green Line Lawn Care" width={644} height={366} priority className="gl-logo" />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="gl-navlink">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden text-right leading-tight sm:block">
            <div className="text-[0.72rem] uppercase tracking-[0.09em] text-[#c3d0bf]">Call Or Text</div>
            <a
              href={`tel:${SITE.phoneE164}`}
              className="font-[family-name:var(--font-display)] text-[1.24rem] text-white hover:opacity-80"
              style={{ fontVariationSettings: '"wdth" 92, "wght" 750' }}
            >
              {SITE.phoneDisplay}
            </a>
          </div>
          <Link href="/estimate" className="btn btn-l hidden md:inline-flex">
            Free Estimate
          </Link>
          <button
            type="button"
            className="grid h-12 w-12 place-items-center border border-white/35 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}
          >
            <span aria-hidden="true" className="relative block h-[2px] w-6 bg-white before:absolute before:-top-2 before:block before:h-[2px] before:w-6 before:bg-white after:absolute after:top-2 after:block after:h-[2px] after:w-6 after:bg-white" />
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Main" className="bg-black px-[clamp(1.1rem,4.2vw,4rem)] pb-6 lg:hidden">
          <ul>
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} onClick={() => setOpen(false)} className="block border-b border-white/12 py-4 text-lg font-semibold text-white">
                  {n.label}
                </Link>
              </li>
            ))}
            <li className="pt-4">
              <Link href="/estimate" onClick={() => setOpen(false)} className="btn btn-l w-full">
                Get A Free Estimate
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
