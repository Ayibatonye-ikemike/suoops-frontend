import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "SuoOps — The commerce operating system for African business";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background:
            "linear-gradient(135deg, #0B3318 0%, #0f2a1a 55%, #0a1f14 100%)",
          fontFamily: "sans-serif",
          padding: "64px",
        }}
      >
        {/* Logo + wordmark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "36px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "96px",
              height: "96px",
              borderRadius: "24px",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://suoops.com/icon.png"
              alt="SuoOps"
              width={64}
              height={64}
            />
          </div>
          <div
            style={{
              fontSize: "68px",
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "-2px",
            }}
          >
            SuoOps
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: "56px",
            fontWeight: 700,
            color: "#ffffff",
            textAlign: "center",
            maxWidth: "1000px",
            lineHeight: 1.15,
          }}
        >
          Sell, get paid &amp; grow{" "}
          <span style={{ color: "#BFF74A" }}>— all in one place</span>
        </div>

        {/* Captivating hook: buyer protection */}
        <div
          style={{
            fontSize: "26px",
            color: "#E8F5EC",
            textAlign: "center",
            maxWidth: "860px",
            marginTop: "20px",
            lineHeight: 1.35,
          }}
        >
          Buyer-protected commerce for African business — your money is held safely
          until the order arrives.
        </div>

        {/* Pillar badges */}
        <div style={{ display: "flex", gap: "16px", marginTop: "36px" }}>
          {["🛍️ Marketplace", "🛡️ Buyer Protection", "⚙️ Operations"].map(
            (tag) => (
              <div
                key={tag}
                style={{
                  display: "flex",
                  background: "rgba(20, 181, 106, 0.18)",
                  border: "1px solid rgba(20, 181, 106, 0.45)",
                  borderRadius: "999px",
                  padding: "10px 24px",
                  fontSize: "22px",
                  color: "#14B56A",
                }}
              >
                {tag}
              </div>
            ),
          )}
        </div>
      </div>
    ),
    { ...size },
  );
}
