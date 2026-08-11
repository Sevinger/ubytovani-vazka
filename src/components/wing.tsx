"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useId } from "react";

/* ---------------------------------------------------------------------------
   The signature.

   A dragonfly wing, drawn rather than photographed. The venation is generated
   from the wing's own geometry — longitudinal veins fanning from the base,
   cross veins knitting them into the irregular net a real wing has — so the
   figure is a wing rather than an ornament that resembles one.

   Everything here is deterministic. No Math.random(), because the server and
   the client must agree on every coordinate.
--------------------------------------------------------------------------- */

const LENGTH = 420;
const CENTER_Y = 62;
const MAX_HALF_WIDTH = 46;

/** Leading edge is flatter than the trailing edge, as on the real insect. */
const LEADING = 0.78;
const TRAILING = 1.22;

const SHAPE_A = 0.42;
const SHAPE_B = 0.28;
/** t at which the width profile peaks, and the peak value, for normalisation */
const PEAK_T = SHAPE_A / (SHAPE_A + SHAPE_B);
const PEAK = PEAK_T ** SHAPE_A * (1 - PEAK_T) ** SHAPE_B;

function halfWidth(t: number) {
  if (t <= 0 || t >= 1) return 0;
  return (MAX_HALF_WIDTH * (t ** SHAPE_A * (1 - t) ** SHAPE_B)) / PEAK;
}

/** Slight upward sweep along the length. */
function centreY(t: number) {
  return CENTER_Y - 8 * Math.sin(Math.PI * t);
}

/** u = 0 is the leading edge, u = 1 the trailing edge. */
function pointAt(t: number, u: number): [number, number] {
  const hw = halfWidth(t);
  const y = centreY(t) - LEADING * hw + u * (LEADING + TRAILING) * hw;
  return [t * LENGTH, y];
}

/** Deterministic jitter in [-1, 1] — stands in for a seeded PRNG. */
function wobble(seed: number) {
  return Math.sin(seed * 12.9898) * 43758.5453 % 1;
}

function toPath(points: [number, number][]) {
  return points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");
}

/** The wing outline, leading edge out and trailing edge back. */
function outlinePath() {
  const steps = 96;
  const top: [number, number][] = [];
  const bottom: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    top.push(pointAt(t, 0));
    bottom.push(pointAt(t, 1));
  }
  return `${toPath(top)} ${toPath(bottom.reverse()).replace("M", "L")} Z`;
}

const VEIN_U = [0, 0.16, 0.33, 0.5, 0.66, 0.83, 1];

/** Longitudinal veins, fanning from the narrow base out to the tip. */
function longitudinalPaths() {
  const steps = 64;
  return VEIN_U.map((u) => {
    const pts: [number, number][] = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      pts.push(pointAt(t, u));
    }
    return toPath(pts);
  });
}

/**
 * Cross veins, one combined path per band. Each band's samples are phase-offset
 * from its neighbour so the cells stagger instead of lining up into a grid.
 */
function crossPaths() {
  const paths: string[] = [];
  for (let k = 0; k < VEIN_U.length - 1; k++) {
    const uA = VEIN_U[k];
    const uB = VEIN_U[k + 1];
    const segments: string[] = [];
    const phase = (k % 2) * 0.022 + wobble(k + 1) * 0.006;
    for (let t = 0.08 + phase; t < 0.965; t += 0.041) {
      // slant each rung slightly, the way real cross veins lean toward the tip
      const lean = 0.012 + wobble(k * 7 + t * 130) * 0.005;
      const [x1, y1] = pointAt(t, uA);
      const [x2, y2] = pointAt(Math.min(t + lean, 0.999), uB);
      segments.push(
        `M${x1.toFixed(1)},${y1.toFixed(1)} L${x2.toFixed(1)},${y2.toFixed(1)}`
      );
    }
    paths.push(segments.join(" "));
  }
  return paths;
}

/** The pterostigma — the opaque cell near the leading edge, close to the tip. */
function pterostigmaPath() {
  const a = pointAt(0.79, 0.02);
  const b = pointAt(0.87, 0.02);
  const c = pointAt(0.87, 0.13);
  const d = pointAt(0.79, 0.13);
  return `M${a[0].toFixed(1)},${a[1].toFixed(1)} L${b[0].toFixed(1)},${b[1].toFixed(
    1
  )} L${c[0].toFixed(1)},${c[1].toFixed(1)} L${d[0].toFixed(1)},${d[1].toFixed(1)} Z`;
}

const OUTLINE = outlinePath();
const LONGITUDINAL = longitudinalPaths();
const CROSS = crossPaths();
const PTEROSTIGMA = pterostigmaPath();

type WingProps = {
  className?: string;
  /** play the draw-in animation; off for the small decorative instances */
  animate?: boolean;
  /** seconds before the draw begins */
  delay?: number;
};

export function Wing({ className, animate = true, delay = 0 }: WingProps) {
  const gradientId = useId();
  const reduced = useReducedMotion();
  const shouldAnimate = animate && !reduced;

  const draw = (i: number, total: number, duration: number) =>
    shouldAnimate
      ? {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity: 1 },
          transition: {
            pathLength: {
              duration,
              delay: delay + (i / total) * 0.6,
              ease: [0.22, 1, 0.36, 1] as const,
            },
            opacity: { duration: 0.3, delay: delay + (i / total) * 0.6 },
          },
        }
      : {};

  return (
    <svg
      viewBox={`-6 0 ${LENGTH + 12} 124`}
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0%" stopColor="#3fa89b" />
          <stop offset="46%" stopColor="#6e5a9e" />
          <stop offset="100%" stopColor="#b98a4e" />
        </linearGradient>
      </defs>

      {/* membrane */}
      <motion.path
        d={OUTLINE}
        fill={`url(#${gradientId})`}
        initial={shouldAnimate ? { opacity: 0 } : false}
        animate={shouldAnimate ? { opacity: 0.05 } : { opacity: 0.05 }}
        transition={{ duration: 1.1, delay: delay + 0.5 }}
      />

      {/* cross veins first, so the longitudinals sit over them */}
      {CROSS.map((d, i) => (
        <motion.path
          key={`c${i}`}
          d={d}
          stroke={`url(#${gradientId})`}
          strokeWidth={0.5}
          strokeOpacity={0.42}
          {...draw(i, CROSS.length, 1.0)}
        />
      ))}

      {LONGITUDINAL.map((d, i) => (
        <motion.path
          key={`l${i}`}
          d={d}
          stroke={`url(#${gradientId})`}
          strokeWidth={i === 0 ? 1.1 : 0.75}
          strokeOpacity={i === 0 ? 0.85 : 0.6}
          strokeLinecap="round"
          {...draw(i, LONGITUDINAL.length, 1.3)}
        />
      ))}

      <motion.path
        d={OUTLINE}
        stroke={`url(#${gradientId})`}
        strokeWidth={1.1}
        strokeOpacity={0.75}
        {...draw(0, 1, 1.6)}
      />

      <motion.path
        d={PTEROSTIGMA}
        fill={`url(#${gradientId})`}
        initial={shouldAnimate ? { opacity: 0 } : false}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 0.5, delay: delay + 1.5 }}
      />
    </svg>
  );
}

/**
 * Small, static wing used as a section marker.
 *
 * The full venation collapses into a smudge below roughly 80px wide, so this
 * draws a reduced figure — outline, three veins, pterostigma — at weights that
 * survive being 12px tall.
 */
export function WingMark({ className }: { className?: string }) {
  const gradientId = useId();
  const veins = [LONGITUDINAL[0], LONGITUDINAL[3], LONGITUDINAL[6]];

  return (
    <svg
      viewBox={`-6 0 ${LENGTH + 12} 124`}
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="none"
      className={className}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0%" stopColor="#3fa89b" />
          <stop offset="46%" stopColor="#6e5a9e" />
          <stop offset="100%" stopColor="#b98a4e" />
        </linearGradient>
      </defs>

      <path d={OUTLINE} fill={`url(#${gradientId})`} opacity={0.12} />
      {veins.map((d, i) => (
        <path
          key={i}
          d={d}
          stroke={`url(#${gradientId})`}
          strokeWidth={2.4}
          strokeOpacity={0.9}
          strokeLinecap="round"
        />
      ))}
      <path
        d={OUTLINE}
        stroke={`url(#${gradientId})`}
        strokeWidth={2.6}
        strokeOpacity={0.95}
      />
    </svg>
  );
}
