import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";

import { contact, operator } from "@/lib/content";
import { photo } from "@/lib/utils";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import { Wing } from "./wing";

export function Kontakt() {
  // Search by coordinates rather than by street, so the pin lands on the house
  // itself instead of wherever Google decides to place the street number.
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${contact.lat},${contact.lon}`;

  return (
    <section
      id="kontakt"
      className="scroll-mt-24 border-t border-ink-edge py-14 sm:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading eyebrow="Kontakt" title="Kde nás najdete" />

        <Reveal>
          <a
            href={mapHref}
            target="_blank"
            rel="noreferrer"
            className="group mt-10 block overflow-hidden rounded-2xl border border-ink-edge sm:mt-14"
          >
            {/* 3:2 matches the crop baked into the file, so object-cover has
                nothing left to trim — a wider frame here cropped the entrance
                and the canopy straight out of the picture. */}
            <div className="relative aspect-[3/2]">
              <Image
                src={photo("penzion-exterier")}
                alt="Penzion Vážka z ulice Olomoucká — vstup s dřevěným přístřeškem"
                fill
                sizes="(max-width: 1152px) 100vw, 1088px"
                quality={88}
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </div>
          </a>
        </Reveal>

        <div className="mt-10 grid gap-10 sm:grid-cols-2 sm:gap-12 lg:grid-cols-3">
          <Reveal>
            <h3 className="eyebrow">Adresa</h3>
            <a
              href={mapHref}
              target="_blank"
              rel="noreferrer"
              className="group mt-4 flex items-start gap-3"
            >
              <MapPin size={16} className="mt-1 shrink-0 text-teal" />
              <span className="text-bone transition-colors group-hover:text-teal">
                {contact.street}
                <br />
                {contact.zip} {contact.city}
              </span>
            </a>
            <p className="mt-4 text-xs tabular-nums text-bone-faint">
              {contact.gps}
            </p>
          </Reveal>

          <Reveal delay={0.06}>
            <h3 className="eyebrow">Spojení</h3>
            <div className="mt-4 space-y-3">
              <a
                href={`tel:${contact.phoneHref}`}
                className="group flex items-center gap-3"
              >
                <Phone size={16} className="shrink-0 text-teal" />
                <span className="text-bone transition-colors group-hover:text-teal">
                  {contact.phone}
                </span>
              </a>
              <a
                href={`mailto:${contact.email}`}
                className="group flex items-center gap-3"
              >
                <Mail size={16} className="shrink-0 text-teal" />
                <span className="break-all text-bone transition-colors group-hover:text-teal">
                  {contact.email}
                </span>
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <h3 className="eyebrow">Provozovatel</h3>
            <div className="mt-4 space-y-1 text-sm text-bone-dim">
              <p className="text-bone">{operator.name}</p>
              <p>IČ: {operator.ico}</p>
              <p>
                DIČ: {operator.dic} · {operator.vat}
              </p>
              <p>ČP: {operator.cp}</p>
              <p className="pt-2 text-xs text-bone-faint">
                {operator.registration}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-ink-edge">
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-6 left-0 w-[240px] opacity-15 sm:bottom-0 sm:w-[320px]"
      >
        <Wing animate={false} className="w-full -scale-x-100 rotate-12" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-display text-3xl">Vážka</p>
            <p className="mt-1 text-sm text-bone-faint">
              Penzion v Mohelnici
            </p>
          </div>
          <p className="text-xs text-bone-faint">
            © {new Date().getFullYear()} {operator.name}. Všechna práva vyhrazena.
          </p>
        </div>
      </div>
    </footer>
  );
}
