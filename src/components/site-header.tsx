"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";

import { contact, nav } from "@/lib/content";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Keep the page from scrolling behind the open mobile sheet.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-ink/85 backdrop-blur-md border-b border-ink-edge/70"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5 sm:px-8">
        <a
          href="#top"
          className="font-display text-xl tracking-tight text-bone sm:text-2xl"
        >
          Vážka
          <span className="ml-2 align-middle eyebrow hidden sm:inline">
            Mohelnice
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group relative text-sm text-bone-dim transition-colors hover:text-bone"
            >
              {item.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-teal transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={`tel:${contact.phoneHref}`}
            className="hidden items-center gap-2 rounded-full border border-ink-edge px-4 py-2 text-sm text-bone transition-colors hover:border-teal hover:text-teal sm:flex"
          >
            <Phone size={14} />
            {contact.phone}
          </a>
          <a
            href="#rezervace"
            className="hidden rounded-full bg-bone px-5 py-2 text-sm font-medium text-ink transition-opacity hover:opacity-85 md:block"
          >
            Rezervovat
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Zavřít menu" : "Otevřít menu"}
            aria-expanded={open}
            className="rounded-full border border-ink-edge p-2.5 text-bone md:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-ink-edge bg-ink md:hidden"
          >
            <nav className="flex flex-col px-5 py-4">
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-ink-edge/60 py-4 font-display text-2xl text-bone last:border-0"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#rezervace"
                onClick={() => setOpen(false)}
                className="mt-5 rounded-full bg-bone py-3 text-center text-sm font-medium text-ink"
              >
                Rezervovat
              </a>
              <a
                href={`tel:${contact.phoneHref}`}
                className="mt-3 flex items-center justify-center gap-2 rounded-full border border-ink-edge py-3 text-sm text-bone"
              >
                <Phone size={14} />
                {contact.phone}
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
