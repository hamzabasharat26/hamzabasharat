/**
 * A single-line infinite ticker. Pure CSS (see `.marquee` in globals.css) —
 * the item list is rendered twice inside one animated track, so translating it
 * -50% loops seamlessly. Pauses on hover, frozen under reduced motion.
 */
export default function Marquee({
  items,
  className = "",
}: {
  items: string[];
  className?: string;
}) {
  const list = (dup: boolean) =>
    items.map((it, i) => (
      <span
        key={`${dup ? "b" : "a"}-${i}`}
        className="flex items-center gap-8 whitespace-nowrap pr-8 text-fg-mute"
        aria-hidden={dup || undefined}
      >
        {it}
        <span className="size-1 rounded-full bg-fg-mute/50" />
      </span>
    ));

  return (
    <div
      className={`marquee-track relative flex w-full min-w-0 max-w-full overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)] ${className}`}
    >
      <div className="marquee">
        {list(false)}
        {list(true)}
      </div>
    </div>
  );
}
