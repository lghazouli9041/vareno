"use client";

import { useId, useState } from "react";
import { ChevronDown, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import type { CatalogFinishOption, CatalogProduct } from "@/types/catalog";

type AccordionId =
  | "specifications"
  | "handmade"
  | "installation"
  | "warranty"
  | "shipping"
  | "returns"
  | "downloads";

const SECTIONS: Array<{ id: AccordionId; label: string }> = [
  { id: "specifications", label: "Specifications" },
  { id: "handmade", label: "Handmade Craft" },
  { id: "installation", label: "Installation" },
  { id: "warranty", label: "Warranty" },
  { id: "shipping", label: "Shipping" },
  { id: "returns", label: "Returns" },
  { id: "downloads", label: "Download PDF" },
];

interface ProductInfoSectionsProps {
  product: CatalogProduct;
  selectedFinish?: CatalogFinishOption;
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[1fr_auto] gap-6 border-b border-border py-4 text-sm last:border-0">
      <dt className="uppercase tracking-[0.14em] text-muted">{label}</dt>
      <dd className="text-right text-primary">{value}</dd>
    </div>
  );
}

export function ProductInfoSections({
  product,
  selectedFinish,
}: ProductInfoSectionsProps) {
  const baseId = useId();
  const [open, setOpen] = useState<AccordionId | null>("specifications");
  const finish = selectedFinish ?? product.finishOptions[0];

  const dimensionRows = (
    [
      ["Height", product.dimensions.height],
      ["Spout reach", product.dimensions.spoutReach],
      ["Spout height", product.dimensions.spoutHeight],
      ["Max deck thickness", product.dimensions.maxDeckThickness],
    ] as const
  ).filter(([, value]) => Boolean(value));

  return (
    <section
      className="border-t border-border py-20 md:py-28"
      aria-labelledby={`${baseId}-heading`}
    >
      <div className="mx-auto max-w-3xl">
        <p className="text-[10px] uppercase tracking-[0.28em] text-accent">
          Atelier Details
        </p>
        <h2
          id={`${baseId}-heading`}
          className="mt-4 font-display text-3xl text-primary md:text-5xl"
        >
          Luxury Specifications
        </h2>
        <p className="mt-6 text-base leading-[1.9] text-muted md:text-lg">
          {product.marketingDescription}
        </p>

        <div className="mt-12 divide-y divide-border border-y border-border">
          {SECTIONS.map((section) => {
            const isOpen = open === section.id;
            const panelId = `${baseId}-panel-${section.id}`;
            const buttonId = `${baseId}-btn-${section.id}`;

            return (
              <div key={section.id}>
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() =>
                      setOpen((current) =>
                        current === section.id ? null : section.id,
                      )
                    }
                    className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-accent"
                  >
                    <span className="text-sm uppercase tracking-[0.16em] text-primary">
                      {section.label}
                    </span>
                    <ChevronDown
                      size={18}
                      strokeWidth={1.4}
                      className={cn(
                        "shrink-0 text-muted transition-transform duration-500",
                        isOpen && "rotate-180",
                      )}
                      aria-hidden="true"
                    />
                  </button>
                </h3>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                  className={cn("pb-6", !isOpen && "hidden")}
                >
                  {section.id === "specifications" && (
                    <dl>
                      <SpecRow label="Material" value="Solid brass" />
                      <SpecRow
                        label="Finish"
                        value={finish?.name ?? "Atelier finish"}
                      />
                      <SpecRow label="Handmade" value="Hand finished in atelier" />
                      <SpecRow label="Category" value={product.category} />
                      <SpecRow label="SKU" value={finish?.sku ?? product.sku} />
                      <SpecRow label="Warranty" value={product.warranty} />
                      {dimensionRows.map(([label, value]) => (
                        <SpecRow key={label} label={label} value={value!} />
                      ))}
                    </dl>
                  )}

                  {section.id === "handmade" && (
                    <div className="space-y-3 text-sm leading-[1.9] text-muted">
                      <p>
                        Each {product.name} begins as solid brass—cast, machined,
                        and finished by hand. Surfaces are polished, antiqued, or
                        aged until the metal carries the quiet authority of
                        European atelier tradition.
                      </p>
                      <p>
                        No piece leaves the workshop without inspection for
                        weight, cartridge feel, and finish integrity.
                      </p>
                    </div>
                  )}

                  {section.id === "installation" && (
                    <div className="space-y-3 text-sm leading-[1.9] text-muted">
                      <p>
                        Professional installation is recommended. Confirm deck
                        thickness, use the included template, and protect
                        finishes during fitting.
                      </p>
                      <p>
                        Your VARENO concierge can coordinate with architects and
                        installers on complex renovations.
                      </p>
                    </div>
                  )}

                  {section.id === "warranty" && (
                    <p className="text-sm leading-[1.9] text-muted">
                      {product.warranty}. Finishes and function are covered
                      against manufacturing defects for the life of the product
                      under normal residential use. Trade terms available on
                      request.
                    </p>
                  )}

                  {section.id === "shipping" && (
                    <div className="space-y-3 text-sm leading-[1.9] text-muted">
                      <p>
                        Complimentary shipping on orders over $
                        {siteConfig.shipping.freeThreshold}. In-stock pieces
                        typically ship within 2 business days; standard delivery
                        arrives in {siteConfig.shipping.standardDays} business
                        days.
                      </p>
                      <p>
                        Every fixture is white-glove packed—nested, cushioned,
                        and sealed for international transit.
                      </p>
                    </div>
                  )}

                  {section.id === "returns" && (
                    <p className="text-sm leading-[1.9] text-muted">
                      Uninstalled products may be returned within 30 days in
                      original packaging. Custom and made-to-order finishes are
                      final sale. See Shipping & Returns for full policy.
                    </p>
                  )}

                  {section.id === "downloads" && (
                    <ul className="space-y-3">
                      {[
                        {
                          label: "Specification Sheet",
                          href: "/shipping-returns",
                        },
                        {
                          label: "Installation Guide",
                          href: "/warranty",
                        },
                        {
                          label: "Finish Care Guide",
                          href: "/about",
                        },
                      ].map((item) => (
                        <li key={item.label}>
                          <a
                            href={item.href}
                            className="group inline-flex items-center gap-3 text-sm text-primary transition-colors hover:text-accent"
                          >
                            <FileText
                              size={16}
                              strokeWidth={1.4}
                              className="text-accent transition-transform duration-500 group-hover:translate-x-0.5"
                              aria-hidden="true"
                            />
                            {item.label}
                            <span className="text-[10px] uppercase tracking-[0.18em] text-muted">
                              PDF
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
