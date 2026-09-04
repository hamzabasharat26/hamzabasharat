import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Hide the floating "N" dev overlay button. It only ever renders under
  // `next dev` — never in `next start` / production — but it should not be on
  // screen while judging the design locally either.
  devIndicators: false,
  images: {
    // The only SVG ever passed to next/image is our own built mockup poster
    // (public/media/recruiter/ranking.svg) — static, authored here, no user
    // input. CSP below still blocks scripts inside any SVG that slips through.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Every file under public/media/ is a build-time asset with a stable path —
  // nothing there is ever replaced in place — so it can be cached hard at the
  // edge/browser. Cuts the "media is slow on a fresh deploy" case: a repeat
  // visit (or a second page on the same visit) never re-fetches a clip or a
  // poster it already has.
  async headers() {
    return [
      // Baseline hardening on every route. No site-wide CSP here yet — this
      // page loads Google Fonts + a handful of same-origin scripts and
      // getting a Content-Security-Policy right needs it enumerated
      // deliberately, not guessed; these four are safe, narrow wins with no
      // behavior to break.
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        source: "/media/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/agent/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/sounds/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
