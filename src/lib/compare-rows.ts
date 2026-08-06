import type { CatalogProduct } from "@/types/catalog";

export const COMPARE_PLACEHOLDER = "—";

export type CompareRowKey =
  | "price"
  | "finish"
  | "material"
  | "dimensions"
  | "collection"
  | "waterFlow"
  | "warranty"
  | "features";

export type CompareRow = {
  key: CompareRowKey;
  label: string;
  values: string[];
};

function formatDimensions(product: CatalogProduct): string {
  const { height, spoutReach, spoutHeight, maxDeckThickness } =
    product.dimensions;
  const parts = [
    height ? `H ${height}` : null,
    spoutReach ? `Reach ${spoutReach}` : null,
    spoutHeight ? `Spout ${spoutHeight}` : null,
    maxDeckThickness ? `Deck ${maxDeckThickness}` : null,
  ].filter(Boolean);
  return parts.length ? parts.join(" · ") : COMPARE_PLACEHOLDER;
}

function finishLabel(product: CatalogProduct): string {
  const names = product.finishOptions.map((f) => f.name).filter(Boolean);
  if (!names.length) return COMPARE_PLACEHOLDER;
  if (names.length <= 2) return names.join(", ");
  return `${names.slice(0, 2).join(", ")} +${names.length - 2}`;
}

function collectionLabel(
  product: CatalogProduct,
  collectionNames?: Record<string, string>,
): string {
  return (
    collectionNames?.[product.collection] ??
    product.collection ??
    COMPARE_PLACEHOLDER
  );
}

function priceLabel(product: CatalogProduct): string {
  const prices = product.finishOptions.map((f) => f.price);
  const min = prices.length ? Math.min(...prices) : product.price;
  if (!min && min !== 0) return COMPARE_PLACEHOLDER;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(min);
}

/** Build comparison rows. Missing catalog fields use a clean placeholder. */
export function buildCompareRows(
  products: CatalogProduct[],
  collectionNames?: Record<string, string>,
): CompareRow[] {
  const cell = (fn: (p: CatalogProduct) => string) =>
    products.map((product) => {
      const value = fn(product)?.trim();
      return value || COMPARE_PLACEHOLDER;
    });

  return [
    { key: "price", label: "Price", values: cell(priceLabel) },
    { key: "finish", label: "Finish", values: cell(finishLabel) },
    { key: "material", label: "Material", values: cell((p) => p.material) },
    {
      key: "dimensions",
      label: "Dimensions",
      values: cell(formatDimensions),
    },
    {
      key: "collection",
      label: "Collection",
      values: cell((p) => collectionLabel(p, collectionNames)),
    },
    {
      key: "waterFlow",
      label: "Water Flow",
      values: products.map(() => COMPARE_PLACEHOLDER),
    },
    { key: "warranty", label: "Warranty", values: cell((p) => p.warranty) },
    {
      key: "features",
      label: "Features",
      values: products.map(() => COMPARE_PLACEHOLDER),
    },
  ];
}
