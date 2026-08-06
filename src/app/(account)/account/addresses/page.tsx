import { AccountSection } from "@/components/account/AccountSection";
import { AddressBook } from "@/components/account/AddressBook";
import { getAddressesForEmail } from "@/lib/account/data";
import { getPrimaryEmail, requireUser } from "@/lib/auth/session";
import type { ManagedAddress } from "@/store/address-book";

export default async function AccountAddressesPage() {
  const user = await requireUser();
  const email = getPrimaryEmail(user);
  const addresses = email ? await getAddressesForEmail(email) : [];

  const serverAddresses: ManagedAddress[] = addresses.map((address) => ({
    id: address.id,
    firstName: address.firstName,
    lastName: address.lastName,
    company: address.company ?? undefined,
    line1: address.line1,
    line2: address.line2 ?? undefined,
    city: address.city,
    state: address.state,
    postalCode: address.postalCode,
    country: address.country,
    phone: address.phone ?? undefined,
    isDefault: address.isDefault,
    source: "order" as const,
  }));

  return (
    <AccountSection
      title="Addresses"
      eyebrow="Delivery"
      description="Manage default and alternate shipping addresses for your household."
    >
      <AddressBook serverAddresses={serverAddresses} />
    </AccountSection>
  );
}
