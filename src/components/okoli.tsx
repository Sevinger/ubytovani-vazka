import { trips } from "@/lib/content";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

/**
 * Ordered by distance rather than by name — the question a guest actually has
 * is "what can we reach today", so distance is the axis that carries meaning.
 */
export function Okoli() {
  return (
    <section id="okoli" className="scroll-mt-24 border-t border-ink-edge py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Kam na výlet"
          title="Hrady, jeskyně a hory na dosah"
          lede="Mohelnice leží mezi Olomoucí a Jeseníky. Z většiny míst v okolí jste zpátky na oběd."
        />

        <ul className="mt-14 grid gap-x-10 sm:grid-cols-2">
          {trips.map((trip, i) => (
            <li key={trip.name}>
              <Reveal delay={(i % 2) * 0.05}>
                <div className="flex items-baseline justify-between gap-4 border-t border-ink-edge py-4">
                  <div>
                    <span className="text-bone">{trip.name}</span>
                    <span className="ml-3 text-xs text-bone-faint">
                      {trip.kind}
                    </span>
                  </div>
                  <span className="shrink-0 text-sm tabular-nums text-bone-faint">
                    {trip.km} km
                  </span>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal>
          <p className="mt-8 text-xs text-bone-faint">
            Vzdálenosti jsou přibližné, po silnici z Mohelnice.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
