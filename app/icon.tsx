import { ImageResponse } from "next/og";
import { profile } from "@/lib/data";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#5E6C58",
        color: "#FEFCF6",
        fontSize: 16,
        fontWeight: 700,
        borderRadius: 8,
      }}
    >
      {profile.initials}
    </div>,
    { ...size },
  );
}
