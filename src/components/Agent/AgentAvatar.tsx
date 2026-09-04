/**
 * The assistant's face. A duotoned circuit-brain disc (baked by
 * scripts/bake-agent-avatar.mjs onto the site's own accent ramp) under three
 * cheap CSS layers that give it depth without a second WebGL context:
 * a rotating conic ring, a specular highlight, and an inset shadow at the
 * lower edge so the disc reads as domed.
 *
 * Only transform and opacity animate. State changes the ring's speed, never
 * the properties being animated.
 *
 * "speaking" adds two more: a soft glow whose opacity is driven by `level`
 * (0-1), written every frame from the Web Audio analyser in AgentLauncher
 * while the intro voice/music plays, and a pair of small dots orbiting the
 * disc on opposite paths for a sense of depth without an actual 3D context.
 * The CSS pulse under "speaking" is the baseline and needs no `level` at
 * all, so the avatar still reads as "talking" even if the analyser never
 * attaches.
 */
export type AvatarState = "idle" | "open" | "thinking" | "speaking";

export default function AgentAvatar({
  size = 40,
  state = "idle",
  level = 0,
  className = "",
}: {
  size?: number;
  state?: AvatarState;
  level?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      data-state={state}
      className={`agent-avatar ${className}`}
      style={
        {
          "--avatar-size": `${size}px`,
          "--avatar-level": level,
        } as React.CSSProperties
      }
    >
      {state === "speaking" && (
        <>
          <span className="agent-avatar-glow" />
          <span className="agent-avatar-orbit" aria-hidden>
            <span />
            <span />
          </span>
        </>
      )}
      <span className="agent-avatar-ring" />
      <span className="agent-avatar-disc" />
      <span className="agent-avatar-gloss" />
    </span>
  );
}
