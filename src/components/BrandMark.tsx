/**
 * The site's own mark — the four-point spark from the favicon (`app/icon.svg`),
 * on the accent gradient. Replaces the generic briefcase glyph that shipped in
 * `/brand/*.webp` and did not match anything else on the site.
 */
export default function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      aria-hidden
      focusable="false"
    >
      <defs>
        <linearGradient id="bm-g" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--color-a2)" />
          <stop offset="0.5" stopColor="var(--color-a3)" />
          <stop offset="1" stopColor="var(--color-a4)" />
        </linearGradient>
      </defs>
      <path
        d="M12 2c.55 2.9 1.3 4.1 3.4 4.7C13.3 7.3 12.55 8.5 12 11.4c-.55-2.9-1.3-4.1-3.4-4.7C10.7 6.1 11.45 4.9 12 2Z"
        fill="url(#bm-g)"
      />
      <path
        d="M12 2c.55 2.9 1.3 4.1 3.4 4.7C13.3 7.3 12.55 8.5 12 11.4c-.55-2.9-1.3-4.1-3.4-4.7C10.7 6.1 11.45 4.9 12 2Z"
        transform="translate(0 10.6)"
        fill="url(#bm-g)"
        opacity="0.5"
      />
      <circle cx="12" cy="12" r="9.4" stroke="url(#bm-g)" strokeWidth="1.2" opacity="0.3" />
    </svg>
  );
}
