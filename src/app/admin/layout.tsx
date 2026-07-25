import type { Metadata, Viewport } from "next";
import AdminShell from "@/components/admin/AdminShell";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import { getAdminClient } from "@/lib/supabase-admin";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Green Line Admin" },
  robots: { index: false, follow: false },
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Green Line" },
};

export const viewport: Viewport = {
  themeColor: "#010101",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = getAdminClient();
  let newLeadCount = 0;
  if (admin) {
    const { count } = await admin
      .from("gl_leads")
      .select("id", { count: "exact", head: true })
      .eq("status", "new");
    newLeadCount = count ?? 0;
  }

  return (
    <>
      <ServiceWorkerRegister />
      <AdminShell newLeadCount={newLeadCount}>{children}</AdminShell>
    </>
  );
}
