import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#004225",
          primaryHover: "#007A4D",
          secondary: "#007A4D",
          background: "#F9F9F6",
          card: "#FFFFFF",
          border: "#E1E1DC",
          text: "#1A1A1A",
          textMuted: "#4F4F4F",
          statusPaidBg: "#DFF0D8",
          statusPaidText: "#3C763D",
          statusPendingBg: "#FCF8E3",
          statusPendingText: "#8A6D3B",
          accent: "#FFFFFF",
          accentMuted: "#E1E1DC",
          surface: "#F9F9F6",
        },
      },
    },
  },
  plugins: [],
};

export default config;
