import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "SuoOps — The commerce operating system for African business";

// Best-effort: embed the logo as a data URI so the card never fails to render
// if the asset fetch hiccups (a failed <img> can produce an empty image).
async function logoDataUri(): Promise<string | null> {
  try {
    const res = await fetch("https://suoops.com/icon.png");
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    return `data:${res.headers.get("content-type") || "image/png"};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function OgImage() {
  const logo = await logoDataUri();
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
              background: logo ? "rgba(255,255,255,0.08)" : "#14B56A",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logo} alt="SuoOps" width={64} height={64} />
            ) : (
              <div style={{ fontSize: "52px", fontWeight: 700, color: "#ffffff" }}>
                S
              </div>
            )}
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
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            fontSize: "56px",
            fontWeight: 700,
            color: "#ffffff",
            textAlign: "center",
            maxWidth: "1000px",
            lineHeight: 1.15,
          }}
        >
          <span>Sell, get paid &amp; grow&nbsp;</span>
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
