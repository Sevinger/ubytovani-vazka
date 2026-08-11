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
      className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28"
    >
      {/* the wing sits behind the title, bled off the right edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-28 top-24 w-[460px] max-w-none opacity-40 sm:-right-16 sm:top-16 sm:w-[600px] lg:-right-4 lg:top-10 lg:w-[720px]"
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
          className="mt-20 inline-flex items-center gap-2 text-sm text-bone-faint transition-colors hover:text-bone"
        >
          <ArrowDown size={14} />
          Prohlédnout pokoje
        </motion.a>
      </div>
    </section>
  );
}
