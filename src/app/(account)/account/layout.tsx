import type { Metadata } from "next";
import { AccountNav } from "@/components/account/AccountNav";
import { Container } from "@/components/layout/Container";
import {
  requireUser,
  syncCustomerFromClerk,
  syncUserFromClerk,
} from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Account",
  robots: { index: false, follow: false },
};

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  await Promise.all([
    syncCustomerFromClerk(user),
    syncUserFromClerk(user),
  ]);

  return (
    <div className="min-h-screen bg-background pt-28 pb-20 md:pt-32">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <p className="mb-4 text-[10px] uppercase tracking-[0.22em] text-accent">
              My Account
            </p>
            <div className="border border-border bg-background p-3 md:p-4">
              <AccountNav />
            </div>
          </aside>
          <div className="min-w-0">{children}</div>
        </div>
      </Container>
    </div>
  );
}
