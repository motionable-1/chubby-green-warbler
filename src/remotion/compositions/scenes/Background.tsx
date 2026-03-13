import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";

export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;

  // Slow drift for ambient gradient movement
  const gradX1 = 30 + Math.sin(time * 0.15) * 15;
  const gradY1 = 20 + Math.cos(time * 0.12) * 10;
  const gradX2 = 70 + Math.cos(time * 0.18) * 12;
  const gradY2 = 65 + Math.sin(time * 0.14) * 15;

  // Subtle warm-cream background matching Anthropic branding
  return (
    <AbsoluteFill
      style={{
        background: "#FAF9F5",
        overflow: "hidden",
      }}
    >
      {/* Primary blue gradient orb */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at ${gradX1}% ${gradY1}%, rgba(56,152,236,0.12), transparent 50%)`,
        }}
      />

      {/* Secondary warm orb */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at ${gradX2}% ${gradY2}%, rgba(217,119,87,0.08), transparent 45%)`,
        }}
      />

      {/* Dot grid pattern */}
      <div
        style={{
          position: "absolute",
          inset: -50,
          backgroundImage: `radial-gradient(circle, rgba(20,20,19,0.06) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
          backgroundPosition: `${Math.sin(time * 0.05) * 4}px ${Math.cos(time * 0.04) * 4}px`,
          opacity: 0.7,
        }}
      />

      {/* Floating geometric shapes for depth */}
      {[0, 1, 2, 3, 4].map((i) => {
        const baseX = [15, 78, 45, 88, 25][i];
        const baseY = [12, 35, 80, 72, 55][i];
        const size = [60, 45, 80, 35, 55][i];
        const speed = [0.08, 0.12, 0.06, 0.1, 0.09][i];
        const phase = i * 1.2;

        const x = baseX + Math.sin(time * speed + phase) * 3;
        const y = baseY + Math.cos(time * speed * 0.8 + phase) * 2;
        const rotation = Math.sin(time * speed * 0.5 + phase) * 15;
        const opacity = interpolate(
          Math.sin(time * speed * 1.5 + phase),
          [-1, 1],
          [0.02, 0.06]
        );

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size,
              borderRadius: i % 2 === 0 ? "50%" : "8px",
              border: `1px solid rgba(56,152,236,${opacity * 3})`,
              transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
              opacity,
            }}
          />
        );
      })}

      {/* Edge vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 60%, rgba(20,20,19,0.04) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
