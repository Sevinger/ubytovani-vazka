"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { ArrowDown } from "lucide-react";

import { contact } from "@/lib/content";
import { photo } from "@/lib/utils";
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
        className="pointer-events-none absolute -right-24 top-24 w-[560px] max-w-none opacity-70 sm:-right-16 sm:w-[760px] lg:right-0 lg:w-[900px]"
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

        {/* three rooms, three temperaments — the house's actual range */}
        <motion.div
          {...rise(4)}
          className="mt-16 grid grid-cols-3 gap-3 sm:mt-20 sm:max-w-lg sm:gap-4"
        >
          {(["apartman-zeleny-loznice", "apartman-ruzovy-loznice", "apartman-cerveny-loznice"] as const).map(
            (slug, i) => (
              <div
                key={slug}
                className="relative aspect-[3/4] overflow-hidden rounded-sm border border-ink-edge"
              >
                <Image
                  src={photo(slug)}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 30vw, 160px"
                  className="object-cover"
                  preload={i === 0}
                />
              </div>
            )
          )}
        </motion.div>

        <motion.a
          {...rise(5)}
          href="#ubytovani"
          className="mt-16 inline-flex items-center gap-2 text-sm text-bone-faint transition-colors hover:text-bone"
        >
          <ArrowDown size={14} />
          Prohlédnout pokoje
        </motion.a>
      </div>
    </section>
  );
}
