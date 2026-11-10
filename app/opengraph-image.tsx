import { ImageResponse } from "next/og";
import { profile } from "@/lib/data";

export const alt = `${profile.name} | ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 80,
        background: "linear-gradient(135deg, #0F1F21, #162A2C)",
        color: "#FEFCF6",
      }}
    >
      <div style={{ display: "flex", fontSize: 28, color: "#A3B59B" }}>
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
          color: "#A9B4B4",
        }}
      >
        {profile.tagline}
      </div>
    </div>,
    { ...size },
  );
}
