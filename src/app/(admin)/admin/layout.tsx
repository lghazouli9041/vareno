import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth/admin";
import { syncCustomerFromClerk, syncUserFromClerk } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();
  await Promise.all([syncUserFromClerk(user), syncCustomerFromClerk(user)]);

  return <AdminShell>{children}</AdminShell>;
}
