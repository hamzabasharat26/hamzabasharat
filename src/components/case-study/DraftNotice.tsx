/**
 * Dev-only reminder of the DRAFT: limitation fields still unfilled on a case
 * study.
 *
 * `process.env.NODE_ENV` is statically replaced at build time, so in a
 * production build this component's body folds to `null` and the draft strings
 * never reach the client bundle. That matters: the DRAFT text names weaknesses
 * Hamza has not yet chosen to disclose, and shipping it would disclose them.
 */
export default function DraftNotice({
  slug,
  drafts,
}: {
  slug: string;
  drafts: string[];
}) {
  if (process.env.NODE_ENV === "production") return null;
  if (drafts.length === 0) return null;

  return (
    <aside className="mt-14 rounded-lg border border-dashed border-a1/40 bg-a1/[0.04] p-5">
      <p className="text-sm font-medium text-a1">
        Dev only — {drafts.length} unfilled limitation
        {drafts.length === 1 ? "" : "s"} on {slug}
      </p>
      <p className="mt-1 text-xs text-fg-mute">
        Not rendered in production. See docs/DRAFT-FIELDS.md.
      </p>
      <ul className="mt-3 space-y-2">
        {drafts.map((d, i) => (
          <li key={i} className="text-sm leading-relaxed text-fg-dim">
            {d.replace(/^DRAFT:\s*/, "")}
          </li>
        ))}
      </ul>
    </aside>
  );
}
