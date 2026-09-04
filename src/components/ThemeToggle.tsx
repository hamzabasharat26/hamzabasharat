"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

/**
 * Light / dark switch. The first paint is already themed by the inline script
 * in layout.tsx (localStorage → OS → dark). This reads that back and toggles
 * it; a `data-theme` change on <html> re-points every token in globals.css, so
 * nothing else needs to know.
 *
 * `useSyncExternalStore` rather than useState+useEffect: the value lives on the
 * DOM, set before hydration, and we only ever change it ourselves — a custom
 * event is the "external store" that notifies React.
 */
const subscribe = (cb: () => void) => {
  window.addEventListener("themechange", cb);
  return () => window.removeEventListener("themechange", cb);
};
const getSnapshot = (): Theme =>
  (document.documentElement.dataset.theme as Theme) || "dark";
const getServerSnapshot = (): Theme => "dark";

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
    window.dispatchEvent(new Event("themechange"));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="nav-toggle grid size-8 place-items-center rounded-full border border-line-strong text-fg-dim transition-colors hover:text-fg"
    >
      {theme === "dark" ? (
        <Sun className="size-4" aria-hidden />
      ) : (
        <Moon className="size-4" aria-hidden />
      )}
    </button>
  );
}
