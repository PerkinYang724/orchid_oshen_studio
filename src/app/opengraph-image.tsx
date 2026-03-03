import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

export const alt = "Oshen Studio — AI Automation & Storytelling";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
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
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#050507",
          fontFamily: "Geist",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "800px",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(41,151,255,0.15) 0%, rgba(41,151,255,0.05) 40%, transparent 70%)",
          }}
        />

        {/* Top label */}
        <div
          style={{
            display: "flex",
            letterSpacing: "0.25em",
            fontSize: "14px",
            fontWeight: 500,
            color: "rgba(255,255,255,0.35)",
            textTransform: "uppercase",
            marginBottom: "32px",
          }}
        >
          AI · Automation · Storytelling
        </div>

        {/* Main title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              fontSize: "96px",
              fontWeight: 900,
              color: "#ffffff",
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
            }}
          >
            Oshen Studio
          </div>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "26px",
            fontWeight: 300,
            color: "rgba(255,255,255,0.45)",
            textAlign: "center",
            maxWidth: "600px",
            lineHeight: 1.5,
            marginBottom: "56px",
          }}
        >
          Building systems that give time back.
        </div>

        {/* Bottom URL pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "10px 28px",
            borderRadius: "100px",
            border: "1px solid rgba(255,255,255,0.12)",
            backgroundColor: "rgba(255,255,255,0.04)",
            fontSize: "16px",
            color: "rgba(255,255,255,0.4)",
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
