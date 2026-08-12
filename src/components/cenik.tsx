import { priceNotes, rooms } from "@/lib/content";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

export function Cenik() {
  return (
    <section id="cenik" className="scroll-mt-24 border-t border-ink-edge py-14 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Ceník"
          title="Ceny bez hvězdiček"
          lede="Co je v tabulce, to zaplatíte. Žádné příplatky za povlečení ani za úklid."
        />

        <div className="mt-10 sm:mt-14">
          {rooms.map((room, i) => (
            <Reveal key={room.id} delay={i * 0.06}>
              <div className="grid grid-cols-[1fr_auto] items-baseline gap-4 border-t border-ink-edge py-6 sm:grid-cols-[1fr_auto_auto] sm:gap-10">
                <div>
                  <h3 className="font-display text-xl sm:text-2xl">{room.name}</h3>
                  <p className="mt-1 text-sm text-bone-faint">
                    {room.features.slice(0, 2).join(" · ")}
                  </p>
                </div>
                <p className="hidden text-sm text-bone-faint sm:block">
                  {room.priceUnit}
                </p>
                <p className="text-right font-display text-2xl tabular-nums text-bone sm:text-3xl">
                  {room.price}
                  <span className="ml-1.5 text-sm text-bone-faint">Kč</span>
                </p>
              </div>
            </Reveal>
          ))}
          <div className="border-t border-ink-edge" />
        </div>

        <Reveal delay={0.1}>
          <ul className="mt-8 space-y-2">
            {priceNotes.map((note) => (
              <li key={note} className="text-sm text-bone-faint">
                {note}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
