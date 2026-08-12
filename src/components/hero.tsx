"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown } from "lucide-react";

import { contact } from "@/lib/content";
import { Wing } from "./wing";

const WORDS = ["Ubytování", "Vážka"];

export function Hero() {
  const reduced = useReducedMotion();

  const rise = (i: number) => ({
    initial: { opacity: 0, y: reduced ? 0 : "0.4em" },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.9,
      delay: 0.15 + i * 0.12,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  });

  return (
    <section
      id="top"
      className="relative overflow-hidden pt-28 pb-12 sm:pt-40 sm:pb-24"
    >
      {/* sits behind the title; kept fully inside the section, since the
          section clips its overflow and a bled wing reads as a broken one */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-3 top-2 w-[275px] max-w-none opacity-25 sm:right-5 sm:top-4 sm:w-[400px] sm:opacity-35 lg:right-8 lg:w-[530px] lg:opacity-40"
      >
        <Wing delay={0.35} className="w-full" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <motion.p {...rise(0)} className="eyebrow">
          Penzion · {contact.street} · {contact.city}
        </motion.p>

        <h1 className="mt-6 font-display text-[clamp(3.2rem,12vw,9rem)] leading-[0.92] tracking-[-0.02em]">
          {WORDS.map((word, i) => (
            <motion.span key={word} {...rise(i + 1)} className="block">
              {i === 1 ? <em className="not-italic iridescent-text">{word}</em> : word}
            </motion.span>
          ))}
        </h1>

        <motion.div {...rise(3)} className="mt-10 max-w-md">
          <p className="text-lg leading-relaxed text-bone-dim">
            Nenabízíme pouhé ubytování, ale skutečné bydlení. V apartmánech
            s vlastní kuchyní snadno zapomenete, že nejste doma.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#rezervace"
              className="rounded-full bg-bone px-6 py-3 text-sm font-medium text-ink transition-opacity hover:opacity-85"
            >
              Nezávazně poptat termín
            </a>
            <a
              href={`tel:${contact.phoneHref}`}
              className="rounded-full border border-ink-edge px-6 py-3 text-sm text-bone transition-colors hover:border-teal hover:text-teal"
            >
              {contact.phone}
            </a>
          </div>
        </motion.div>

        <motion.a
          {...rise(4)}
          href="#ubytovani"
          className="mt-12 inline-flex items-center gap-2 text-sm text-bone-faint transition-colors hover:text-bone sm:mt-16"
        >
          <ArrowDown size={14} />
          Prohlédnout pokoje
        </motion.a>
      </div>
    </section>
  );
}
