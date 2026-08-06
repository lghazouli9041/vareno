import { AdminPageHeader } from "@/components/admin/AdminUi";
import {
  getCatalogCollectionsAsync,
  getCatalogProductsAsync,
} from "@/lib/catalog/repository";

export default async function AdminCollectionsPage() {
  const [collections, products] = await Promise.all([
    getCatalogCollectionsAsync(),
    getCatalogProductsAsync(),
  ]);

  return (
    <div>
      <AdminPageHeader
        title="Collections"
        description="Architectural families that organize the VARENO catalog."
      />
      <ul className="grid gap-4 md:grid-cols-2">
        {collections.map((collection) => {
          const count = products.filter(
            (product) => product.collection === collection.slug,
          ).length;
          return (
            <li
              key={collection.id}
              className="border border-border p-5 md:p-6"
            >
              <p className="text-[10px] uppercase tracking-[0.18em] text-accent">
                Collection
              </p>
              <h2 className="mt-2 font-display text-2xl">{collection.name}</h2>
              <p className="mt-2 text-sm text-muted">{collection.tagline}</p>
              <p className="mt-4 text-xs uppercase tracking-[0.14em] text-muted">
                {count} products
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
