"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { motion as motionTokens } from "@/constants/design";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  name: string;
  images: string[];
}

export function ProductGallery({ name, images }: ProductGalleryProps) {
  const reduceMotion = useReducedMotion();
  const ease = motionTokens.easeLuxury;
  const labelId = useId();
  const gallery = images.length > 0 ? images : ["/brand/monogram.svg"];
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });

  const current = gallery[active] ?? gallery[0];
  const count = gallery.length;

  const go = useCallback(
    (direction: -1 | 1) => {
      setActive((index) => (index + direction + count) % count);
    },
    [count],
  );

  useEffect(() => {
    if (!lightbox) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(false);
      if (event.key === "ArrowLeft") go(-1);
      if (event.key === "ArrowRight") go(1);
    };

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox, go]);

  return (
    <div className="space-y-4 md:space-y-5">
      <div
        className="group relative aspect-[4/5] overflow-hidden bg-surface md:aspect-[3/4] lg:aspect-[4/5]"
        onMouseMove={(event) => {
          if (reduceMotion) return;
          const rect = event.currentTarget.getBoundingClientRect();
          setOrigin({
            x: ((event.clientX - rect.left) / rect.width) * 100,
            y: ((event.clientY - rect.top) / rect.height) * 100,
          });
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.4, ease }}
            className="absolute inset-0"
          >
            <Image
              src={current}
              alt={`${name} — image ${active + 1} of ${count}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 58vw"
              className={cn(
                "object-cover",
                !reduceMotion &&
                  "transition-transform duration-700 ease-out group-hover:scale-[1.12]",
              )}
              style={
                reduceMotion
                  ? undefined
                  : { transformOrigin: `${origin.x}% ${origin.y}%` }
              }
            />
          </motion.div>
        </AnimatePresence>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border/70 bg-background/80 p-2 text-primary opacity-0 backdrop-blur-md transition-opacity duration-300 hover:border-accent hover:text-accent group-hover:opacity-100 focus-visible:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft size={18} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border/70 bg-background/80 p-2 text-primary opacity-0 backdrop-blur-md transition-opacity duration-300 hover:border-accent hover:text-accent group-hover:opacity-100 focus-visible:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight size={18} strokeWidth={1.5} />
            </button>
          </>
        )}

        <button
          type="button"
          onClick={() => setLightbox(true)}
          className="absolute bottom-4 right-4 z-10 inline-flex items-center gap-2 border border-border/70 bg-background/85 px-3.5 py-2 text-[10px] uppercase tracking-[0.2em] text-primary backdrop-blur-md transition-colors hover:border-accent hover:text-accent"
          aria-label="Open full-screen gallery"
        >
          <Expand size={14} strokeWidth={1.5} />
          View
        </button>

        <p className="absolute bottom-4 left-4 text-[10px] uppercase tracking-[0.18em] text-primary/70">
          {active + 1} / {count}
        </p>
      </div>

      <ul
        className="flex gap-2.5 overflow-x-auto pb-1 md:gap-3"
        aria-label="Product image thumbnails"
      >
        {gallery.map((image, index) => (
          <li key={`${image}-${index}`} className="shrink-0">
            <button
              type="button"
              onClick={() => setActive(index)}
              className={cn(
                "relative h-16 w-14 overflow-hidden border transition-all duration-300 md:h-20 md:w-16",
                active === index
                  ? "border-primary"
                  : "border-border/80 opacity-70 hover:opacity-100",
              )}
              aria-label={`Show image ${index + 1}`}
              aria-current={active === index ? "true" : undefined}
            >
              <Image
                src={image}
                alt=""
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-primary/92 p-4 backdrop-blur-md md:p-8"
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelId}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.3, ease }}
          >
            <p id={labelId} className="sr-only">
              {name} gallery — image {active + 1} of {count}
            </p>

            <button
              type="button"
              className="absolute inset-0 cursor-zoom-out"
              aria-label="Close full-screen gallery"
              onClick={() => setLightbox(false)}
            />

            <button
              type="button"
              onClick={() => setLightbox(false)}
              className="absolute right-4 top-4 z-20 rounded-full border border-inverse-text/25 p-2.5 text-inverse-text transition-colors hover:border-accent hover:text-accent md:right-8 md:top-8"
              aria-label="Close full-screen gallery"
            >
              <X size={20} strokeWidth={1.5} />
            </button>

            {count > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  className="absolute left-3 z-20 rounded-full border border-inverse-text/25 p-2.5 text-inverse-text transition-colors hover:border-accent hover:text-accent md:left-8"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={22} strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  className="absolute right-3 z-20 rounded-full border border-inverse-text/25 p-2.5 text-inverse-text transition-colors hover:border-accent hover:text-accent md:right-8"
                  aria-label="Next image"
                >
                  <ChevronRight size={22} strokeWidth={1.5} />
                </button>
              </>
            )}

            <div className="relative z-10 h-[70vh] w-full max-w-5xl md:h-[78vh]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`lb-${current}`}
                  className="absolute inset-0"
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={reduceMotion ? undefined : { opacity: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.3, ease }}
                >
                  <Image
                    src={current}
                    alt={`${name} — fullscreen image ${active + 1}`}
                    fill
                    className="object-contain"
                    sizes="100vw"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <ul className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
              {gallery.map((image, index) => (
                <li key={`dot-${image}-${index}`}>
                  <button
                    type="button"
                    onClick={() => setActive(index)}
                    className={cn(
                      "h-1.5 w-6 transition-colors",
                      active === index ? "bg-accent" : "bg-inverse-text/35",
                    )}
                    aria-label={`Go to image ${index + 1}`}
                    aria-current={active === index ? "true" : undefined}
                  />
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
