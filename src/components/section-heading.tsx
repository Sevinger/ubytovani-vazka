import { Reveal } from "./reveal";
import { WingMark } from "./wing";

/**
 * Every section opens the same way: a small wing, a label, a display title and
 * an optional lede. Repeating the wing at this scale is what ties the sections
 * together — it is the only ornament the page allows itself.
 */
export function SectionHeading({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
}) {
  return (
    <Reveal>
      <div className="flex items-center gap-3">
        <WingMark className="h-3 w-12 shrink-0" />
        <span className="eyebrow">{eyebrow}</span>
      </div>

      <h2 className="mt-5 max-w-2xl font-display text-[clamp(2rem,5vw,3.4rem)] tracking-[-0.015em]">
        {title}
      </h2>

      {lede && (
        <p className="mt-5 max-w-xl text-base leading-relaxed text-bone-dim">
          {lede}
        </p>
      )}
    </Reveal>
  );
}
