"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "@/content/site";
import { appear, withMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const footerColumns = [
  { title: "Site", links: [...site.nav] },
  {
    title: "Elsewhere",
    links: [
      { label: "LinkedIn", href: site.links.linkedin },
      { label: "GitHub", href: site.links.github },
      { label: "Email", href: `mailto:${site.email}` },
      { label: site.phone, href: `tel:${site.phone.replace(/\s/g, "")}` },
    ],
  },
];

export default function Closing() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      withMotion(
        () => {
          gsap.from(".cl-reveal", {
            y: 34,
            autoAlpha: 0,
            scale: 0.98,
            duration: 1.1,
            stagger: 0.09,
            ease: "expo.out",
            scrollTrigger: { trigger: "#contact", start: "top 75%", once: true },
          });
        },
        () => appear(".cl-reveal")
      );
    },
    { scope: root }
  );

  return (
    <div ref={root}>
      {/* ---------- Contact ---------- */}
      <section
        id="contact"
        className="relative flex min-h-[70svh] flex-col items-center justify-center px-6 py-28 text-center md:px-10"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-[1]"
          style={{
            background:
              "radial-gradient(60% 45% at 50% 50%, var(--color-ink) 35%, transparent 75%)",
          }}
        />
        <h2 className="cl-reveal display text-[clamp(2.5rem,8vw,6rem)]">
          Let&apos;s build something that ships.
        </h2>

        <p className="cl-reveal mt-6 max-w-xl text-fg-dim">
          Open to full-time roles, contract engagements and freelance work —
          with clients in the US, Canada and Pakistan.
        </p>

        <div className="cl-reveal mt-10 flex w-full max-w-xl flex-col items-stretch overflow-hidden rounded-xl border border-line bg-ink-2/60 backdrop-blur-md sm:flex-row">
          <span className="flex-1 px-5 py-4 text-left text-sm text-fg-dim">
            {site.email}
          </span>
          <a
            href={`mailto:${site.email}`}
            className="group flex items-center justify-center gap-2 border-line px-6 py-4 text-sm transition-colors hover:bg-surface sm:border-l"
          >
            Email me
            <span className="size-1.5 rounded-full bg-a1 transition-transform group-hover:scale-150" />
          </a>
        </div>

        <p className="cl-reveal mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-sm text-fg-mute">
          <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="transition-colors hover:text-fg">
            {site.phone}
          </a>
          <span aria-hidden>·</span>
          <a
            href={site.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-fg"
          >
            LinkedIn ↗
          </a>
        </p>

        <p className="cl-reveal label mt-8">
          {site.location} · {site.relocation}
        </p>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="relative overflow-hidden border-t border-line px-6 pt-16 pb-10 md:px-10">
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 right-0 h-72 w-2/3 opacity-40"
          style={{
            background:
              "radial-gradient(60% 70% at 80% 100%, var(--color-a2), transparent 70%)",
          }}
        />
        <div className="relative mx-auto grid w-full max-w-6xl gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="flex items-center gap-2 text-sm">
              <span className="text-a2">✳</span>
              <span className="font-medium">{site.name}</span>
            </p>
            <p className="label mt-4 max-w-[34ch] leading-relaxed">{site.role}</p>
            <p className="mt-3 max-w-[36ch] text-xs leading-relaxed text-fg-mute">
              {site.clients}
            </p>
          </div>

          {footerColumns.map((col) => (
            <div key={col.title} className="md:col-span-3">
              <p className="label mb-4">{col.title}</p>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-sm text-fg-dim transition-colors hover:text-fg"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="relative mx-auto mt-14 w-full max-w-6xl border-t border-line pt-6">
          <p className="label">© {new Date().getFullYear()} {site.name}</p>
        </div>
      </footer>
    </div>
  );
}
