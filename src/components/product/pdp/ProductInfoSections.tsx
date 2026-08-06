"use client";

import { useId, useState } from "react";
import { ChevronDown, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import type { CatalogProduct } from "@/types/catalog";

type AccordionId =
  | "specifications"
  | "materials"
  | "installation"
  | "downloads"
  | "warranty"
  | "care"
  | "shipping";

const SECTIONS: Array<{
  id: AccordionId;
  label: string;
}> = [
  { id: "specifications", label: "Technical Specifications" },
  { id: "materials", label: "Materials" },
  { id: "installation", label: "Installation Guide" },
  { id: "downloads", label: "Downloads" },
  { id: "warranty", label: "Warranty" },
  { id: "care", label: "Care Instructions" },
  { id: "shipping", label: "Shipping & Returns" },
];

interface ProductInfoSectionsProps {
  product: CatalogProduct;
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[1fr_auto] gap-6 border-b border-border py-3.5 text-sm last:border-0">
      <dt className="uppercase tracking-[0.12em] text-muted">{label}</dt>
      <dd className="text-right font-medium capitalize text-primary">{value}</dd>
    </div>
  );
}

export function ProductInfoSections({ product }: ProductInfoSectionsProps) {
  const baseId = useId();
  const [open, setOpen] = useState<AccordionId | null>("specifications");

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
      className="border-t border-border py-16 md:py-24"
      aria-labelledby={`${baseId}-heading`}
    >
      <div className="mx-auto max-w-3xl">
        <p className="text-[10px] uppercase tracking-[0.24em] text-accent">
          Details
        </p>
        <h2
          id={`${baseId}-heading`}
          className="mt-3 font-display text-3xl text-primary md:text-4xl"
        >
          Product information
        </h2>
        <p className="mt-5 text-base leading-relaxed text-muted md:text-lg">
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
                      strokeWidth={1.5}
                      className={cn(
                        "shrink-0 text-muted transition-transform duration-300",
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
                      <SpecRow label="Material" value={product.material} />
                      <SpecRow label="Category" value={product.category} />
                      <SpecRow label="Primary SKU" value={product.sku} />
                      <SpecRow
                        label="Availability"
                        value={product.availability.replace(/_/g, " ")}
                      />
                      <SpecRow label="Warranty" value={product.warranty} />
                      {dimensionRows.map(([label, value]) => (
                        <SpecRow key={label} label={label} value={value!} />
                      ))}
                    </dl>
                  )}

                  {section.id === "materials" && (
                    <div className="space-y-3 text-sm leading-relaxed text-muted">
                      <p>
                        {product.name} is crafted from {product.material.toLowerCase()},
                        selected for dimensional stability, corrosion resistance,
                        and a tactile weight that communicates permanence.
                      </p>
                      <p>
                        Finishes are applied with architectural restraint—PVD and
                        specialty coatings calibrated for natural and artificial
                        light in refined American interiors.
                      </p>
                    </div>
                  )}

                  {section.id === "installation" && (
                    <div className="space-y-3 text-sm leading-relaxed text-muted">
                      <p>
                        Professional installation is recommended. Shut off the
                        water supply, confirm deck thickness against product
                        dimensions, and use the included template for precise hole
                        placement.
                      </p>
                      <p>
                        Illustrated instructions ship with every order. For
                        complex renovations, your VARENO concierge can coordinate
                        with your installer.
                      </p>
                    </div>
                  )}

                  {section.id === "downloads" && (
                    <ul className="space-y-3">
                      {[
                        "Specification Sheet (PDF)",
                        "Installation Guide (PDF)",
                        "CAD / BIM Package (PDF)",
                        "Finish Care Guide (PDF)",
                      ].map((label) => (
                        <li key={label}>
                          <a
                            href="/downloads/placeholder.pdf"
                            className="inline-flex items-center gap-3 text-sm text-primary transition-colors hover:text-accent"
                          >
                            <FileText
                              size={16}
                              strokeWidth={1.5}
                              aria-hidden="true"
                            />
                            {label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.id === "warranty" && (
                    <p className="text-sm leading-relaxed text-muted">
                      {product.warranty}. VARENO warrants finishes and function
                      against manufacturing defects for the life of the product
                      under normal residential use. Trade and commercial terms
                      are available on request.
                    </p>
                  )}

                  {section.id === "care" && (
                    <div className="space-y-3 text-sm leading-relaxed text-muted">
                      <p>
                        Clean with a soft cloth and mild, non-abrasive soap.
                        Avoid scouring pads, ammonia, bleach, and polish that can
                        compromise specialty finishes.
                      </p>
                      <p>
                        For hard-water regions, wipe dry after use to preserve
                        luster. Spot-resistant finishes reduce fingerprints but
                        still benefit from gentle, regular care.
                      </p>
                    </div>
                  )}

                  {section.id === "shipping" && (
                    <div className="space-y-3 text-sm leading-relaxed text-muted">
                      <p>
                        Complimentary ground shipping on orders over $
                        {siteConfig.shipping.freeThreshold} within the contiguous
                        United States. In-stock items typically ship within 2
                        business days; standard delivery arrives in{" "}
                        {siteConfig.shipping.standardDays} business days.
                      </p>
                      <p>
                        Made-to-order finishes may require additional lead time.
                        Uninstalled products may be returned within 30 days in
                        original packaging. See Shipping & Returns for full
                        policy details.
                      </p>
                    </div>
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
