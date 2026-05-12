import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";
import { TOPICS, getTopicBySlug } from "@/lib/topics";
import { getMessages } from "@/i18n/server";
import { localizeTopic } from "@/i18n/localize";

export const alt = "Still Human Podcast — Topic";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Pre-generate one OG image per topic
export async function generateImageMetadata() {
  return TOPICS.map((t) => ({
    id: t.slug,
    alt: `Still Human Podcast — ${t.name}`,
    size,
    contentType,
  }));
}

// Hex tint per topic, matched to the on-site color palette
const TOPIC_TINT: Record<string, { glow: string; accent: string }> = {
  "ai-technology": { glow: "rgba(96,165,250,0.30)", accent: "#60a5fa" },
  entrepreneurship: { glow: "rgba(192,132,252,0.30)", accent: "#c084fc" },
  "identity-humanity": { glow: "rgba(45,212,191,0.30)", accent: "#2dd4bf" },
  "science-engineering": { glow: "rgba(74,222,128,0.30)", accent: "#4ade80" },
  "mental-resilience": { glow: "rgba(251,146,60,0.30)", accent: "#fb923c" },
  "space-future": { glow: "rgba(129,140,248,0.30)", accent: "#818cf8" },
};

type Props = { params: Promise<{ topic: string }> };

export default async function TopicOGImage({ params }: Props) {
  const { topic: slug } = await params;
  const raw = getTopicBySlug(slug);
  if (!raw) {
    return new ImageResponse(<div>Unknown topic</div>, { ...size });
  }
  const m = await getMessages();
  const topic = localizeTopic(raw, m);
  const tint = TOPIC_TINT[slug] ?? { glow: "rgba(255,255,255,0.18)", accent: "#ffffff" };

  const interBlack = await readFile(
    join(process.cwd(), "node_modules/geist/dist/fonts/geist-sans/Geist-UltraBlack.ttf")
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#050507",
          fontFamily: "Geist",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Brand-color glow, top-left */}
        <div
          style={{
            position: "absolute",
            top: "-200px",
            left: "-100px",
            width: "700px",
            height: "500px",
            borderRadius: "50%",
            background: `radial-gradient(ellipse, ${tint.glow} 0%, transparent 65%)`,
          }}
        />

        {/* Tag pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "8px 18px",
            borderRadius: "100px",
            border: `1px solid ${tint.accent}55`,
            backgroundColor: `${tint.accent}1A`,
            fontSize: "16px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: tint.accent,
            marginBottom: "32px",
          }}
        >
          Still Human · Topic
        </div>

        {/* Topic name */}
        <div
          style={{
            fontSize: "84px",
            fontWeight: 900,
            color: "#ffffff",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            maxWidth: "1000px",
            marginBottom: "32px",
          }}
        >
          {topic.name}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: "26px",
            fontWeight: 300,
            color: "rgba(255,255,255,0.55)",
            lineHeight: 1.4,
            maxWidth: "900px",
          }}
        >
          {topic.description}
        </div>

        {/* Bottom right brand mark */}
        <div
          style={{
            position: "absolute",
            bottom: "60px",
            right: "80px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: "18px",
            color: "rgba(255,255,255,0.45)",
            letterSpacing: "0.05em",
          }}
        >
          oshenstudio.com
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Geist",
          data: interBlack,
          style: "normal",
          weight: 900,
        },
      ],
    }
  );
}
