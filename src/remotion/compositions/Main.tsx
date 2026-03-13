import {
  AbsoluteFill,
  Sequence,
  Artifact,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  prefetch,
} from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { loadFont as loadPlayfairDisplay } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadLato } from "@remotion/google-fonts/Lato";
import { useEffect } from "react";

import { Background } from "./scenes/Background";
import { SceneHook } from "./scenes/SceneHook";
import { SceneFeature } from "./scenes/SceneFeature";
import { SceneCTA } from "./scenes/SceneCTA";

// ═══════════════════════════════════════════
// Asset URLs
// ═══════════════════════════════════════════
const VO = {
  hook: "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/audio/1773406646927_2yo5sykbn7s_onwK4e9Z_What_if_you_could_ha.mp3",
  files: "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/audio/1773406649552_cgi9wtnmry_onwK4e9Z_Just_point_Claude_at.mp3",
  spreadsheet: "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/audio/1773406652329_z3t4epfdjd_onwK4e9Z_Need_a_comprehensive.mp3",
  report: "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/audio/1773406655300_3zm02gqo39v_onwK4e9Z_Preparing_a_report__.mp3",
  cta: "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/audio/1773406657575_r1s8u61dhld_onwK4e9Z_Set_a_task__Step_awa.mp3",
};

const SFX = {
  whoosh: "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/sfx/1773406669452_bx52le5xixu_sfx_subtle_modern_tech_UI_whoosh_t.mp3",
  chime: "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/sfx/1773406672268_ob6wc476sy_sfx_soft_ambient_digital_notificat.mp3",
};

const IMAGES = {
  fileOrganizer: "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/claude-cowork/1773406694788_znm9yoskoqn_file_organizer_ui.png",
  spreadsheet: "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/claude-cowork/1773406696516_e3gw9xuyita_spreadsheet_builder_ui.png",
  report: "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/claude-cowork/1773406699192_d4r0zj4g1q9_report_generator_ui.png",
};

const CLAUDE_FAVICON =
  "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/claude-cowork/1773406582007_2876vpd6grx_claude_favicon.png";

// ═══════════════════════════════════════════
// Scene durations (frames at 30fps)
// ═══════════════════════════════════════════
const TRANSITION_DURATION = 20; // frames

const SCENE_DURATIONS = {
  hook: 330,         // 11.0s
  files: 370,        // 12.3s
  spreadsheet: 350,  // 11.7s
  report: 360,       // 12.0s
  cta: 280,          // 9.3s (+ extra 30 frames pad at end)
};

// Total: 330 + 370 + 350 + 360 + 280 - 4*20 = 1610 frames = ~53.7s

export const Main: React.FC = () => {
  const { fontFamily: headingFont } = loadPlayfairDisplay("normal", {
    weights: ["700"],
    subsets: ["latin"],
  });
  const { fontFamily: bodyFont } = loadLato("normal", {
    weights: ["400", "700"],
    subsets: ["latin"],
  });

  // Prefetch all remote images so they render reliably
  useEffect(() => {
    const handles = [
      prefetch(IMAGES.fileOrganizer, { method: "blob-url" }),
      prefetch(IMAGES.spreadsheet, { method: "blob-url" }),
      prefetch(IMAGES.report, { method: "blob-url" }),
      prefetch(CLAUDE_FAVICON, { method: "blob-url" }),
    ];
    return () => {
      handles.forEach((h) => h.free());
    };
  }, []);

  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Content fade in (background stays fully visible)
  const contentFadeIn = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 30, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp" }
  );

  // VO start frames (accounting for transitions)
  const voStarts = {
    hook: 10,
    files: 330 - TRANSITION_DURATION + 15,
    spreadsheet: 330 + 370 - 2 * TRANSITION_DURATION + 15,
    report: 330 + 370 + 350 - 3 * TRANSITION_DURATION + 15,
    cta: 330 + 370 + 350 + 360 - 4 * TRANSITION_DURATION + 10,
  };

  // SFX timings (play whoosh at each transition)
  const transitionStarts = [
    330 - TRANSITION_DURATION,
    330 + 370 - 2 * TRANSITION_DURATION,
    330 + 370 + 350 - 3 * TRANSITION_DURATION,
    330 + 370 + 350 + 360 - 4 * TRANSITION_DURATION,
  ];

  return (
    <>
      {frame === 0 && (
        <Artifact content={Artifact.Thumbnail} filename="thumbnail.jpeg" />
      )}

      {/* Background always visible — never fades to black */}
      <Background />

      {/* Content layer with fade in/out */}
      <AbsoluteFill style={{ opacity: contentFadeIn * fadeOut }}>
        {/* Scene transitions */}
        <TransitionSeries>
          {/* Scene 1: Hook */}
          <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.hook}>
            <SceneHook headingFont={headingFont} bodyFont={bodyFont} />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={fade()}
            timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
          />

          {/* Scene 2: File Organization */}
          <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.files}>
            <SceneFeature
              headingFont={headingFont}
              bodyFont={bodyFont}
              featureNumber="Feature 01"
              title="Organize files automatically"
              subtitle="Point Claude at your messy Downloads folder. It sorts documents, images, spreadsheets into perfectly organized categories."
              imageUrl={IMAGES.fileOrganizer}
            />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={fade()}
            timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
          />

          {/* Scene 3: Spreadsheet Building */}
          <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.spreadsheet}>
            <SceneFeature
              headingFont={headingFont}
              bodyFont={bodyFont}
              featureNumber="Feature 02"
              title="Build comprehensive spreadsheets"
              subtitle="Claude pulls from your local files, structures the information, and builds spreadsheets — row by row, automatically."
              imageUrl={IMAGES.spreadsheet}
            />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={fade()}
            timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
          />

          {/* Scene 4: Report Preparation */}
          <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.report}>
            <SceneFeature
              headingFont={headingFont}
              bodyFont={bodyFont}
              featureNumber="Feature 03"
              title="Prepare detailed reports"
              subtitle="Claude reads your documents, analyzes key insights, and drafts polished reports — keeping you informed at every step."
              imageUrl={IMAGES.report}
            />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={fade()}
            timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
          />

          {/* Scene 5: CTA */}
          <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.cta}>
            <SceneCTA headingFont={headingFont} bodyFont={bodyFont} />
          </TransitionSeries.Sequence>
        </TransitionSeries>

        {/* ═══ AUDIO LAYER ═══ */}

        {/* Voiceovers */}
        <Sequence from={voStarts.hook} layout="none">
          <Audio src={VO.hook} volume={0.95} />
        </Sequence>
        <Sequence from={voStarts.files} layout="none">
          <Audio src={VO.files} volume={0.95} />
        </Sequence>
        <Sequence from={voStarts.spreadsheet} layout="none">
          <Audio src={VO.spreadsheet} volume={0.95} />
        </Sequence>
        <Sequence from={voStarts.report} layout="none">
          <Audio src={VO.report} volume={0.95} />
        </Sequence>
        <Sequence from={voStarts.cta} layout="none">
          <Audio src={VO.cta} volume={0.95} />
        </Sequence>

        {/* Transition SFX */}
        {transitionStarts.map((startFrame, i) => (
          <Sequence key={`whoosh-${i}`} from={startFrame} layout="none">
            <Audio src={SFX.whoosh} volume={0.2} />
          </Sequence>
        ))}

        {/* Chime at CTA button appearance */}
        <Sequence from={voStarts.cta + 55} layout="none">
          <Audio src={SFX.chime} volume={0.25} />
        </Sequence>
      </AbsoluteFill>
    </>
  );
};
