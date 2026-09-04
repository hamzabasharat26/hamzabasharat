import Image from "next/image";
import Link from "next/link";

export type StripItem = {
  /** Unique key for the list. */
  id: string;
  title: string;
  poster: string;
  /** Short chip: a project domain, or a lab technique. */
  tag: string;
  /** `/work/<slug>` for a case study, `/#lab` for a lab demo. */
  href: string;
};

/**
 * Horizontal auto-scrolling strip of the work — the nine shipped projects plus
 * a handful of lab techniques. Pure CSS marquee (see `.marquee` in
 * globals.css): the list is rendered twice inside one animated track so the
 * -50% loop is seamless; it pauses on hover and freezes under reduced motion.
 * Server component — no JS ships for it.
 */
export default function ProjectStrip({ items }: { items: StripItem[] }) {
  const card = (it: StripItem, dup: boolean) => (
    <Link
      key={`${dup ? "b" : "a"}-${it.id}`}
      href={it.href}
      aria-hidden={dup || undefined}
      tabIndex={dup ? -1 : undefined}
      className="group relative block w-[260px] shrink-0 overflow-hidden rounded-xl border border-line bg-surface transition-colors hover:border-line-strong sm:w-[300px]"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={it.poster}
          alt=""
          fill
          sizes="300px"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          unoptimized={it.poster.endsWith(".svg")}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-3">
        <span className="truncate text-sm font-medium text-fg">{it.title}</span>
        <span className="shrink-0 rounded-full border border-line-strong bg-ink/60 px-2 py-0.5 text-[0.5625rem] uppercase tracking-wider text-fg-dim">
          {it.tag}
        </span>
      </div>
    </Link>
  );

  return (
    <section
      aria-label="Selected work"
      className="relative overflow-hidden border-t border-line py-8"
    >
      <p className="label mx-auto mb-5 w-full max-w-6xl px-6 md:px-10">
        Selected work — shipped &amp; in the lab
      </p>
      <div className="marquee-track relative flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_4%,#000_96%,transparent)]">
        <div className="marquee gap-4 pr-4">
          {items.map((it) => card(it, false))}
          {items.map((it) => card(it, true))}
        </div>
      </div>
    </section>
  );
}
