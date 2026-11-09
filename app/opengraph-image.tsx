import { ImageResponse } from "next/og"

export const alt = "Lumina Café — Coffee, slow as the tide"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 80,
          background: "linear-gradient(180deg, #fff8ef 0%, #f1e3cf 40%, #c8925a 78%, #2a1a12 100%)",
          color: "#2a1a12",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 8, textTransform: "uppercase", color: "#fff8ef" }}>Lumina Café</div>
        <div style={{ fontSize: 96, lineHeight: 1, marginTop: 16, color: "#fff8ef" }}>Coffee, slow as the tide.</div>
      </div>
    ),
    size
  )
}
