import { AccountSection } from "@/components/account/AccountSection";
import { NotificationsPanel } from "@/components/account/NotificationsPanel";
import { requireUser } from "@/lib/auth/session";

export default async function AccountNotificationsPage() {
  await requireUser();

  return (
    <AccountSection
      title="Notifications"
      eyebrow="Preferences"
      description="Choose how VARENO keeps you informed."
    >
      <NotificationsPanel />
    </AccountSection>
  );
}
