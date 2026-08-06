import { ProductEditor } from "@/components/admin/ProductEditor";

type Props = { params: Promise<{ id: string }> };

export default async function AdminEditProductPage({ params }: Props) {
  const { id } = await params;
  return <ProductEditor productId={decodeURIComponent(id)} />;
}
