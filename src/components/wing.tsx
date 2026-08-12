"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useId } from "react";

/* ---------------------------------------------------------------------------
   The signature.

   A dragonfly seen from above, drawn rather than photographed: head, thorax, a
   segmented abdomen, and four wings — a long narrow forewing and a broader
   hindwing on each side. The venation inside each wing is generated from that
   wing's own geometry (longitudinal veins fanning from the root, cross veins
   knitting them into a net), so the figure is a dragonfly rather than an
   ornament that gestures at one.

   Everything is deterministic. No Math.random(), because the server and the
   client must agree on every coordinate.
--------------------------------------------------------------------------- */

const AXIS_Y = 160;

/** Width profile along a wing: narrow root, broad middle, rounded tip. */
const SHAPE_A = 0.45;
const SHAPE_B = 0.3;
const PEAK_T = SHAPE_A / (SHAPE_A + SHAPE_B);
const PEAK = PEAK_T ** SHAPE_A * (1 - PEAK_T) ** SHAPE_B;

type WingSpec = {
  /** where the wing meets the thorax */
  ox: number;
  oy: number;
  /** degrees; 0 = toward the tail, -90 = straight up */
  angle: number;
  len: number;
  halfWidth: number;
  /** leading edge is flatter than the trailing edge */
  lead: number;
  trail: number;
};

/**
 * Forewings attach forward on the thorax and sweep slightly toward the head;
 * hindwings attach behind, are broader at the root, and sweep toward the tail.
 */
const WINGS: WingSpec[] = [
  { ox: 128, oy: 150, angle: -103, len: 178, halfWidth: 27, lead: 0.72, trail: 1.28 },
  { ox: 148, oy: 156, angle: -68, len: 158, halfWidth: 33, lead: 0.78, trail: 1.22 },
  { ox: 128, oy: 170, angle: 103, len: 178, halfWidth: 27, lead: 0.72, trail: 1.28 },
  { ox: 148, oy: 164, angle: 68, len: 158, halfWidth: 33, lead: 0.78, trail: 1.22 },
];

function halfWidthAt(t: number, max: number) {
  if (t <= 0 || t >= 1) return 0;
  return (max * (t ** SHAPE_A * (1 - t) ** SHAPE_B)) / PEAK;
}

/**
 * A point inside a wing. `t` runs root→tip, `u` runs leading edge→trailing
 * edge. Computed in wing-local space, then rotated onto the body.
 */
function wingPoint(w: WingSpec, t: number, u: number): [number, number] {
  const hw = halfWidthAt(t, w.halfWidth);
  const along = t * w.len;
  // a slight curve so the wing is not a straight blade
  const bow = Math.sin(Math.PI * t) * 5;
  const across = -w.lead * hw + u * (w.lead + w.trail) * hw + bow;

  const r = (w.angle * Math.PI) / 180;
  const cos = Math.cos(r);
  const sin = Math.sin(r);
  return [
    w.ox + along * cos - across * sin,
    w.oy + along * sin + across * cos,
  ];
}

function toPath(points: [number, number][], close = false) {
  const d = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");
  return close ? `${d} Z` : d;
}

function outlineOf(w: WingSpec) {
  const steps = 60;
  const lead: [number, number][] = [];
  const trail: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    lead.push(wingPoint(w, t, 0));
    trail.push(wingPoint(w, t, 1));
  }
  return toPath([...lead, ...trail.reverse()], true);
}

const VEIN_U = [0, 0.22, 0.45, 0.68, 1];

function veinsOf(w: WingSpec) {
  const steps = 40;
  return VEIN_U.map((u) => {
    const pts: [number, number][] = [];
    for (let i = 0; i <= steps; i++) pts.push(wingPoint(w, i / steps, u));
    return toPath(pts);
  });
}

/** Cross veins, one combined path per band between neighbouring veins. */
function crossOf(w: WingSpec) {
  const bands: string[] = [];
  for (let k = 0; k < VEIN_U.length - 1; k++) {
    const segs: string[] = [];
    const phase = (k % 2) * 0.03;
    for (let t = 0.1 + phase; t < 0.95; t += 0.062) {
      const [x1, y1] = wingPoint(w, t, VEIN_U[k]);
      const [x2, y2] = wingPoint(w, Math.min(t + 0.018, 0.995), VEIN_U[k + 1]);
      segs.push(
        `M${x1.toFixed(1)},${y1.toFixed(1)} L${x2.toFixed(1)},${y2.toFixed(1)}`
      );
    }
    bands.push(segs.join(" "));
  }
  return bands;
}

/** The pterostigma — the opaque cell near the leading edge, close to the tip. */
function stigmaOf(w: WingSpec) {
  const pts = [
    wingPoint(w, 0.78, 0.03),
    wingPoint(w, 0.88, 0.03),
    wingPoint(w, 0.88, 0.16),
    wingPoint(w, 0.78, 0.16),
  ];
  return toPath(pts, true);
}

const WING_GEOM = WINGS.map((w) => ({
  outline: outlineOf(w),
  veins: veinsOf(w),
  cross: crossOf(w),
  stigma: stigmaOf(w),
}));

/** Head, thorax and the tapering segmented abdomen. */
const ABDOMEN = (() => {
  const x0 = 155;
  const x1 = 436;
  const top: [number, number][] = [];
  const bottom: [number, number][] = [];
  const steps = 40;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = x0 + (x1 - x0) * t;
    // thick at the base, pinched, then slightly clubbed at the tip
    const r = 9 * (1 - t) ** 0.75 + 2.6 + 1.6 * Math.sin(Math.PI * t ** 2.2);
    top.push([x, AXIS_Y - r]);
    bottom.push([x, AXIS_Y + r]);
  }
  return toPath([...top, ...bottom.reverse()], true);
})();

const SEGMENTS = Array.from({ length: 8 }, (_, i) => {
  const t = (i + 1) / 9;
  const x = 155 + (436 - 155) * t;
  const r = 9 * (1 - t) ** 0.75 + 2.6 + 1.6 * Math.sin(Math.PI * t ** 2.2);
  return `M${x.toFixed(1)},${(AXIS_Y - r).toFixed(1)} L${x.toFixed(1)},${(
    AXIS_Y + r
  ).toFixed(1)}`;
}).join(" ");

/**
 * The viewBox is measured from the geometry rather than guessed. The wings
 * reach well above and below the body, so a hand-written box clipped their
 * tips — and would clip them again the moment any wing angle changed.
 */
const VIEW_BOX = (() => {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  const see = (x: number, y: number) => {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  };

  for (const w of WINGS) {
    for (let i = 0; i <= 100; i++) {
      const t = i / 100;
      see(...wingPoint(w, t, 0));
      see(...wingPoint(w, t, 1));
    }
  }
  // head circle, thorax ellipse and the abdomen tip
  see(102 - 16, AXIS_Y - 16);
  see(102 + 16, AXIS_Y + 16);
  see(140 - 24, AXIS_Y - 15);
  see(140 + 24, AXIS_Y + 15);
  see(436, AXIS_Y);

  const pad = 8; // room for the outline stroke itself
  return {
    box: `${(minX - pad).toFixed(1)} ${(minY - pad).toFixed(1)} ${(
      maxX - minX + pad * 2
    ).toFixed(1)} ${(maxY - minY + pad * 2).toFixed(1)}`,
    ratio: (maxX - minX + pad * 2) / (maxY - minY + pad * 2),
  };
})();

/** Width ÷ height of the drawing, so callers can size it without distortion. */
export const WING_ASPECT = VIEW_BOX.ratio;

type DragonflyProps = {
  className?: string;
  animate?: boolean;
  delay?: number;
};

export function Wing({ className, animate = true, delay = 0 }: DragonflyProps) {
  const gid = useId();
  const reduced = useReducedMotion();
  const on = animate && !reduced;

  const draw = (order: number, duration: number) =>
    on
      ? {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity: 1 },
          transition: {
            pathLength: {
              duration,
              delay: delay + order * 0.09,
              ease: [0.22, 1, 0.36, 1] as const,
            },
            opacity: { duration: 0.35, delay: delay + order * 0.09 },
          },
        }
      : {};

  return (
    <svg viewBox={VIEW_BOX.box} fill="none" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="0.5">
          <stop offset="0%" stopColor="#3fa89b" />
          <stop offset="46%" stopColor="#6e5a9e" />
          <stop offset="100%" stopColor="#b98a4e" />
        </linearGradient>
      </defs>

      {WING_GEOM.map((g, wi) => (
        <g key={wi}>
          <motion.path
            d={g.outline}
            fill={`url(#${gid})`}
            initial={on ? { opacity: 0 } : false}
            animate={{ opacity: 0.06 }}
            transition={{ duration: 1, delay: delay + 0.55 + wi * 0.08 }}
          />
          {g.cross.map((d, i) => (
            <motion.path
              key={`c${i}`}
              d={d}
              stroke={`url(#${gid})`}
              strokeWidth={0.5}
              strokeOpacity={0.4}
              {...draw(wi * 0.6 + i * 0.12, 0.9)}
            />
          ))}
          {g.veins.map((d, i) => (
            <motion.path
              key={`v${i}`}
              d={d}
              stroke={`url(#${gid})`}
              strokeWidth={i === 0 ? 1 : 0.7}
              strokeOpacity={i === 0 ? 0.8 : 0.55}
              strokeLinecap="round"
              {...draw(wi * 0.6 + i * 0.1, 1.1)}
            />
          ))}
          <motion.path
            d={g.outline}
            stroke={`url(#${gid})`}
            strokeWidth={1.1}
            strokeOpacity={0.75}
            {...draw(wi * 0.5, 1.3)}
          />
          <motion.path
            d={g.stigma}
            fill={`url(#${gid})`}
            initial={on ? { opacity: 0 } : false}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 0.4, delay: delay + 1.5 + wi * 0.06 }}
          />
        </g>
      ))}

      {/* body */}
      <motion.path
        d={ABDOMEN}
        fill={`url(#${gid})`}
        fillOpacity={0.16}
        stroke={`url(#${gid})`}
        strokeWidth={1.1}
        strokeOpacity={0.85}
        {...draw(0.2, 1.2)}
      />
      <motion.path
        d={SEGMENTS}
        stroke={`url(#${gid})`}
        strokeWidth={0.6}
        strokeOpacity={0.5}
        {...draw(1.6, 0.8)}
      />

      {/* thorax */}
      <motion.ellipse
        cx={140}
        cy={160}
        rx={24}
        ry={15}
        fill={`url(#${gid})`}
        fillOpacity={0.2}
        stroke={`url(#${gid})`}
        strokeWidth={1.1}
        strokeOpacity={0.85}
        initial={on ? { opacity: 0, scale: 0.9 } : false}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: delay + 0.15 }}
        style={{ transformOrigin: "140px 160px" }}
      />

      {/* head, with the two big compound eyes */}
      <motion.g
        initial={on ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: delay + 0.05 }}
      >
        <circle
          cx={102}
          cy={160}
          r={15}
          fill={`url(#${gid})`}
          fillOpacity={0.2}
          stroke={`url(#${gid})`}
          strokeWidth={1.1}
          strokeOpacity={0.85}
        />
        <circle cx={96} cy={152} r={7.5} fill={`url(#${gid})`} fillOpacity={0.55} />
        <circle cx={96} cy={168} r={7.5} fill={`url(#${gid})`} fillOpacity={0.55} />
      </motion.g>
    </svg>
  );
}

/**
 * The section marker. Below roughly 80px wide the venation collapses into a
 * smudge, so this keeps only the silhouette — four wings, a body, a head — at
 * weights that survive being 14px tall. The viewBox aspect is preserved; the
 * earlier version stretched it and read as a rectangle.
 */
export function WingMark({ className }: { className?: string }) {
  const gid = useId();

  return (
    <svg viewBox={VIEW_BOX.box} fill="none" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="0.5">
          <stop offset="0%" stopColor="#3fa89b" />
          <stop offset="46%" stopColor="#6e5a9e" />
          <stop offset="100%" stopColor="#b98a4e" />
        </linearGradient>
      </defs>

      {WING_GEOM.map((g, i) => (
        <path
          key={i}
          d={g.outline}
          fill={`url(#${gid})`}
          fillOpacity={0.22}
          stroke={`url(#${gid})`}
          strokeWidth={5}
          strokeOpacity={0.95}
          strokeLinejoin="round"
        />
      ))}
      <path d={ABDOMEN} fill={`url(#${gid})`} fillOpacity={0.9} />
      <ellipse cx={140} cy={160} rx={24} ry={15} fill={`url(#${gid})`} />
      <circle cx={104} cy={160} r={16} fill={`url(#${gid})`} />
    </svg>
  );
}
