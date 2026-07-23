import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Green Line Admin" },
  robots: { index: false, follow: false },
};

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/contacts", label: "Contacts" },
  { href: "/admin/calendar", label: "Calendar" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-concrete-10">
      <div className="on-dark bg-black">
        <nav
          aria-label="Admin"
          className="mx-auto flex max-w-5xl items-center gap-1 overflow-x-auto px-4 py-2"
        >
          <span className="mr-3 whitespace-nowrap font-[family-name:var(--font-display)] font-bold text-turf">
            GL
          </span>
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="whitespace-nowrap rounded-sm px-3 py-2 text-[0.95rem] font-medium text-paper hover:bg-field"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mx-auto max-w-5xl px-4 py-8">{children}</div>
    </div>
  );
}
