import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = site.seo.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#060507",
          color: "#f3f1f7",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 26,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "#7d7989",
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 9999,
              background: "linear-gradient(135deg,#34d399,#22d3ee,#7c3aed)",
            }}
          />
          {site.name}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 68, lineHeight: 1.05, fontWeight: 300, maxWidth: 980 }}>
            {site.headline}
          </div>
          <div style={{ fontSize: 30, color: "#a5a1b0" }}>{site.role}</div>
        </div>

        <div style={{ display: "flex", gap: 48, fontSize: 24, color: "#a5a1b0" }}>
          {site.proofStrip.slice(0, 3).map((s) => (
            <div key={s.label} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 40, color: "#f3f1f7" }}>{s.value}</span>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}
