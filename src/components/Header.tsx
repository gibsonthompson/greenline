"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { SITE } from "@/data/site";

const nav = [
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/reviews", label: "Reviews" },
  { href: "/areas", label: "Areas" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="on-dark bg-black text-paper">
      <div className="mx-auto flex h-[60px] max-w-6xl items-center justify-between px-5 md:h-[72px] md:px-8">
        <Link href="/" aria-label="Green Line Lawn Care, home" onClick={() => setOpen(false)}>
          <Image
            src="/brand/logo-nav.jpg"
            alt="Green Line Lawn Care"
            width={121}
            height={72}
            priority
            className="h-9 w-auto md:h-11"
          />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-7 md:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="text-[0.95rem] font-medium text-paper transition-colors duration-200 hover:text-turf"
            >
              {n.label}
            </Link>
          ))}
          <a href={`tel:${SITE.phoneE164}`} className="text-[0.95rem] font-semibold text-paper hover:text-turf">
            {SITE.phoneDisplay}
          </a>
          <Link href="/estimate" className="btn btn-fill">
            Free estimate
          </Link>
        </nav>

        <button
          type="button"
          className="grid h-12 w-12 place-items-center md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(!open)}
        >
          <span aria-hidden="true" className="relative block h-[2px] w-6 bg-paper before:absolute before:-top-2 before:block before:h-[2px] before:w-6 before:bg-paper after:absolute after:top-2 after:block after:h-[2px] after:w-6 after:bg-paper" />
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Main" className="border-t border-field px-5 pb-6 md:hidden">
          <ul>
            {nav.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-field py-4 text-lg font-medium text-paper"
                >
                  {n.label}
                </Link>
              </li>
            ))}
            <li className="pt-4">
              <Link href="/estimate" onClick={() => setOpen(false)} className="btn btn-fill w-full">
                Get a free estimate
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
