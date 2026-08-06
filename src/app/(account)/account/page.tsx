import { AccountDashboard } from "@/components/account/AccountDashboard";
import { toAccountOrders } from "@/lib/account/order-view";
import { getAddressesForEmail, getOrdersForEmail } from "@/lib/account/data";
import { getPrimaryEmail, requireUser } from "@/lib/auth/session";

export default async function AccountDashboardPage() {
  const user = await requireUser();
  const email = getPrimaryEmail(user);
  const orders = email ? await getOrdersForEmail(email) : [];
  const addresses = email ? await getAddressesForEmail(email) : [];

  return (
    <AccountDashboard
      firstName={user.firstName}
      email={email}
      orders={await toAccountOrders(orders)}
      addressCount={addresses.length}
    />
  );
}
