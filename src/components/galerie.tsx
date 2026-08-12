"use client";

/**
 * Adapted from "Gallery Grid with Lightbox" by @moumensoliman on 21st.dev.
 *
 * Kept: the filter + grid + lightbox structure and its ARIA roles.
 * Changed: shadcn Card/Badge/Button swapped for this site's tokens, <img>
 * swapped for next/image, and the lightbox gained Escape-to-close, arrow-key
 * navigation and focus restore, which the original left to its buttons.
 */

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { galleryPhotos } from "@/lib/content";
import { cn, photo } from "@/lib/utils";
import { SectionHeading } from "./section-heading";

const GROUPS = ["Vše", ...Array.from(new Set(galleryPhotos.map((p) => p.group)))];

export function Galerie() {
  const [filter, setFilter] = useState("Vše");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const lastFocused = useRef<HTMLElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const visible =
    filter === "Vše"
      ? galleryPhotos
      : galleryPhotos.filter((p) => p.group === filter);

  const open = (index: number) => {
    lastFocused.current = document.activeElement as HTMLElement;
    setOpenIndex(index);
  };

  const close = useCallback(() => {
    setOpenIndex(null);
    lastFocused.current?.focus();
  }, []);

  const step = useCallback(
    (delta: number) =>
      setOpenIndex((i) =>
        i === null ? i : (i + delta + visible.length) % visible.length
      ),
    [visible.length]
  );

  // Escape closes, arrows move. The original relied on the on-screen buttons.
  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openIndex, close, step]);

  const current = openIndex === null ? null : visible[openIndex];

  return (
    <section
      id="galerie"
      className="scroll-mt-24 border-t border-ink-edge py-14 sm:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Fotogalerie"
          title="Dům tak, jak vypadá"
          lede="Nic přifouknutého. Fotografie z pokojů, kuchyní a koupelen v takovém stavu, v jakém je najdete."
        />

        <div
          role="group"
          aria-label="Filtr fotografií"
          className="mt-8 flex flex-wrap gap-2 sm:mt-10"
        >
          {GROUPS.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => {
                setFilter(g);
                setOpenIndex(null);
              }}
              aria-pressed={filter === g}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm transition-colors",
                filter === g
                  ? "border-bone bg-bone text-ink"
                  : "border-ink-edge text-bone-dim hover:border-bone-faint hover:text-bone"
              )}
            >
              {g}
            </button>
          ))}
        </div>

        <motion.div
          layout
          className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {visible.map((item, index) => (
              <motion.button
                key={item.slug}
                layout
                type="button"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.02, 0.3) }}
                onClick={() => open(index)}
                aria-label={`Zvětšit: ${item.alt}`}
                className="group relative aspect-square overflow-hidden rounded-xl border border-ink-edge"
              >
                <Image
                  src={photo(item.slug)}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 260px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-ink/70 opacity-0 backdrop-blur-[2px] transition-opacity duration-200 group-hover:opacity-100">
                  <ZoomIn size={20} className="text-bone" />
                </span>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {current && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={current.alt}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/95 p-4 backdrop-blur-sm"
          >
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Zavřít"
              className="absolute right-4 top-4 rounded-full border border-ink-edge p-2.5 text-bone transition-colors hover:border-bone"
            >
              <X size={18} />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                step(-1);
              }}
              aria-label="Předchozí fotografie"
              className="absolute left-3 rounded-full border border-ink-edge p-2.5 text-bone transition-colors hover:border-bone sm:left-6"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                step(1);
              }}
              aria-label="Další fotografie"
              className="absolute right-3 rounded-full border border-ink-edge p-2.5 text-bone transition-colors hover:border-bone sm:right-6"
            >
              <ChevronRight size={18} />
            </button>

            <motion.figure
              key={current.slug}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[86vh] w-full max-w-4xl"
            >
              <div className="relative mx-auto h-[70vh] w-full">
                <Image
                  src={photo(current.slug)}
                  alt={current.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 900px"
                  className="object-contain"
                />
              </div>
              <figcaption className="mt-4 flex items-center justify-between gap-4 text-sm text-bone-dim">
                <span>{current.alt}</span>
                <span className="shrink-0 tabular-nums text-bone-faint">
                  {(openIndex ?? 0) + 1} / {visible.length}
                </span>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
