import { OrdersBoard } from "@/components/admin/OrdersBoard";
import { getAdminOrders } from "@/lib/admin/data";

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return (
    <OrdersBoard
      orders={orders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        createdAt: order.createdAt.toISOString(),
        total: Number(order.total),
        currency: order.currency,
        customerEmail: order.customerEmail,
        itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
      }))}
    />
  );
}
