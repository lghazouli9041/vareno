"use client";

import Image from "next/image";
import { memo } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { GitCompareArrows, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion as motionTokens } from "@/constants/design";
import { useCatalogProductsByIds } from "@/hooks/useCatalogSnapshot";
import { COMPARE_LIMIT, useCompareStore } from "@/store/compare";

function CompareBarComponent() {
  const reduceMotion = useReducedMotion();
  const ease = motionTokens.easeLuxury;
  const productIds = useCompareStore((s) => s.productIds);
  const remove = useCompareStore((s) => s.remove);
  const clear = useCompareStore((s) => s.clear);
  const { products } = useCatalogProductsByIds(productIds);

  const open = productIds.length > 0;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="region"
          aria-label="Product comparison"
          className="fixed inset-x-0 bottom-0 z-[80] border-t border-border bg-background/95 px-4 py-4 shadow-xl backdrop-blur-md md:px-8"
          initial={reduceMotion ? false : { y: "100%" }}
          animate={{ y: 0 }}
          exit={reduceMotion ? undefined : { y: "100%" }}
          transition={{ duration: reduceMotion ? 0 : 0.4, ease }}
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 flex-1 items-center gap-3 overflow-x-auto">
              <div className="hidden shrink-0 sm:block">
                <p className="text-[10px] uppercase tracking-[0.2em] text-accent">
                  Compare
                </p>
                <p className="mt-1 text-sm text-muted">
                  {products.length || productIds.length} of {COMPARE_LIMIT}
                </p>
              </div>

              <ul className="flex items-center gap-3">
                {products.map((product) => (
                  <li
                    key={product.id}
                    className="relative h-16 w-14 shrink-0 overflow-hidden bg-surface sm:h-20 sm:w-16"
                  >
                    <Image
                      src={product.featuredImage}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                    <button
                      type="button"
                      onClick={() => remove(product.id)}
                      className="absolute right-0.5 top-0.5 bg-background/90 p-0.5 text-primary transition-colors hover:text-error"
                      aria-label={`Remove ${product.name} from compare`}
                    >
                      <X size={12} strokeWidth={1.5} />
                    </button>
                  </li>
                ))}
                {Array.from({
                  length: Math.max(
                    0,
                    COMPARE_LIMIT - (products.length || productIds.length),
                  ),
                }).map((_, index) => (
                  <li
                    key={`slot-${index}`}
                    className="hidden h-16 w-14 shrink-0 border border-dashed border-border sm:block sm:h-20 sm:w-16"
                    aria-hidden="true"
                  />
                ))}
              </ul>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={clear}
                className="px-2 py-2 text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-primary"
              >
                Clear
              </button>
              {products.length >= 2 ? (
                <Button
                  href="/compare"
                  variant="gold"
                  size="sm"
                  className="inline-flex items-center gap-2"
                >
                  <GitCompareArrows size={14} strokeWidth={1.5} />
                  Compare ({products.length})
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="gold"
                  size="sm"
                  className="inline-flex items-center gap-2"
                  disabled
                >
                  <GitCompareArrows size={14} strokeWidth={1.5} />
                  Compare
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const CompareBar = memo(CompareBarComponent);
