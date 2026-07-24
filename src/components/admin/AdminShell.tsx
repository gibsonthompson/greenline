"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SITE } from "@/data/site";

const nav = [
  { href: "/admin", label: "Today", icon: "M4 5h16v15H4z M4 9h16 M8 3v4 M16 3v4" },
  { href: "/admin/leads", label: "Leads", icon: "M4 6h16 M4 12h16 M4 18h10" },
  { href: "/admin/calendar", label: "Schedule", icon: "M4 5h16v15H4z M4 9h16 M8 3v4 M16 3v4" },
  { href: "/admin/contacts", label: "Customers", icon: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" },
  { href: "/admin/settings", label: "Settings", icon: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z M4 12h2 M18 12h2 M12 4v2 M12 18v2" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Login owns the whole screen: no header, no bottom nav, no scroll.
  if (pathname === "/admin/login") {
    return <div style={{ height: "100dvh", overflow: "hidden" }}>{children}</div>;
  }

  return (
    <div style={{ height: "100dvh", overflow: "hidden" }} className="flex flex-col bg-paper-2">
      {/* fixed top bar, extends into the notch, cannot be pulled down */}
      <header className="flex-none bg-black" style={{ paddingTop: "env(safe-area-inset-top)" }}>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <Link href="/admin" className="flex items-center gap-3">
            <Image src="/brand/logo.png" alt="" width={644} height={366} className="h-8 w-auto" />
            <span className="hidden text-[0.78rem] uppercase tracking-[0.14em] text-lime-br sm:block">Admin</span>
          </Link>

          <nav aria-label="Admin" className="hidden items-center gap-1 lg:flex">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="rounded-sm px-3 py-2 text-[0.92rem] font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${SITE.phoneE164}`}
              className="hidden rounded-sm border border-white/25 px-3 py-2 text-[0.85rem] font-semibold text-white sm:block"
            >
              {SITE.phoneDisplay}
            </a>
            <Link href="/" className="rounded-sm bg-lime px-3 py-2 text-[0.85rem] font-bold text-ink">
              View Site
            </Link>
          </div>
        </div>
      </header>

      {/* the only scrolling region; overscroll contained so nothing rubber-bands */}
      <main className="flex-1 overflow-y-auto" style={{ overscrollBehavior: "none", WebkitOverflowScrolling: "touch" }}>
        <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>
      </main>

      {/* fixed bottom nav, thumb-reachable, safe-area padded */}
      <nav
        aria-label="Admin"
        className="flex-none grid grid-cols-5 border-t border-line bg-white lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {nav.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className="flex min-h-[60px] flex-col items-center justify-center gap-1 text-[0.7rem] font-semibold text-mute-l"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
              <path d={n.icon} strokeLinecap="round" />
            </svg>
            {n.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
