import { Mail, MapPin, Phone } from "lucide-react";

import { contact, operator } from "@/lib/content";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import { Wing } from "./wing";

export function Kontakt() {
  const mapHref = `https://mapy.cz/zakladni?q=${encodeURIComponent(
    `${contact.street}, ${contact.city}`
  )}`;

  return (
    <section
      id="kontakt"
      className="scroll-mt-24 border-t border-ink-edge py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading eyebrow="Kontakt" title="Kde nás najdete" />

        <div className="mt-14 grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
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
        className="pointer-events-none absolute -bottom-24 -left-28 w-[440px] opacity-20 sm:w-[560px]"
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
