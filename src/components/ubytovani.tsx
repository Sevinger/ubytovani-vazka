"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useState } from "react";

import { rooms } from "@/lib/content";
import { cn, photo } from "@/lib/utils";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

export function Ubytovani() {
  const [activeId, setActiveId] = useState(rooms[0].id);
  const [frame, setFrame] = useState(0);

  const active = rooms.find((r) => r.id === activeId) ?? rooms[0];
  const lead = active.photos[frame] ?? active.photos[0];

  const select = (id: string) => {
    setActiveId(id);
    setFrame(0);
  };

  const step = useCallback(
    (delta: number) =>
      setFrame((i) => (i + delta + active.photos.length) % active.photos.length),
    [active.photos.length]
  );

  return (
    <section id="ubytovani" className="scroll-mt-24 py-14 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Ubytování"
          title="Čtyři možnosti ubytování"
          lede="Od apartmánu s vlastní kuchyní po úsporný pokoj s oddělenými lůžky. Každý pokoj má svůj vlastní charakter — a svoji barvu."
        />

        <div className="mt-10 grid gap-8 sm:mt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-14">
          {/* selector */}
          <Reveal className="order-2 lg:order-1">
            <ul className="flex flex-col">
              {rooms.map((room) => {
                const isActive = room.id === active.id;
                return (
                  <li key={room.id}>
                    <button
                      type="button"
                      onClick={() => select(room.id)}
                      aria-pressed={isActive}
                      className={cn(
                        "group w-full border-t border-ink-edge py-5 text-left transition-colors",
                        isActive ? "border-t-transparent" : "hover:border-bone-faint"
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="room-rule"
                          className="iridescent-rule -mt-5 mb-5"
                          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        />
                      )}
                      <div className="flex items-baseline justify-between gap-4">
                        <span
                          className={cn(
                            "font-display text-2xl transition-colors sm:text-3xl",
                            isActive ? "text-bone" : "text-bone-faint group-hover:text-bone-dim"
                          )}
                        >
                          {room.name}
                        </span>
                        <span
                          className={cn(
                            "shrink-0 text-sm tabular-nums transition-colors",
                            isActive ? "text-bronze" : "text-bone-faint"
                          )}
                        >
                          {room.price} Kč
                        </span>
                      </div>

                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                          >
                            <p className="pt-3 text-sm leading-relaxed text-bone-dim">
                              {room.lede}
                            </p>
                            <ul className="mt-5 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                              {room.features.map((f) => (
                                <li
                                  key={f}
                                  className="flex items-start gap-2 text-sm text-bone-dim"
                                >
                                  <Check
                                    size={13}
                                    className="mt-1 shrink-0 text-teal"
                                  />
                                  {f}
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>
                  </li>
                );
              })}
              <li className="border-t border-ink-edge" />
            </ul>
          </Reveal>

          {/* viewer */}
          <Reveal delay={0.1} className="order-1 lg:order-2">
            <div
              className="group/viewer mx-auto w-full max-w-[560px] lg:mx-0 lg:ml-auto"
              tabIndex={0}
              role="group"
              aria-label={`Fotografie — ${active.name}`}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight") step(1);
                if (e.key === "ArrowLeft") step(-1);
              }}
            >
              {/* 3:2 is how these rooms were actually photographed, so the frame
                  crops far less than the portrait box it replaces — and the
                  560px cap keeps modest sources from being upscaled. */}
              <div className="relative aspect-[3/2] overflow-hidden rounded-2xl border border-ink-edge bg-ink-raised">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={lead}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={photo(lead)}
                      alt={`${active.name} — Ubytování Vážka Mohelnice`}
                      fill
                      sizes="(max-width: 640px) 92vw, 560px"
                      quality={90}
                      className="object-cover"
                    />
                  </motion.div>
                </AnimatePresence>

                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Předchozí fotografie"
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-ink/70 p-2.5 text-bone backdrop-blur-sm transition-all hover:bg-ink lg:opacity-0 lg:group-hover/viewer:opacity-100 lg:focus-visible:opacity-100"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Další fotografie"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-ink/70 p-2.5 text-bone backdrop-blur-sm transition-all hover:bg-ink lg:opacity-0 lg:group-hover/viewer:opacity-100 lg:focus-visible:opacity-100"
                >
                  <ChevronRight size={18} />
                </button>

                <span className="absolute right-3 top-3 rounded-full bg-ink/70 px-2.5 py-1 text-xs tabular-nums text-bone backdrop-blur-sm">
                  {frame + 1} / {active.photos.length}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
                {active.photos.map((p, i) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setFrame(i)}
                    aria-label={`Fotografie ${i + 1} z ${active.photos.length}`}
                    aria-current={i === frame}
                    className={cn(
                      "relative aspect-[3/2] overflow-hidden rounded-lg border transition-all",
                      i === frame
                        ? "border-bone opacity-100"
                        : "border-ink-edge opacity-55 hover:opacity-90"
                    )}
                  >
                    <Image
                      src={photo(p)}
                      alt=""
                      fill
                      sizes="100px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
