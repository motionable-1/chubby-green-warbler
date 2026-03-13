import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Img,
  Easing,
} from "remotion";
import { FadeInWords, FadeInChars } from "../../library/components/text/TextAnimation";

interface SceneFeatureProps {
  headingFont: string;
  bodyFont: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  featureNumber: string;
  accentColor?: string;
  iconUrl?: string;
}

export const SceneFeature: React.FC<SceneFeatureProps> = ({
  headingFont,
  bodyFont,
  title,
  subtitle,
  imageUrl,
  featureNumber,
  accentColor = "#3898EC",
  iconUrl,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Feature number fade in
  const numProgress = spring({ frame, fps, config: { damping: 200 }, delay: 5 });

  // Title entrance
  const titleDelay = 12;

  // Mockup image entrance with scale and shadow (enter quickly alongside text)
  const imgProgress = spring({ frame, fps, config: { damping: 15, stiffness: 80 }, delay: 8 });
  const imgScale = interpolate(imgProgress, [0, 1], [0.92, 1]);
  const imgOpacity = interpolate(imgProgress, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });
  const imgY = interpolate(imgProgress, [0, 1], [40, 0]);

  // Shadow grows as image settles
  const shadowBlur = interpolate(imgProgress, [0, 1], [5, 30]);
  const shadowOpacity = interpolate(imgProgress, [0, 1], [0, 0.15]);

  // Subtitle entrance
  const subProgress = spring({ frame, fps, config: { damping: 200 }, delay: 50 });
  const subOpacity = interpolate(subProgress, [0, 1], [0, 1]);
  const subY = interpolate(subProgress, [0, 1], [12, 0]);

  // Floating indicator dot
  const dotPulse = Math.sin((frame / fps) * 3) * 0.3 + 0.7;

  // Progress bar simulating task completion
  const progressBarWidth = interpolate(frame, [40, 220], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  });

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
          flexDirection: "row",
          alignItems: "center",
          gap: 60,
          maxWidth: 1150,
          padding: "0 80px",
          width: "100%",
        }}
      >
        {/* Left: Text content */}
        <div
          style={{
            flex: "0 0 380px",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {/* Feature number badge */}
          <div
            style={{
              opacity: numProgress,
              transform: `translateX(${interpolate(numProgress, [0, 1], [-20, 0])}px)`,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: accentColor,
                opacity: dotPulse,
                boxShadow: `0 0 8px ${accentColor}60`,
              }}
            />
            <span
              style={{
                fontFamily: bodyFont,
                fontSize: 14,
                fontWeight: 600,
                color: accentColor,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              {featureNumber}
            </span>
          </div>

          {/* Title */}
          <FadeInWords
            startFrom={titleDelay}
            stagger={0.08}
            duration={0.5}
            ease="power3.out"
          >
            <h2
              style={{
                fontFamily: headingFont,
                fontSize: 44,
                fontWeight: 700,
                color: "#141413",
                lineHeight: 1.15,
                textWrap: "balance",
                margin: 0,
              }}
            >
              {title}
            </h2>
          </FadeInWords>

          {/* Subtitle */}
          <div
            style={{
              opacity: subOpacity,
              transform: `translateY(${subY}px)`,
            }}
          >
            <FadeInChars
              startFrom={55}
              stagger={0.01}
              duration={0.4}
            >
              <p
                style={{
                  fontFamily: bodyFont,
                  fontSize: 18,
                  fontWeight: 400,
                  color: "#6B6A66",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {subtitle}
              </p>
            </FadeInChars>
          </div>

          {/* Task progress indicator */}
          <div
            style={{
              opacity: interpolate(frame, [60, 75], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              marginTop: 8,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  fontFamily: bodyFont,
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#9E9D99",
                }}
              >
                Task progress
              </span>
              <span
                style={{
                  fontFamily: bodyFont,
                  fontSize: 13,
                  fontWeight: 600,
                  color: accentColor,
                }}
              >
                {Math.round(progressBarWidth)}%
              </span>
            </div>
            <div
              style={{
                width: "100%",
                height: 4,
                background: "rgba(20,20,19,0.06)",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${progressBarWidth}%`,
                  height: "100%",
                  background: `linear-gradient(90deg, ${accentColor}, ${accentColor}CC)`,
                  borderRadius: 4,
                }}
              />
            </div>
          </div>
        </div>

        {/* Right: Mockup image */}
        <div
          style={{
            flex: 1,
            opacity: imgOpacity,
            transform: `translateY(${imgY}px) scale(${imgScale})`,
          }}
        >
          <div
            style={{
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: `0 ${shadowBlur / 2}px ${shadowBlur}px rgba(20,20,19,${shadowOpacity})`,
              border: "1px solid rgba(20,20,19,0.08)",
            }}
          >
            <Img
              src={imageUrl}
              style={{
                width: "100%",
                height: "auto",
                display: "block",
              }}
            />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
