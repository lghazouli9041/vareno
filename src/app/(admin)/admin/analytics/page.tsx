import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";
import { getProductionAnalytics } from "@/lib/admin/analytics";

export default async function AdminAnalyticsPage() {
  const data = await getProductionAnalytics();

  return (
    <AnalyticsDashboard
      data={{
        revenue: data.kpis.revenue,
        orders: data.kpis.orders,
        returningCustomers: data.returningCustomers,
        revenueSeries: data.revenueSeries,
        ordersSeries: data.ordersSeries,
        topProducts: data.topProducts,
        topCollections: data.topCollections,
        averageOrderValue: data.kpis.averageOrderValue,
        customers: data.kpis.customers,
        conversion: data.kpis.conversion,
      }}
    />
  );
}
