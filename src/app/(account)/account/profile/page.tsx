import { AccountSection } from "@/components/account/AccountSection";
import { ProfileEditor } from "@/components/account/ProfileEditor";
import { getPrimaryEmail, requireUser } from "@/lib/auth/session";

export default async function AccountProfilePage() {
  const user = await requireUser();
  const email = getPrimaryEmail(user);

  return (
    <AccountSection
      title="Profile"
      eyebrow="Identity"
      description="Your personal details for a refined VARENO experience."
    >
      <ProfileEditor
        firstName={user.firstName ?? ""}
        lastName={user.lastName ?? ""}
        email={email}
        initialPhone={user.phoneNumbers[0]?.phoneNumber}
      />
    </AccountSection>
  );
}
