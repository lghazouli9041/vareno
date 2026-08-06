import { AccountSection } from "@/components/account/AccountSection";
import { AccountWishlistView } from "@/components/account/AccountWishlistView";
import { requireUser } from "@/lib/auth/session";

export default async function AccountWishlistPage() {
  await requireUser();

  return (
    <AccountSection
      title="Wishlist"
      eyebrow="Saved"
      description="Pieces you have reserved for your interior shortlist."
    >
      <AccountWishlistView />
    </AccountSection>
  );
}
