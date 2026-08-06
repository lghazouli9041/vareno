import { AccountSection } from "@/components/account/AccountSection";
import { OrdersList } from "@/components/account/OrdersList";
import { toAccountOrders } from "@/lib/account/order-view";
import { getOrdersForEmail } from "@/lib/account/data";
import { getPrimaryEmail, requireUser } from "@/lib/auth/session";

export default async function AccountOrdersPage() {
  const user = await requireUser();
  const email = getPrimaryEmail(user);
  const orders = email ? await getOrdersForEmail(email) : [];

  return (
    <AccountSection
      title="Orders"
      eyebrow="History"
      description="A refined record of every VARENO purchase."
    >
      <OrdersList orders={await toAccountOrders(orders)} />
    </AccountSection>
  );
}
