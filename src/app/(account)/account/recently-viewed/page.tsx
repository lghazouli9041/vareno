import { AccountSection } from "@/components/account/AccountSection";
import { RecentlyViewedPanel } from "@/components/account/RecentlyViewedPanel";
import { requireUser } from "@/lib/auth/session";

export default async function AccountRecentlyViewedPage() {
  await requireUser();

  return (
    <AccountSection
      title="Recently Viewed"
      eyebrow="History"
      description="Return to pieces you have explored across the collection."
    >
      <RecentlyViewedPanel />
    </AccountSection>
  );
}
