import { ImageResponse } from "next/og";
import { projects, projectBySlug } from "@/content/projects";
import { site } from "@/content/site";

export const alt = "Case study";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  const metric = project?.outcome[0];

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
            fontSize: 24,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "#7d7989",
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 9999,
              background: "linear-gradient(135deg,#34d399,#22d3ee,#7c3aed)",
            }}
          />
          {site.name} — {project?.kicker ?? "Work"}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 72, lineHeight: 1.05, fontWeight: 300 }}>
            {project?.title ?? "Case study"}
          </div>
          {project?.problem && (
            <div style={{ fontSize: 28, color: "#a5a1b0", maxWidth: 980 }}>
              {project.problem}
            </div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "baseline", gap: 16, fontSize: 26, color: "#a5a1b0" }}>
          {metric && (
            <>
              <span style={{ fontSize: 48, color: "#f3f1f7" }}>{metric.value}</span>
              <span>{metric.label}</span>
            </>
          )}
        </div>
      </div>
    ),
    size
  );
}
