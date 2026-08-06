import { AccountSection } from "@/components/account/AccountSection";
import { SecurityPanel } from "@/components/account/SecurityPanel";
import { requireUser } from "@/lib/auth/session";

export default async function AccountSecurityPage() {
  await requireUser();

  return (
    <AccountSection
      title="Security"
      eyebrow="Protection"
      description="Credentials, verification, and session oversight."
    >
      <SecurityPanel />
    </AccountSection>
  );
}
