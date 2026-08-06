import { CustomersTable } from "@/components/admin/CustomersTable";
import { getAdminCustomers } from "@/lib/admin/data";

export default async function AdminCustomersPage() {
  const customers = await getAdminCustomers();

  return (
    <CustomersTable
      customers={customers.map((customer) => ({
        id: customer.id,
        email: customer.email,
        name:
          [customer.firstName, customer.lastName].filter(Boolean).join(" ") ||
          customer.email,
        orderCount: customer.orders.length,
        lifetimeValue: customer.orders.reduce(
          (sum, order) => sum + Number(order.total),
          0,
        ),
        createdAt: customer.createdAt.toISOString(),
      }))}
    />
  );
}
