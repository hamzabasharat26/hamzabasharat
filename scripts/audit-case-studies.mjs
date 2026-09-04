/* ============================================================
   audit-case-studies.mjs — DEV ONLY.

   Screenshots each case study at 360px and 1280px and checks the
   accessibility floor in CLAUDE.md §5 in the real rendered DOM:
   heading outline, alt text, focus visibility, contrast of body
   text against its ACTUAL composited background.

   Chrome DevTools MCP is the intended tool for this (§8.6). It
   failed to connect, so this drives the same engine directly via
   puppeteer-core and reports the same numbers.

   Usage: node scripts/audit-case-studies.mjs [outDir] [baseUrl]
   ============================================================ */

import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

const OUT = process.argv[2] ?? "shots/case-studies";
const BASE = process.argv[3] ?? "http://localhost:3000";

const SLUGS = process.argv.includes("--all")
  ? null // resolved from the page
  : ["magicqc", "fabric-defect-detection"];

const SIZES = [
  { name: "360", width: 360, height: 740, dsf: 2 },
  { name: "1280", width: 1280, height: 800, dsf: 1 },
];

const CHROME = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
].find((p) => fs.existsSync(p));
if (!CHROME) throw new Error("No Chrome/Edge found");

fs.mkdirSync(OUT, { recursive: true });

// A fixed profile dir plus a swallowed close(): on Windows, Chrome's crashpad
// still holds CrashpadMetrics-active.pma when puppeteer tries to delete the
// temp profile, and the EPERM kills the process AFTER the audit has already
// succeeded. The teardown is not worth failing the run over.
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  userDataDir: path.join(OUT, ".chrome-profile"),
  args: ["--hide-scrollbars", "--force-color-profile=srgb"],
});

/** Relative luminance per WCAG 2.1. */
const lum = ([r, g, b]) => {
  const f = (v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => {
  const [hi, lo] = lum(a) >= lum(b) ? [lum(a), lum(b)] : [lum(b), lum(a)];
  return (hi + 0.05) / (lo + 0.05);
};

const results = [];

for (const slug of SLUGS) {
  const url = `${BASE}/work/${slug}`;

  for (const size of SIZES) {
    const page = await browser.newPage();
    await page.setViewport({
      width: size.width,
      height: size.height,
      deviceScaleFactor: size.dsf,
    });

    const consoleErrors = [];
    page.on("console", (m) => {
      if (m.type() === "error") consoleErrors.push(m.text());
    });
    page.on("pageerror", (e) => consoleErrors.push(e.message));

    await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });
    await page.evaluate(() => document.fonts.ready);

    const file = path.join(OUT, `${slug}-${size.name}.png`);
    await page.screenshot({ path: file, fullPage: true });

    // Only audit once per slug — the DOM is identical across widths.
    if (size.name === "1280") {
      const audit = await page.evaluate(() => {
        const toRgb = (s) => {
          const m = s.match(/\d+(\.\d+)?/g);
          return m ? m.slice(0, 3).map(Number) : null;
        };
        // Walk up until an ancestor paints an opaque background, which is what
        // the text is really composited against.
        const bgOf = (el) => {
          let n = el;
          while (n && n !== document.documentElement) {
            const cs = getComputedStyle(n);
            const c = toRgb(cs.backgroundColor);
            const alpha = Number(
              (cs.backgroundColor.match(/[\d.]+\)$/) || ["1)"])[0].slice(0, -1)
            );
            if (c && alpha > 0.95) return c;
            n = n.parentElement;
          }
          return toRgb(getComputedStyle(document.body).backgroundColor);
        };

        const headings = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map(
          (h) => ({
            level: Number(h.tagName[1]),
            text: h.textContent.trim().slice(0, 60),
          })
        );

        const imgs = [...document.querySelectorAll("img")].map((i) => ({
          src: i.getAttribute("src")?.slice(-42),
          alt: i.getAttribute("alt"),
          hasDims: Boolean(i.getAttribute("width") && i.getAttribute("height")),
        }));

        // Sample real body-copy nodes rather than trusting the token values.
        const sel = "p, li, dd, figcaption";
        const seen = new Map();
        for (const el of document.querySelectorAll(sel)) {
          if (!el.textContent.trim()) continue;
          const r = el.getBoundingClientRect();
          if (r.width === 0) continue;
          const cs = getComputedStyle(el);
          const key = `${cs.color}|${cs.fontSize}`;
          if (seen.has(key)) continue;
          seen.set(key, {
            color: toRgb(cs.color),
            bg: bgOf(el),
            fontSize: parseFloat(cs.fontSize),
            fontWeight: cs.fontWeight,
            sample: el.textContent.trim().slice(0, 40),
          });
        }

        const focusables = document.querySelectorAll(
          'a[href], button, input, [tabindex]:not([tabindex="-1"])'
        ).length;

        return {
          title: document.title,
          lang: document.documentElement.lang,
          headings,
          imgs,
          contrast: [...seen.values()],
          focusables,
          landmarks: {
            main: document.querySelectorAll("main").length,
            nav: document.querySelectorAll("nav").length,
          },
        };
      });

      // Focus-visible check: tab to the first link, confirm a real outline.
      await page.keyboard.press("Tab");
      const focusRing = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        const cs = getComputedStyle(el);
        return {
          el: el.tagName + (el.className ? "." + String(el.className).split(" ")[0] : ""),
          outlineWidth: cs.outlineWidth,
          outlineStyle: cs.outlineStyle,
          outlineColor: cs.outlineColor,
        };
      });

      results.push({ slug, ...audit, focusRing, consoleErrors });
    }

    await page.close();
  }
}

await browser.close().catch(() => {});

// ---- Report ----------------------------------------------------------------
let fail = 0;

for (const r of results) {
  console.log(`\n${"=".repeat(64)}\n${r.slug}\n${"=".repeat(64)}`);
  console.log(`title: ${r.title}`);
  console.log(`lang: ${r.lang || "(MISSING)"}   landmarks: main=${r.landmarks.main} nav=${r.landmarks.nav}`);

  console.log(`\n-- heading outline --`);
  let prev = 0;
  let h1s = 0;
  for (const h of r.headings) {
    if (h.level === 1) h1s++;
    const skip = prev && h.level > prev + 1;
    if (skip) fail++;
    console.log(
      `${"  ".repeat(h.level - 1)}h${h.level}  ${h.text}${skip ? "   <-- SKIPPED LEVEL" : ""}`
    );
    prev = h.level;
  }
  if (h1s !== 1) {
    console.log(`  !! ${h1s} h1 elements (must be exactly 1)`);
    fail++;
  }

  console.log(`\n-- images --`);
  for (const i of r.imgs) {
    const bad = !i.alt || i.alt.length < 12 || /^(screenshot|image|photo)/i.test(i.alt);
    if (bad || !i.hasDims) fail++;
    console.log(
      `  ${bad ? "FAIL" : "ok  "} dims=${i.hasDims ? "yes" : "NO "}  ${i.src}\n        alt: ${i.alt ?? "(none)"}`
    );
  }

  console.log(`\n-- contrast (WCAG AA: 4.5 body, 3.0 large) --`);
  for (const c of r.contrast) {
    if (!c.color || !c.bg) continue;
    const cr = ratio(c.color, c.bg);
    const large = c.fontSize >= 24 || (c.fontSize >= 18.66 && Number(c.fontWeight) >= 700);
    const need = large ? 3.0 : 4.5;
    const ok = cr >= need;
    if (!ok) fail++;
    console.log(
      `  ${ok ? "PASS" : "FAIL"} ${cr.toFixed(2)}:1 (need ${need})  ${c.fontSize}px  rgb(${c.color}) on rgb(${c.bg})\n        "${c.sample}"`
    );
  }

  console.log(`\n-- focus ring on first tab stop --`);
  if (!r.focusRing) {
    console.log("  FAIL no element received focus");
    fail++;
  } else {
    const w = parseFloat(r.focusRing.outlineWidth);
    const ok = w >= 1 && r.focusRing.outlineStyle !== "none";
    if (!ok) fail++;
    console.log(
      `  ${ok ? "PASS" : "FAIL"} ${r.focusRing.el}  ${r.focusRing.outlineStyle} ${r.focusRing.outlineWidth} ${r.focusRing.outlineColor}`
    );
  }

  if (r.consoleErrors.length) {
    console.log(`\n-- console errors --`);
    for (const e of r.consoleErrors.slice(0, 6)) console.log(`  ${e.slice(0, 140)}`);
  }
}

console.log(`\n${"=".repeat(64)}`);
console.log(fail === 0 ? "ALL CHECKS PASS" : `${fail} CHECK(S) FAILED`);
console.log(`screenshots: ${OUT}`);
process.exit(fail === 0 ? 0 : 1);
