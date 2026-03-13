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

interface SceneHookProps {
  headingFont: string;
  bodyFont: string;
}

export const SceneHook: React.FC<SceneHookProps> = ({
  headingFont,
  bodyFont,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo entrance spring
  const logoScale = spring({ frame, fps, config: { damping: 12, stiffness: 100 }, delay: 8 });
  const logoOpacity = interpolate(logoScale, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });

  // Badge pill reveal
  const pillProgress = spring({ frame, fps, config: { damping: 200 }, delay: 20 });
  const pillY = interpolate(pillProgress, [0, 1], [20, 0]);

  // Headline stagger
  const headlineDelay = 35;

  // Subtitle appearance
  const subProgress = spring({ frame, fps, config: { damping: 200 }, delay: 70 });
  const subOpacity = interpolate(subProgress, [0, 1], [0, 1]);
  const subY = interpolate(subProgress, [0, 1], [15, 0]);

  // Decorative line
  const lineWidth = spring({ frame, fps, config: { damping: 200 }, delay: 55 });

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
          gap: 28,
          maxWidth: 1050,
          padding: "0 60px",
        }}
      >
        {/* Claude logo */}
        <div
          style={{
            transform: `scale(${logoScale})`,
            opacity: logoOpacity,
          }}
        >
          <Img
            src={CLAUDE_FAVICON}
            style={{
              width: 64,
              height: 64,
              objectFit: "contain",
            }}
          />
        </div>

        {/* Research preview pill */}
        <div
          style={{
            opacity: pillProgress,
            transform: `translateY(${pillY}px)`,
            background: "rgba(56,152,236,0.1)",
            border: "1px solid rgba(56,152,236,0.25)",
            borderRadius: 100,
            padding: "8px 24px",
          }}
        >
          <span
            style={{
              fontFamily: bodyFont,
              fontSize: 16,
              fontWeight: 500,
              color: "#3898EC",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            Introducing Cowork
          </span>
        </div>

        {/* Main headline */}
        <FadeInWords
          startFrom={headlineDelay}
          stagger={0.08}
          duration={0.6}
          ease="power3.out"
          style={{
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontFamily: headingFont,
              fontSize: 72,
              fontWeight: 700,
              color: "#141413",
              lineHeight: 1.1,
              textWrap: "balance",
              margin: 0,
            }}
          >
            Go from answers{" "}
            <span style={{ color: "#3898EC" }}>to action</span>
          </h1>
        </FadeInWords>

        {/* Decorative line */}
        <div
          style={{
            width: `${lineWidth * 120}px`,
            height: 2,
            background: "linear-gradient(90deg, transparent, #3898EC, transparent)",
            borderRadius: 2,
          }}
        />

        {/* Subtitle */}
        <div
          style={{
            opacity: subOpacity,
            transform: `translateY(${subY}px)`,
          }}
        >
          <BlurReveal
            startFrom={75}
            stagger={0.04}
            duration={0.5}
            style={{ textAlign: "center" }}
          >
            <p
              style={{
                fontFamily: bodyFont,
                fontSize: 26,
                fontWeight: 400,
                color: "#4D4C48",
                lineHeight: 1.5,
                textWrap: "balance",
                margin: 0,
                maxWidth: 700,
              }}
            >
              Your autonomous AI desktop assistant that completes
              tasks while you focus on what matters.
            </p>
          </BlurReveal>
        </div>
      </div>
    </AbsoluteFill>
  );
};
