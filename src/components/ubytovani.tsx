"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Check } from "lucide-react";
import { useState } from "react";

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

  return (
    <section id="ubytovani" className="scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Ubytování"
          title="Čtyři způsoby, jak tu bydlet"
          lede="Od apartmánu s vlastní kuchyní po úsporný pokoj s oddělenými lůžky. Každý pokoj má svůj vlastní charakter — a svoji barvu."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-14">
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
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-ink-edge bg-ink-raised sm:aspect-[4/3] lg:aspect-[4/5]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={lead}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={photo(lead)}
                    alt={`${active.name} — Ubytování Vážka Mohelnice`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 620px"
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ink/85 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 p-4">
                <span className="text-xs text-bone-dim">
                  {active.name}
                </span>
                <div className="flex gap-1.5">
                  {active.photos.map((p, i) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setFrame(i)}
                      aria-label={`Fotografie ${i + 1} z ${active.photos.length}`}
                      aria-current={i === frame}
                      className={cn(
                        "h-1.5 rounded-full transition-all",
                        i === frame
                          ? "w-6 bg-bone"
                          : "w-1.5 bg-bone/35 hover:bg-bone/60"
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
