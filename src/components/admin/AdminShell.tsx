"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import "@/app/admin/admin.css";

type NavItem = { href: string; label: string; icon: string };
type NavGroup = { section: string | null; items: NavItem[] };

// Single-path SVG icons (stroke). Kept simple so they render crisp at 18px.
const NAV: NavGroup[] = [
  {
    section: null,
    items: [{ href: "/admin", label: "Home", icon: "M3 10.5 12 3l9 7.5 M5 9.5V20h14V9.5 M9.5 20v-6h5v6" }],
  },
  {
    section: "Work",
    items: [
      { href: "/admin/calendar", label: "Schedule", icon: "M4 5h16v15H4z M4 9h16 M8 3v4 M16 3v4" },
      { href: "/admin/leads", label: "Requests", icon: "M4 6h16 M4 12h16 M4 18h10" },
    ],
  },
  {
    section: "Clients",
    items: [
      { href: "/admin/contacts", label: "Customers", icon: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" },
    ],
  },
  {
    section: "Account",
    items: [
      { href: "/admin/settings", label: "Settings", icon: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z M12 4v2 M12 18v2 M4 12h2 M18 12h2 M6 6l1.5 1.5 M16.5 16.5 18 18 M18 6l-1.5 1.5 M7.5 16.5 6 18" },
    ],
  },
];

const TITLES: Record<string, string> = {
  "/admin": "Home",
  "/admin/calendar": "Schedule",
  "/admin/leads": "Requests",
  "/admin/contacts": "Customers",
  "/admin/settings": "Settings",
};

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

export default function AdminShell({
  children,
  newLeadCount = 0,
}: {
  children: React.ReactNode;
  newLeadCount?: number;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Login owns the whole screen: no shell chrome at all.
  if (pathname === "/admin/login") {
    return <div style={{ height: "100dvh", overflow: "hidden" }}>{children}</div>;
  }

  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  const title =
    TITLES[pathname] ??
    (pathname.startsWith("/admin/leads") ? "Requests"
      : pathname.startsWith("/admin/jobs") ? "Schedule"
      : pathname.startsWith("/admin/contacts") ? "Customers"
      : "Admin");

  return (
    <div className="gladmin">
      <div className="gladmin-shell">
        {open && <div className="gladmin-overlay" onClick={() => setOpen(false)} />}

        <aside className={`gladmin-sidebar${open ? " open" : ""}`}>
          <div className="gladmin-brand">
            <Image src="/brand/logo.png" alt="Green Line Lawn Care" width={644} height={366} />
            <span>Admin</span>
          </div>
          <nav className="gladmin-nav" aria-label="Admin">
            {NAV.map((group, gi) => (
              <div key={gi}>
                {group.section && <div className="gladmin-nav-label">{group.section}</div>}
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`gladmin-item${isActive(item.href) ? " active" : ""}`}
                    aria-current={isActive(item.href) ? "page" : undefined}
                  >
                    <Icon d={item.icon} />
                    {item.label}
                    {item.href === "/admin/leads" && newLeadCount > 0 && (
                      <span className="gladmin-badge">{newLeadCount}</span>
                    )}
                  </Link>
                ))}
              </div>
            ))}
          </nav>
          <div className="gladmin-foot">
            <a href="/" target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6 M15 3h6v6 M10 14 21 3" />
              </svg>
              View website
            </a>
          </div>
        </aside>

        <div className="gladmin-main">
          <header className="gladmin-topbar">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button className="gladmin-toggle" onClick={() => setOpen(true)} aria-label="Open menu">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M3 6h18 M3 12h18 M3 18h18" />
                </svg>
              </button>
              <span className="gladmin-topbar-title">{title}</span>
            </div>
            <div className="gladmin-topbar-right">
              <Link href="/admin/contacts/new" className="gladmin-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M12 5v14 M5 12h14" />
                </svg>
                New
              </Link>
            </div>
          </header>

          <main className="gladmin-content">{children}</main>
        </div>
      </div>
    </div>
  );
}
