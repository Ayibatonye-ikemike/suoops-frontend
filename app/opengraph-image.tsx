import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "SuoOps — Invoice & Get Paid from WhatsApp";

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
          background: "linear-gradient(135deg, #0a1628 0%, #0f2218 50%, #0a1628 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
          }}
        >
          <div
            style={{
              fontSize: "72px",
              fontWeight: 700,
              color: "#22c55e",
              letterSpacing: "-2px",
            }}
          >
            SuoOps
          </div>
          <div
            style={{
              fontSize: "32px",
              fontWeight: 600,
              color: "#ffffff",
              textAlign: "center",
              maxWidth: "800px",
              lineHeight: 1.3,
            }}
          >
            Invoice Customers & Get Paid from WhatsApp
          </div>
          <div
            style={{
              fontSize: "20px",
              color: "#9ca3af",
              textAlign: "center",
              maxWidth: "700px",
              marginTop: "8px",
            }}
          >
            Professional invoicing, expense tracking & tax compliance for SMEs
          </div>
          <div
            style={{
              display: "flex",
              gap: "16px",
              marginTop: "24px",
            }}
          >
            {["📱 WhatsApp-first", "🧾 Tax-aware", "⚡ Mobile-friendly"].map(
              (tag) => (
                <div
                  key={tag}
                  style={{
                    background: "rgba(34, 197, 94, 0.15)",
                    border: "1px solid rgba(34, 197, 94, 0.3)",
                    borderRadius: "999px",
                    padding: "8px 20px",
                    fontSize: "18px",
                    color: "#22c55e",
                  }}
                >
                  {tag}
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
