import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Img,
} from "remotion";
import { FadeInWords, BlurReveal } from "../../library/components/text/TextAnimation";

const CLAUDE_FAVICON =
  "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/claude-cowork/1773406582007_2876vpd6grx_claude_favicon.png";

interface SceneCTAProps {
  headingFont: string;
  bodyFont: string;
}

export const SceneCTA: React.FC<SceneCTAProps> = ({
  headingFont,
  bodyFont,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo entrance
  const logoProgress = spring({ frame, fps, config: { damping: 12, stiffness: 100 }, delay: 5 });
  const logoScale = interpolate(logoProgress, [0, 1], [0.6, 1]);

  // Headline stagger (fast entrance)
  const headDelay = 8;

  // Tagline entrance (faster)
  const tagProgress = spring({ frame, fps, config: { damping: 200 }, delay: 38 });
  const tagOpacity = interpolate(tagProgress, [0, 1], [0, 1]);

  // Button entrance (faster)
  const btnProgress = spring({ frame, fps, config: { damping: 15, stiffness: 120 }, delay: 55 });
  const btnScale = interpolate(btnProgress, [0, 1], [0.85, 1]);
  const btnOpacity = interpolate(btnProgress, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });

  // Shimmer across button
  const shimmerX = interpolate(
    frame,
    [70, 110],
    [-100, 200],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Three feature checkmarks stagger
  const features = [
    "Organize files automatically",
    "Build comprehensive spreadsheets",
    "Prepare detailed reports",
  ];

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 32,
          maxWidth: 900,
          padding: "0 60px",
        }}
      >
        {/* Claude logo */}
        <div
          style={{
            transform: `scale(${logoScale})`,
            opacity: logoProgress,
          }}
        >
          <Img
            src={CLAUDE_FAVICON}
            style={{
              width: 56,
              height: 56,
              objectFit: "contain",
            }}
          />
        </div>

        {/* Headline */}
        <FadeInWords
          startFrom={headDelay}
          stagger={0.1}
          duration={0.6}
          ease="power3.out"
          style={{ textAlign: "center" }}
        >
          <h1
            style={{
              fontFamily: headingFont,
              fontSize: 64,
              fontWeight: 700,
              color: "#141413",
              lineHeight: 1.1,
              textWrap: "balance",
              margin: 0,
            }}
          >
            Set a task. Step away.
            <br />
            <span style={{ color: "#3898EC" }}>Come back to results.</span>
          </h1>
        </FadeInWords>

        {/* Feature list */}
        <div
          style={{
            display: "flex",
            gap: 32,
            opacity: tagOpacity,
            transform: `translateY(${interpolate(tagProgress, [0, 1], [10, 0])}px)`,
          }}
        >
          {features.map((feat, i) => {
            const featProgress = spring({
              frame,
              fps,
              config: { damping: 200 },
              delay: 42 + i * 6,
            });
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  opacity: featProgress,
                  transform: `translateY(${interpolate(featProgress, [0, 1], [8, 0])}px)`,
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "rgba(56,152,236,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 6L5 9L10 3"
                      stroke="#3898EC"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span
                  style={{
                    fontFamily: bodyFont,
                    fontSize: 15,
                    fontWeight: 500,
                    color: "#4D4C48",
                  }}
                >
                  {feat}
                </span>
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        <div
          style={{
            opacity: btnOpacity,
            transform: `scale(${btnScale})`,
            position: "relative",
            overflow: "hidden",
            borderRadius: 12,
          }}
        >
          <div
            style={{
              background: "#141413",
              color: "#FAF9F5",
              fontFamily: bodyFont,
              fontSize: 20,
              fontWeight: 600,
              padding: "16px 48px",
              borderRadius: 12,
              letterSpacing: "0.02em",
            }}
          >
            Download Claude
          </div>
          {/* Shimmer highlight */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: `${shimmerX}%`,
              width: 60,
              height: "100%",
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Tagline */}
        <div
          style={{
            opacity: interpolate(frame, [75, 88], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <BlurReveal startFrom={80} stagger={0.04} duration={0.5}>
            <p
              style={{
                fontFamily: bodyFont,
                fontSize: 17,
                fontWeight: 400,
                color: "#7A7975",
                margin: 0,
              }}
            >
              Available on macOS and Windows
            </p>
          </BlurReveal>
        </div>
      </div>
    </AbsoluteFill>
  );
};
