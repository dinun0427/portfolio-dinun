import { ImageResponse } from "next/og";
import { profile } from "@/lib/data";

export const alt = `${profile.name} | ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #05060a, #1a1d2b)",
          color: "white",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, color: "#22d3ee" }}>
          {profile.role}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 84,
            fontWeight: 700,
            marginTop: 16,
          }}
        >
          {profile.name}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 32,
            marginTop: 24,
            color: "#a1a1aa",
          }}
        >
          {profile.tagline}
        </div>
      </div>
    ),
    { ...size },
  );
}