/**
 * Next remounts this on every client-side navigation, so its children get a
 * fresh entry animation each time a route changes — a lightweight page
 * transition with no library and no dependency. The `.route-in` class is
 * gated on `prefers-reduced-motion: no-preference` in globals.css.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="route-in">{children}</div>;
}
