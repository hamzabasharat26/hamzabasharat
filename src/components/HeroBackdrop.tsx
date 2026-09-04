/**
 * The page's fixed background. Pure CSS/SVG — no canvas, no rAF, no Three.js.
 *
 * Read: a measurement instrument, not a glow. An earlier version washed the
 * right gutter in saturated emerald (`--color-a1`) and it read as a green
 * smudge behind the type. This one is cool and precise — a faint hairline
 * grid, one thin scan line, two crisp detection boxes with corner ticks, and
 * two barely-there indigo corner glows so the black isn't flat.
 *
 * Everything is `transform`/`opacity` only and frozen under
 * `prefers-reduced-motion` (see the `.hb-*` rules in globals.css).
 */
export default function HeroBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* 1 — cool corner glows + a faint starfield, very low */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(52% 44% at 6% 4%, color-mix(in oklab, var(--color-a3) 10%, transparent), transparent 72%), " +
            "radial-gradient(50% 42% at 94% 97%, color-mix(in oklab, var(--color-a3) 8%, transparent), transparent 72%), " +
            "radial-gradient(38% 34% at 82% 14%, color-mix(in oklab, var(--color-a2) 6%, transparent), transparent 74%), " +
            "radial-gradient(1px 1px at 14% 24%, var(--hb-star), transparent 100%), " +
            "radial-gradient(1px 1px at 66% 12%, var(--hb-star), transparent 100%), " +
            "radial-gradient(1.5px 1.5px at 86% 46%, var(--hb-star), transparent 100%), " +
            "radial-gradient(1px 1px at 34% 70%, var(--hb-star), transparent 100%), " +
            "radial-gradient(1px 1px at 90% 78%, var(--hb-star), transparent 100%)",
        }}
      />

      {/* 2 — hairline instrument grid, confined to the right gutter and faded
             at every edge so it never forms a hard block */}
      <div className="absolute inset-y-0 right-0 hidden w-[56%] overflow-hidden md:block">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(var(--hb-line) 1px, transparent 1px), " +
              "linear-gradient(90deg, var(--hb-line) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage:
              "radial-gradient(80% 70% at 78% 42%, #000 30%, transparent 78%)",
          }}
        />
        {/* sparse detection dots on the grid intersections, cooler + lower */}
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, var(--hb-dot) 1px, transparent 0)",
            backgroundSize: "72px 72px",
            maskImage:
              "radial-gradient(60% 55% at 80% 40%, #000 12%, transparent 68%)",
          }}
        />
        <div
          className="hb-scan absolute inset-x-0 top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, color-mix(in oklab, var(--color-a2) 55%, transparent) 45%, color-mix(in oklab, var(--color-a2) 55%, transparent) 55%, transparent)",
          }}
        />
      </div>

      {/* 3 — two crisp detection boxes with corner ticks */}
      <svg
        className="absolute inset-0 hidden size-full md:block"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1440 900"
        fill="none"
      >
        <g className="hb-box" stroke="color-mix(in oklab, var(--color-a2) 60%, transparent)" strokeWidth="1.25">
          <rect x="978" y="212" width="150" height="120" />
          <path
            d="M978 232V212h20M1128 212h-20M1128 312v20h-20M978 312v20h20"
            stroke="color-mix(in oklab, var(--color-a2) 95%, transparent)"
            strokeWidth="2.5"
          />
        </g>
        <g className="hb-box hb-box-2" stroke="color-mix(in oklab, var(--color-a3) 62%, transparent)" strokeWidth="1.25">
          <rect x="1156" y="458" width="120" height="150" />
          <path
            d="M1156 478V458h18M1276 458h-18M1276 588v20h-18M1156 588v20h18"
            stroke="color-mix(in oklab, var(--color-a3) 95%, transparent)"
            strokeWidth="2.5"
          />
          <circle
            cx="1216"
            cy="533"
            r="3"
            fill="color-mix(in oklab, var(--color-a2) 90%, transparent)"
            stroke="none"
          />
        </g>
      </svg>
    </div>
  );
}
